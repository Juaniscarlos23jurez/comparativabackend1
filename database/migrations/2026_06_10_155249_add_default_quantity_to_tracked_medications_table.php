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
        Schema::table('tracked_medications', function (Blueprint $table) {
            $table->string('default_quantity')->default('30')->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tracked_medications', function (Blueprint $table) {
            $table->dropColumn('default_quantity');
        });
    }
};
