<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialite',
        'experience',
        'disponibilite',
        'licence_medicale',
    ];

    protected $casts = [
        'disponibilite' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}