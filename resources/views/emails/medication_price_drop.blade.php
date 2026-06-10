<x-mail::message>
# Great News! Price Drop Detected

We found a lower price for your watched medication: **{{ $alarm->medication_name }}**.

<x-mail::panel>
### Price Drop Summary
* **Old Lowest Price:** ${{ number_format($oldPrice, 2) }}
* **New Lowest Price:** ${{ number_format($newPrice, 2) }}
* **Savings:** ${{ number_format($oldPrice - $newPrice, 2) }} ({{ number_format((($oldPrice - $newPrice) / $oldPrice) * 100, 1) }}% off)
</x-mail::panel>

### Pharmacy Offering This Price:
**{{ $pharmacyName }}**  
{{ $pharmacyAddress }}

This price is available within your configured search radius of **{{ $alarm->user->radius }} miles** around zip code **{{ $alarm->user->zip_code }}**.

<x-mail::button :url="url('/dashboard')">
Compare Prices Now
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
