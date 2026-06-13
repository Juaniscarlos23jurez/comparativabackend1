<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\AssistanceProgram;
use App\Models\DiscountCoupon;
use App\Models\Diagnosis;
use App\Models\Clinic;

class SyncNeedyMeds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:needymeds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync assistance programs, coupons, diagnoses, and clinics from NeedyMeds API';

    /**
     * Helper to perform POST requests with rate-limiting retries (429) and built-in delay.
     */
    private function makePostRequest(string $url, array $params)
    {
        // Default spacing: 250ms between requests to avoid hitting rate limits
        usleep(250000); 

        $attempts = 0;
        $maxAttempts = 5;

        do {
            try {
                $response = Http::post($url, $params);

                if ($response->status() === 429) {
                    $attempts++;
                    $this->comment("Received 429 Rate Limit. Backing off for 6 seconds... (Attempt {$attempts}/{$maxAttempts})");
                    sleep(6);
                    continue;
                }

                return $response;
            } catch (\Exception $e) {
                $attempts++;
                if ($attempts >= $maxAttempts) {
                    throw $e;
                }
                $this->error("HTTP Exception: " . $e->getMessage() . ". Retrying in 2 seconds...");
                sleep(2);
            }
        } while ($attempts < $maxAttempts);

        return Http::post($url, $params);
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting NeedyMeds Synchronization...');

        // 1. Sync Diagnoses
        $this->syncDiagnoses();

        // 2. Sync Coupons
        $this->syncCoupons();

        // 3. Sync Assistance Programs
        $this->syncPrograms(true);  // National
        $this->syncPrograms(false); // State/Local

        // 4. Sync Clinics
        $this->syncClinics('medical');
        $this->syncClinics('dental');
        $this->syncClinics('mental');

        $this->info('NeedyMeds Sync Completed Successfully!');
    }

    private function syncDiagnoses()
    {
        $this->info('Syncing Diagnoses...');
        $page = 0;
        $rowsPerPage = 25;
        $total = 0;

        do {
            $this->comment("Fetching diagnoses page {$page}...");
            try {
                $response = $this->makePostRequest('https://api.needymeds.org/diagnoses', [
                    'page' => $page,
                    'rowsPerPage' => $rowsPerPage,
                    'order' => 'ASC',
                    'orderBy' => 'diagnosis.name',
                    'name' => '',
                    'from' => 'DiagnosisContextProviderAutocomplete'
                ]);

                if (!$response->successful()) {
                    $this->error('Failed to fetch diagnoses page: ' . $response->status());
                    break;
                }

                $data = $response->json();
                $diagnoses = $data['diagnoses'] ?? [];
                $count = $data['count'] ?? 0;

                if (empty($diagnoses)) {
                    break;
                }

                foreach ($diagnoses as $diag) {
                    Diagnosis::updateOrCreate(
                        ['id' => $diag['id']],
                        [
                            'name' => $diag['name'] ?? '',
                            'details' => $diag['details'] ?? null,
                            'has_detail' => filter_var($diag['hasDetail'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'last_update' => $diag['lastUpdate'] ?? null,
                        ]
                    );
                    $total++;
                }

                $page++;
                if ($page * $rowsPerPage >= $count) {
                    break;
                }
            } catch (\Exception $e) {
                $this->error('Exception during diagnoses sync: ' . $e->getMessage());
                break;
            }
        } while (true);

        $this->info("Synced {$total} diagnoses.");
    }

    private function syncCoupons()
    {
        $this->info('Syncing Coupons...');
        $page = 0;
        $rows = 25;
        $total = 0;

        do {
            $this->comment("Fetching coupons page {$page}...");
            try {
                $response = $this->makePostRequest('https://api.needymeds.org/coupons', [
                    'rows' => (string) $rows,
                    'page' => (string) $page,
                    'order' => 'ASC',
                    'orderBy' => 'name',
                    'from' => 'coupon-context'
                ]);

                if (!$response->successful()) {
                    $this->error('Failed to fetch coupons page: ' . $response->status());
                    break;
                }

                $data = $response->json();
                $coupons = $data['coupons'] ?? [];
                $count = $data['count'] ?? 0;

                if (empty($coupons)) {
                    break;
                }

                foreach ($coupon = $coupons as $coupon) {
                    DiscountCoupon::updateOrCreate(
                        ['id' => $coupon['id']],
                        [
                            'name' => $coupon['name'] ?? '',
                            'details' => $coupon['details'] ?? null,
                            'expiration_date' => $coupon['expirationDate'] ?? null,
                            'last_updated' => $coupon['lastUpdated'] ?? null,
                            'manufacturer_offer_website' => $coupon['manufacturerOfferWebsite'] ?? null,
                            'patient_support_number' => $coupon['patientSupportNumber'] ?? null,
                            'pharmacy_support_number' => $coupon['pharmacySupportNumber'] ?? null,
                            'print_pdf' => $coupon['printPDF'] ?? null,
                            'activate_by' => $coupon['activateBy'] ?? null,
                            'category' => $coupon['category'] ?? null,
                            'coverage_requirements' => $coupon['coverageRequirements'] ?? null,
                            'offer_type' => $coupon['offerType'] ?? null,
                            'over_the_counter' => filter_var($coupon['overTheCounter'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'drugs' => $coupon['drugs'] ?? null,
                        ]
                    );
                    $total++;
                }

                $page++;
                if ($page * $rows >= $count) {
                    break;
                }
            } catch (\Exception $e) {
                $this->error('Exception during coupons sync: ' . $e->getMessage());
                break;
            }
        } while (true);

        $this->info("Synced {$total} coupons.");
    }

    private function syncPrograms(bool $isNational)
    {
        $scope = $isNational ? 'National' : 'State/Local';
        $this->info("Syncing {$scope} Assistance Programs...");
        $page = 0;
        $rows = 25;
        $total = 0;

        do {
            $this->comment("Fetching programs page {$page}...");
            try {
                $response = $this->makePostRequest('https://api.needymeds.org/programs', [
                    'isNational' => $isNational,
                    'rows' => (string) $rows,
                    'page' => (string) $page,
                    'order' => 'ASC',
                    'orderBy' => 'title',
                    'type' => 'dba',
                    'runSearch' => true,
                    'from' => 'Search Tab switch'
                ]);

                if (!$response->successful()) {
                    $this->error("Failed to fetch {$scope} programs page: " . $response->status());
                    break;
                }

                $data = $response->json();
                $programs = $data['programs'] ?? [];
                $count = $data['count'] ?? 0;

                if (empty($programs)) {
                    break;
                }

                foreach ($programs as $prog) {
                    AssistanceProgram::updateOrCreate(
                        ['id' => $prog['id']],
                        [
                            'title' => $prog['title'] ?? '',
                            'provided_by' => $prog['providedBy'] ?? null,
                            'is_national' => $isNational,
                            'phone' => $prog['phone'] ?? null,
                            'alt_phone' => $prog['altPhone'] ?? null,
                            'email' => $prog['email'] ?? null,
                            'fax' => $prog['fax'] ?? null,
                            'website' => $prog['programWebsite'] ?? null,
                            'details' => $prog['programDetails'] ?? null,
                            'summary' => $prog['summary'] ?? null,
                            'update_date' => $prog['updateDate'] ?? null,
                            'languages' => $prog['languages'] ?? null,
                            'applications' => $prog['applications'] ?? null,
                            'application_process' => $prog['applicationProcess'] ?? null,
                            'eligibility_guidelines' => $prog['eligibilityGuidelines'] ?? null,
                            'areas_of_service' => $prog['areasOfService'] ?? null,
                            'age_groups' => $prog['ageGroups'] ?? null,
                            'address' => $prog['address'] ?? null,
                            'services' => $prog['services'] ?? null,
                            'diagnoses' => $prog['diagnoses'] ?? null,
                        ]
                    );
                    $total++;
                }

                $page++;
                if ($page * $rows >= $count) {
                    break;
                }
            } catch (\Exception $e) {
                $this->error("Exception during {$scope} programs sync: " . $e->getMessage());
                break;
            }
        } while (true);

        $this->info("Synced {$total} {$scope} programs.");
    }

    private function syncClinics(string $type)
    {
        $this->info("Syncing Clinics of type {$type}...");
        $page = 0;
        $rows = 25;
        $total = 0;

        do {
            $this->comment("Fetching {$type} clinics page {$page}...");
            try {
                $response = $this->makePostRequest('https://api.needymeds.org/clinics', [
                    'rows' => (string) $rows,
                    'page' => (string) $page,
                    'order' => 'ASC',
                    'orderBy' => 'name',
                    'chips' => [],
                    'clinicType' => $type,
                    'runSearch' => true,
                    'from' => 'Clinic-context useEffect end search'
                ]);

                if (!$response->successful()) {
                    $this->error("Failed to fetch {$type} clinics page: " . $response->status());
                    break;
                }

                $data = $response->json();
                $clinics = $data['clinics'] ?? [];
                $count = $data['count'] ?? 0;

                if (empty($clinics)) {
                    break;
                }

                foreach ($clinics as $clinic) {
                    Clinic::updateOrCreate(
                        ['id' => $clinic['id']],
                        [
                            'name' => $clinic['name'] ?? '',
                            'address' => $clinic['address'] ?? null,
                            'address2' => $clinic['address2'] ?? null,
                            'city' => $clinic['city'] ?? null,
                            'state' => $clinic['state'] ?? null,
                            'postal_code' => $clinic['postalCode'] ?? null,
                            'phone' => $clinic['phone'] ?? null,
                            'website' => $clinic['website'] ?? null,
                            'fees' => $clinic['fees'] ?? null,
                            'income' => $clinic['income'] ?? null,
                            'hours' => $clinic['hours'] ?? null,
                            'accepts' => $clinic['accepts'] ?? null,
                            'languages_spoken' => $clinic['languagesSpoken'] ?? null,
                            'service_area' => $clinic['serviceArea'] ?? null,
                            'is_dental' => filter_var($clinic['isDental'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'is_medical' => filter_var($clinic['isMedical'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'is_mental_health' => filter_var($clinic['isMentalHealth'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'is_substance' => filter_var($clinic['isSubstance'] ?? false, FILTER_VALIDATE_BOOLEAN),
                            'location' => $clinic['location'] ?? null,
                        ]
                    );
                    $total++;
                }

                $page++;
                if ($page * $rows >= $count) {
                    break;
                }
            } catch (\Exception $e) {
                $this->error("Exception during {$type} clinics sync: " . $e->getMessage());
                break;
            }
        } while (true);

        $this->info("Synced {$total} {$type} clinics.");
    }
}
