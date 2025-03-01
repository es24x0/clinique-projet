import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les infos de l'utilisateur connecté
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          try {
            // Récupérer les données du patient
            const patientResponse = await api.get(`/patients?user_id=${currentUser.id}`);
            if (patientResponse.data && patientResponse.data.length > 0) {
              setPatient(patientResponse.data[0]);
              
              // Récupérer les rendez-vous du patient
              const rdvResponse = await api.get(`/rendez-vous?patient_id=${patientResponse.data[0].id}`);
              setRendezVous(rdvResponse.data);
            }
          } catch (apiError) {
            console.error("Erreur API:", apiError);
            setError("Erreur lors de la récupération des données.");
          }
        } else {
          setError("Vous n'êtes pas connecté.");
        }
      } catch (error) {
        console.error("Erreur générale:", error);
        setError("Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filtrer les rendez-vous à venir
  const upcomingRendezVous = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date + ' ' + rdv.heure);
    return rdvDate > new Date() && rdv.status !== 'annulé';
  });
  
  // Filtrer les rendez-vous passés
  const pastRendezVous = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date + ' ' + rdv.heure);
    return rdvDate <= new Date() || rdv.status === 'terminé';
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Bienvenue, {user?.name}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Cards d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Prochains rendez-vous</h2>
            <p className="text-3xl font-bold text-blue-600">{upcomingRendezVous.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Messages non lus</h2>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Factures en attente</h2>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>
        
        {/* Prochains rendez-vous */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Prochains rendez-vous</h2>
            <Link to="/dashboard/patient/rendez-vous/nouveau" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Prendre un rendez-vous
            </Link>
          </div>
          
          {upcomingRendezVous.length === 0 ? (
            <p className="text-gray-600">Aucun rendez-vous à venir.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Heure</th>
                    <th className="py-2 px-4 text-left">Médecin</th>
                    <th className="py-2 px-4 text-left">Raison</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRendezVous.map((rdv) => (
                    <tr key={rdv.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{new Date(rdv.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{rdv.heure}</td>
                      <td className="py-2 px-4">Dr. {rdv.medecin?.user?.name || 'Non assigné'}</td>
                      <td className="py-2 px-4">{rdv.raison}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${rdv.status === 'confirmé' ? 'bg-green-100 text-green-800' : 
                            rdv.status === 'planifié' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {rdv.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Détails</button>
                        <button className="text-red-600 hover:text-red-800">Annuler</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Mon profil */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mon profil</h2>
            <Link to="/dashboard/patient/profile" className="text-blue-600 hover:text-blue-800">
              Modifier mon profil
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Nom complet</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Date de naissance</p>
              <p className="font-semibold">{patient?.date_naissance || 'Non renseigné'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Téléphone</p>
              <p className="font-semibold">{patient?.telephone || 'Non renseigné'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Adresse</p>
              <p className="font-semibold">{patient?.adresse || 'Non renseignée'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;