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
        Schema::create('pharmacy_price_histories', function (Blueprint $table) {
            $table->id();
            $table->string('npi')->index();
            $table->string('pharmacy_name');
            $table->string('pharmacy_brand');
            $table->string('drug_name');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_price_histories');
    }
};
