<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['M', 'F', 'Autre'])->nullable();
            $table->string('adresse')->nullable();
            $table->string('telephone')->nullable();
            $table->string('num_securite_sociale')->nullable();
            $table->text('antecedents_medicaux')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
