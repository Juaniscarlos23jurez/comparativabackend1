<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assistance_programs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('provided_by')->nullable();
            $table->boolean('is_national')->default(false);
            $table->string('phone')->nullable();
            $table->string('alt_phone')->nullable();
            $table->string('email')->nullable();
            $table->string('fax')->nullable();
            $table->text('website')->nullable();
            $table->text('details')->nullable();
            $table->text('summary')->nullable();
            $table->string('update_date')->nullable();
            
            // JSON fields for complex structures
            $table->json('languages')->nullable();
            $table->json('applications')->nullable();
            $table->json('application_process')->nullable();
            $table->json('eligibility_guidelines')->nullable();
            $table->json('areas_of_service')->nullable();
            $table->json('age_groups')->nullable();
            $table->json('address')->nullable();
            $table->json('services')->nullable();
            $table->json('diagnoses')->nullable();
            
            $table->timestamps();
        });

        Schema::create('discount_coupons', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name')->nullable();
            $table->text('details')->nullable();
            $table->string('expiration_date')->nullable();
            $table->string('last_updated')->nullable();
            $table->text('manufacturer_offer_website')->nullable();
            $table->string('patient_support_number')->nullable();
            $table->string('pharmacy_support_number')->nullable();
            $table->text('print_pdf')->nullable();
            $table->string('activate_by')->nullable();
            $table->string('category')->nullable();
            $table->text('coverage_requirements')->nullable();
            $table->string('offer_type')->nullable();
            $table->boolean('over_the_counter')->default(false);
            
            $table->json('drugs')->nullable();
            
            $table->timestamps();
        });

        Schema::create('diagnoses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->text('details')->nullable();
            $table->boolean('has_detail')->default(false);
            $table->string('last_update')->nullable();
            $table->timestamps();
        });

        Schema::create('clinics', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('address2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('phone')->nullable();
            $table->text('website')->nullable();
            $table->text('fees')->nullable();
            $table->text('income')->nullable();
            $table->text('hours')->nullable();
            
            $table->json('accepts')->nullable();
            $table->json('languages_spoken')->nullable();
            $table->json('service_area')->nullable();
            
            $table->boolean('is_dental')->default(false);
            $table->boolean('is_medical')->default(false);
            $table->boolean('is_mental_health')->default(false);
            $table->boolean('is_substance')->default(false);
            
            $table->json('location')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinics');
        Schema::dropIfExists('diagnoses');
        Schema::dropIfExists('discount_coupons');
        Schema::dropIfExists('assistance_programs');
    }
};
