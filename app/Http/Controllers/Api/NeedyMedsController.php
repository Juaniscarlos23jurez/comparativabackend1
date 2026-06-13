<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AssistanceProgram;
use App\Models\DiscountCoupon;
use App\Models\Diagnosis;
use App\Models\Clinic;

class NeedyMedsController extends Controller
{
    /**
     * Get assistance programs (paginated and filtered).
     */
    public function programs(Request $request)
    {
        $isNational = filter_var($request->input('isNational', false), FILTER_VALIDATE_BOOLEAN);
        $rows = (int) $request->input('rows', 10);
        $page = (int) $request->input('page', 0);
        $order = $request->input('order', 'ASC');
        $orderBy = $request->input('orderBy', 'title');
        $query = $request->input('query');

        if ($orderBy === 'providedBy') { $orderBy = 'provided_by'; }
        if ($orderBy === 'updateDate') { $orderBy = 'update_date'; }

        $dbQuery = AssistanceProgram::where('is_national', $isNational);

        if (!empty($query)) {
            $dbQuery->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('provided_by', 'LIKE', "%{$query}%")
                  ->orWhere('details', 'LIKE', "%{$query}%")
                  ->orWhere('summary', 'LIKE', "%{$query}%");
            });
        }

        $count = $dbQuery->count();
        $programs = $dbQuery->orderBy($orderBy, $order)
                            ->offset($page * $rows)
                            ->limit($rows)
                            ->get()
                            ->map(function ($program) {
                                return [
                                    'id' => $program->id,
                                    'title' => $program->title,
                                    'type' => ['pap'],
                                    'isNational' => (bool)$program->is_national,
                                    'summary' => $program->summary ?? '',
                                    'providedBy' => $program->provided_by,
                                    'phone' => $program->phone ?? '',
                                    'altPhone' => $program->alt_phone ?? '',
                                    'tty' => $program->tty ?? '',
                                    'fax' => $program->fax ?? '',
                                    'email' => $program->email ?? '',
                                    'programWebsite' => $program->website ?? '',
                                    'programDetails' => $program->details ?? '',
                                    'updateDate' => $program->update_date ?? '',
                                    'languages' => $program->languages ?? [],
                                    'applications' => $program->applications ?? [],
                                    'applicationProcess' => $program->application_process ?? [],
                                    'eligibilityGuidelines' => $program->eligibility_guidelines ?? [],
                                    'areasOfService' => $program->areas_of_service ?? [],
                                    'ageGroups' => $program->age_groups ?? [],
                                    'sponsor' => $program->sponsor ?? '',
                                    'countiesServed' => $program->counties_served ?? [],
                                    'address' => $program->address ?? [
                                        'title' => '', 'attn' => '', 'address' => '', 'address2' => '', 'city' => '', 'state' => '', 'postalCode' => '', 'location' => ['type' => 'Point', 'coordinates' => [0, 0]]
                                    ],
                                ];
                            });

        return response()->json([
            'count' => $count,
            'programs' => $programs
        ]);
    }

    /**
     * Get discount coupons and co-pay cards.
     */
    public function coupons(Request $request)
    {
        $rows = (int) $request->input('rows', 10);
        $page = (int) $request->input('page', 0);
        $order = $request->input('order', 'ASC');
        $orderBy = $request->input('orderBy', 'name');
        $query = $request->input('query');

        if ($orderBy === 'lastUpdated') { $orderBy = 'last_updated'; }
        if ($orderBy === 'expirationDate') { $orderBy = 'expiration_date'; }

        $dbQuery = DiscountCoupon::query();

        if (!empty($query)) {
            $dbQuery->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('details', 'LIKE', "%{$query}%")
                  ->orWhere('coverage_requirements', 'LIKE', "%{$query}%");
            });
        }

        $count = $dbQuery->count();
        $coupons = $dbQuery->orderBy($orderBy, $order)
                           ->offset($page * $rows)
                           ->limit($rows)
                           ->get()
                           ->map(function ($coupon) {
                               return [
                                   'id' => $coupon->id,
                                   'name' => $coupon->name,
                                   'details' => $coupon->details,
                                   'expirationDate' => $coupon->expiration_date,
                                   'lastUpdated' => $coupon->last_updated,
                                   'manufacturerOfferWebsite' => $coupon->manufacturer_offer_website,
                                   'patientSupportNumber' => $coupon->patient_support_number,
                                   'pharmacySupportNumber' => $coupon->pharmacy_support_number,
                                   'printPDF' => $coupon->print_pdf,
                                   'activateBy' => $coupon->activate_by,
                                   'category' => $coupon->category,
                                   'coverageRequirements' => $coupon->coverage_requirements,
                                   'offerType' => $coupon->offer_type,
                                   'overTheCounter' => (bool)$coupon->over_the_counter,
                                   'drugs' => $coupon->drugs ?? [],
                               ];
                           });

        return response()->json([
            'count' => $count,
            'coupons' => $coupons
        ]);
    }

    /**
     * Get diagnoses.
     */
    public function diagnoses(Request $request)
    {
        $rows = (int) $request->input('rowsPerPage', 15);
        $page = (int) $request->input('page', 0);
        $order = $request->input('order', 'ASC');
        $orderBy = $request->input('orderBy', 'diagnosis.name');
        $query = $request->input('name');

        if ($orderBy === 'diagnosis.name') { $orderBy = 'name'; }
        if ($orderBy === 'diagnosis.createdAt') { $orderBy = 'created_at'; }

        $dbQuery = Diagnosis::query();

        if (!empty($query)) {
            $dbQuery->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('details', 'LIKE', "%{$query}%");
            });
        }

        $count = $dbQuery->count();
        $diagnoses = $dbQuery->orderBy($orderBy, $order)
                             ->offset($page * $rows)
                             ->limit($rows)
                             ->get()
                             ->map(function ($diag) {
                                 return [
                                     'id' => $diag->id,
                                     'name' => $diag->name,
                                     'details' => $diag->details ?? '',
                                     'createdAt' => $diag->created_at ? $diag->created_at->toISOString() : null,
                                     'hasDetail' => (bool)$diag->has_detail,
                                     'lastUpdate' => $diag->last_update ?? '',
                                 ];
                             });

        return response()->json([
            'count' => $count,
            'diagnoses' => $diagnoses
        ]);
    }

    /**
     * Get clinics (filtered by zip and radius).
     */
    public function clinics(Request $request)
    {
        $postalCode = $request->input('postalCode');
        $radius = (float) $request->input('radius', 63);
        $clinicType = $request->input('clinicType', 'medical');
        $rows = (int) $request->input('rows', 10);
        $page = (int) $request->input('page', 0);
        $order = $request->input('order', 'ASC');
        $orderBy = $request->input('orderBy', 'name');

        $dbQuery = Clinic::query();

        if ($clinicType === 'medical') {
            $dbQuery->where('is_medical', true);
        } elseif ($clinicType === 'dental') {
            $dbQuery->where('is_dental', true);
        } elseif ($clinicType === 'mental') {
            $dbQuery->where('is_mental_health', true);
        }

        if (!empty($postalCode)) {
            $zipClinic = Clinic::where('postal_code', $postalCode)->first();
            if ($zipClinic && isset($zipClinic->location['coordinates'])) {
                $centerLon = $zipClinic->location['coordinates'][0];
                $centerLat = $zipClinic->location['coordinates'][1];
                $latRange = $radius / 69.0;
                $lonRange = $radius / (69.0 * cos(deg2rad($centerLat)));

                $dbQuery->whereBetween('location->coordinates->1', [$centerLat - $latRange, $centerLat + $latRange])
                        ->whereBetween('location->coordinates->0', [$centerLon - $lonRange, $centerLon + $lonRange]);
            } else {
                $dbQuery->where(function ($q) use ($postalCode) {
                    $q->where('postal_code', 'LIKE', substr($postalCode, 0, 3) . '%')
                      ->orWhere('city', 'LIKE', "%{$postalCode}%");
                });
            }
        }

        $count = $dbQuery->count();
        $clinics = $dbQuery->orderBy($orderBy, $order)
                           ->offset($page * $rows)
                           ->limit($rows)
                           ->get()
                           ->map(function ($clinic) {
                               return [
                                   'id' => $clinic->id,
                                   'name' => $clinic->name,
                                   'address' => $clinic->address ?? '',
                                   'address2' => $clinic->address2 ?? '',
                                   'city' => $clinic->city ?? '',
                                   'state' => $clinic->state ?? '',
                                   'postalCode' => $clinic->postal_code ?? '',
                                   'phone' => $clinic->phone ?? '',
                                   'website' => $clinic->website ?? '',
                                   'fees' => $clinic->fees ?? '',
                                   'income' => $clinic->income ?? '',
                                   'hours' => $clinic->hours ?? '',
                                   'accepts' => $clinic->accepts ?? [],
                                   'languagesSpoken' => $clinic->languages_spoken ?? [],
                                   'serviceArea' => $clinic->service_area ?? [],
                                   'isDental' => (bool)$clinic->is_dental,
                                   'isMedical' => (bool)$clinic->is_medical,
                                   'isMentalHealth' => (bool)$clinic->is_mental_health,
                                   'isSubstance' => (bool)$clinic->is_substance,
                                   'location' => $clinic->location ?? ['type' => 'Point', 'coordinates' => [0, 0]],
                               ];
                           });

        return response()->json([
            'count' => $count,
            'clinics' => $clinics
        ]);
    }
}
