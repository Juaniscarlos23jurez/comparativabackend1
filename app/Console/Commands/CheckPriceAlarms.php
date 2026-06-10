<?php

namespace App\Console\Commands;

use App\Models\PriceAlarm;
use App\Mail\MedicationPriceDrop;
use App\Services\NeedyMedsService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CheckPriceAlarms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alarms:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check active medication price alarms and notify users if the lowest price drops.';

    /**
     * Execute the console command.
     */
    public function handle(NeedyMedsService $needyMedsService)
    {
        $this->info('Starting price alarm checks...');
        Log::info('Console: Starting alarms:check task.');

        $alarms = PriceAlarm::with('user')->get();

        if ($alarms->isEmpty()) {
            $this->info('No active price alarms found.');
            return;
        }

        foreach ($alarms as $alarm) {
            $user = $alarm->user;
            if (!$user) {
                continue;
            }

            $this->info("Checking alarm for User #{$user->id} - Medication: {$alarm->medication_name}");

            $zipCode = $user->zip_code ?? '88595';
            $radius = $user->radius ?? '42';

            // Retrieve live pharmacy prices for this drug
            $prices = $needyMedsService->getPharmacyPrices($alarm->medication_name, $zipCode, $radius);

            if (empty($prices)) {
                $this->warn("No pharmacy prices returned for {$alarm->medication_name}. Skipping.");
                continue;
            }

            // Find lowest price
            $lowestItem = null;
            foreach ($prices as $item) {
                if (isset($item['price'])) {
                    if ($lowestItem === null || (float)$item['price'] < (float)$lowestItem['price']) {
                        $lowestItem = $item;
                    }
                }
            }

            if ($lowestItem !== null) {
                $newLowestPrice = (float) $lowestItem['price'];
                $oldPrice = $alarm->last_price !== null ? (float)$alarm->last_price : null;

                $this->info("Live lowest: \${$newLowestPrice}. Last recorded: " . ($oldPrice !== null ? "\${$oldPrice}" : 'None'));

                if ($oldPrice === null) {
                    // Initial check, set last_price
                    $alarm->last_price = $newLowestPrice;
                    $alarm->save();
                    $this->info("Initial price set to \${$newLowestPrice} for alarm #{$alarm->id}.");
                } elseif ($newLowestPrice < $oldPrice) {
                    // Price dropped! Send email
                    $this->info("Price dropped! Sending email alert to {$user->email}.");
                    Log::info("Alarm: Price drop alert triggered for user {$user->email} on {$alarm->medication_name} (from \${$oldPrice} to \${$newLowestPrice}).");

                    $pharmacyName = $lowestItem['name'] ?? 'Local Pharmacy';
                    $pharmacyAddress = implode(', ', array_filter([
                        $lowestItem['street1'] ?? '',
                        $lowestItem['city'] ?? '',
                        $lowestItem['state'] ?? '',
                        $lowestItem['zipCode'] ?? ''
                    ]));

                    try {
                        Mail::to($user->email)->send(
                            new MedicationPriceDrop(
                                $alarm,
                                $oldPrice,
                                $newLowestPrice,
                                $pharmacyName,
                                $pharmacyAddress
                            )
                        );

                        // Save the new lower price as threshold
                        $alarm->last_price = $newLowestPrice;
                        $alarm->save();
                    } catch (\Exception $e) {
                        Log::error("Failed to send price drop email to {$user->email}: " . $e->getMessage());
                        $this->error("Email failure: " . $e->getMessage());
                    }
                } else {
                    $this->info("No price drop detected.");
                }
            }
        }

        $this->info('Price alarm checks completed.');
        Log::info('Console: alarms:check task completed.');
    }
}
