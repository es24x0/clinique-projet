<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Patient;
use App\Models\Medecin;
use App\Models\Infirmier;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un administrateur
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@clinique.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Créer un médecin
        $medecin = User::create([
            'name' => 'Dr. Martin',
            'email' => 'medecin@clinique.com',
            'password' => Hash::make('password'),
            'role' => 'medecin',
        ]);
        
        Medecin::create([
            'user_id' => $medecin->id,
            'specialite' => 'Généraliste',
            'experience' => 10,
        ]);

        // Créer un infirmier
        $infirmier = User::create([
            'name' => 'Inf. Sophie',
            'email' => 'infirmier@clinique.com',
            'password' => Hash::make('password'),
            'role' => 'infirmier',
        ]);
        
        Infirmier::create([
            'user_id' => $infirmier->id,
            'service' => 'Urgences',
            'qualification' => 'Infirmier diplômé d\'État',
        ]);

        // Créer un patient
        $patient = User::create([
            'name' => 'Jean Dupont',
            'email' => 'patient@clinique.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
        ]);
        
        Patient::create([
            'user_id' => $patient->id,
            'date_naissance' => '1980-01-15',
            'sexe' => 'M',
            'adresse' => '123 Rue de Paris',
            'telephone' => '0123456789',
        ]);
    }
}