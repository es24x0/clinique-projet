<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Medecin;
use App\Models\Infirmier;
use App\Models\RendezVous;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Obtenir le nombre d'utilisateurs par rôle
        $usersStats = DB::table('users')
            ->select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get()
            ->pluck('total', 'role')
            ->toArray();

        $stats = [
            'total_patients' => $usersStats['patient'] ?? Patient::count(),
            'total_medecins' => $usersStats['medecin'] ?? Medecin::count(),
            'total_infirmiers' => $usersStats['infirmier'] ?? Infirmier::count(),
            'total_rendez_vous' => DB::table('rendez_vous_medicaux')->count(),
            'rendez_vous_today' => DB::table('rendez_vous_medicaux')->whereDate('date', today())->count(),
            'rendez_vous_status' => [
                'planifié' => DB::table('rendez_vous_medicaux')->where('status', 'planifié')->count(),
                'confirmé' => DB::table('rendez_vous_medicaux')->where('status', 'confirmé')->count(),
                'annulé' => DB::table('rendez_vous_medicaux')->where('status', 'annulé')->count(),
                'terminé' => DB::table('rendez_vous_medicaux')->where('status', 'terminé')->count(),
            ],
            'rendez_vous_par_mois' => $this->getRendezVousMensuel(),
            'statistiques_mensuelles' => $this->generateMonthlyStats()
        ];

        return response()->json($stats);
    }

    private function getRendezVousMensuel()
    {
        return DB::table('rendez_vous_medicaux')
            ->select(DB::raw('MONTH(date) as mois'), DB::raw('YEAR(date) as annee'), DB::raw('COUNT(*) as total'))
            ->whereYear('date', '>=', date('Y') - 1)
            ->groupBy('mois', 'annee')
            ->orderBy('annee')
            ->orderBy('mois')
            ->get();
    }

    private function generateMonthlyStats()
    {
        // Générer des statistiques synthétiques pour les 12 derniers mois
        $stats = [];
        for ($i = 0; $i < 12; $i++) {
            $date = now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;
            
            // Dans un cas réel, ces données proviendraient de calculs basés sur les tables existantes
            // Ici on les simule pour le graphique
            $rdvCount = DB::table('rendez_vous_medicaux')
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->count();
            
            // Calculer un nombre fictif de nouveaux patients (environ 15-20% du nombre de rendez-vous)
            $nouveauxPatients = max(round($rdvCount * (15 + rand(0, 5)) / 100), 0);
            
            // Calculer un revenu fictif (entre 80 et 120 euros par consultation)
            $revenus = $rdvCount * (80 + rand(0, 40));
            
            $stats[] = [
                'mois' => $month,
                'annee' => $year,
                'nb_consultations' => $rdvCount > 0 ? $rdvCount : rand(80, 150), // Données aléatoires si pas de RDV
                'nb_nouveaux_patients' => $nouveauxPatients > 0 ? $nouveauxPatients : rand(10, 30),
                'revenus' => $revenus > 0 ? $revenus : rand(8000, 15000),
            ];
        }
        
        return $stats;
    }
}