<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    // Spécifier le nom de la table
    protected $table = 'rendez_vous_medicaux';

    protected $fillable = [
        'patient_id',
        'medecin_id',
        'date',
        'heure',
        'status',
        'raison',
        'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function prescription()
    {
        return $this->hasOne(Prescription::class, 'rendez_vous_id');
    }
}