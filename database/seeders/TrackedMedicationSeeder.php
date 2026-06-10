<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrackedMedicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medications = [
            ['name' => 'Ozempic', 'search_name' => 'OZEMPIC ', 'generic_name' => 'semaglutide', 'category' => 'Diabetes / Weight', 'default_quantity' => '1', 'rank' => 1],
            ['name' => 'Wegovy', 'search_name' => 'WEGOVY ', 'generic_name' => 'semaglutide', 'category' => 'Weight Loss', 'default_quantity' => '1', 'rank' => 2],
            ['name' => 'Mounjaro', 'search_name' => 'MOUNJARO ', 'generic_name' => 'tirzepatide', 'category' => 'Diabetes', 'default_quantity' => '1', 'rank' => 3],
            ['name' => 'Humira', 'search_name' => 'HUMIRA ', 'generic_name' => 'adalimumab', 'category' => 'Autoimmune', 'default_quantity' => '2', 'rank' => 4],
            ['name' => 'Vyvanse', 'search_name' => 'VYVANSE ', 'generic_name' => 'lisdexamfetamine', 'category' => 'Mental Health', 'default_quantity' => '30', 'rank' => 5],
            ['name' => 'Lantus', 'search_name' => 'LANTUS ', 'generic_name' => 'insulin glargine', 'category' => 'Diabetes', 'default_quantity' => '1', 'rank' => 6],
            ['name' => 'Eliquis', 'search_name' => 'ELIQUIS ', 'generic_name' => 'apixaban', 'category' => 'Heart', 'default_quantity' => '60', 'rank' => 7],
            ['name' => 'Jardiance', 'search_name' => 'JARDIANCE ', 'generic_name' => 'empagliflozin', 'category' => 'Diabetes', 'default_quantity' => '30', 'rank' => 8],
        ];

        foreach ($medications as $med) {
            \App\Models\TrackedMedication::updateOrCreate(
                ['name' => $med['name']],
                $med
            );
        }
    }
}
