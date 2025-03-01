import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const MedecinDashboard = () => {
  const [user, setUser] = useState(null);
  const [medecin, setMedecin] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [patients, setPatients] = useState([]);
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
            // Récupérer les données du médecin
            const medecinResponse = await api.get(`/medecins?user_id=${currentUser.id}`);
            if (medecinResponse.data && medecinResponse.data.length > 0) {
              const medecinData = medecinResponse.data[0];
              setMedecin(medecinData);
              
              // Récupérer les rendez-vous du médecin
              const rdvResponse = await api.get(`/rendez-vous?medecin_id=${medecinData.id}`);
              setRendezVous(rdvResponse.data);
              
              // Récupérer la liste des patients du médecin (patients ayant des rendez-vous avec ce médecin)
              const patientIds = [...new Set(rdvResponse.data.map(rdv => rdv.patient_id))];
              const patientPromises = patientIds.map(id => api.get(`/patients/${id}`));
              const patientResponses = await Promise.all(patientPromises);
              const patientsData = patientResponses.map(resp => resp.data);
              setPatients(patientsData);
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
  
  // Filtrer les rendez-vous d'aujourd'hui
  const todaysRendezVous = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    const today = new Date();
    return (
      rdvDate.getDate() === today.getDate() &&
      rdvDate.getMonth() === today.getMonth() &&
      rdvDate.getFullYear() === today.getFullYear() &&
      rdv.status !== 'annulé'
    );
  }).sort((a, b) => {
    return new Date(`1970-01-01T${a.heure}`) - new Date(`1970-01-01T${b.heure}`);
  });
  
  // Filtrer les rendez-vous à venir (hors aujourd'hui)
  const upcomingRendezVous = rendezVous.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return rdvDate > today && rdv.status !== 'annulé';
  });
  
  const handleConfirmRendezVous = async (id) => {
    try {
      await api.put(`/rendez-vous/${id}`, { status: 'confirmé' });
      // Mettre à jour la liste des rendez-vous
      setRendezVous(
        rendezVous.map(rdv => 
          rdv.id === id ? { ...rdv, status: 'confirmé' } : rdv
        )
      );
    } catch (error) {
      console.error("Erreur lors de la confirmation du rendez-vous:", error);
      setError("Erreur lors de la confirmation du rendez-vous.");
    }
  };
  
  const handleCancelRendezVous = async (id) => {
    try {
      await api.put(`/rendez-vous/${id}`, { status: 'annulé' });
      // Mettre à jour la liste des rendez-vous
      setRendezVous(
        rendezVous.map(rdv => 
          rdv.id === id ? { ...rdv, status: 'annulé' } : rdv
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous:", error);
      setError("Erreur lors de l'annulation du rendez-vous.");
    }
  };
  
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
        <h1 className="text-2xl font-bold mb-6">Bonjour, Dr. {user?.name}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Cards d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Rendez-vous aujourd'hui</h2>
            <p className="text-3xl font-bold text-blue-600">{todaysRendezVous.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Rendez-vous à venir</h2>
            <p className="text-3xl font-bold text-blue-600">{upcomingRendezVous.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Nombre de patients</h2>
            <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
          </div>
        </div>
        
        {/* Agenda du jour */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Agenda du jour</h2>
            <Link to="/dashboard/medecin/agenda" className="text-blue-600 hover:text-blue-800">
              Voir l'agenda complet
            </Link>
          </div>
          
          {todaysRendezVous.length === 0 ? (
            <p className="text-gray-600">Aucun rendez-vous prévu aujourd'hui.</p>
          ) : (
            <div className="space-y-4">
              {todaysRendezVous.map((rdv) => (
                <div key={rdv.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{rdv.heure} - Patient: {
                        patients.find(p => p.id === rdv.patient_id)?.user?.name || 'Patient inconnu'
                      }</p>
                      <p className="text-gray-600 mt-1">{rdv.raison}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${rdv.status === 'confirmé' ? 'bg-green-100 text-green-800' : 
                          rdv.status === 'planifié' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {rdv.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Link to={`/dashboard/medecin/patients/${rdv.patient_id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      Voir dossier patient
                    </Link>
                    {rdv.status === 'planifié' && (
                      <button 
                        onClick={() => handleConfirmRendezVous(rdv.id)} 
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Confirmer
                      </button>
                    )}
                    {rdv.status !== 'annulé' && rdv.status !== 'terminé' && (
                      <button 
                        onClick={() => handleCancelRendezVous(rdv.id)} 
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Liste des patients */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mes patients</h2>
            <Link to="/dashboard/medecin/patients" className="text-blue-600 hover:text-blue-800">
              Voir tous les patients
            </Link>
          </div>
          
          {patients.length === 0 ? (
            <p className="text-gray-600">Aucun patient enregistré.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Nom</th>
                    <th className="py-2 px-4 text-left">Téléphone</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Dernier rendez-vous</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 5).map((patient) => {
                    // Trouver le dernier rendez-vous de ce patient
                    const patientRendezVous = rendezVous.filter(rdv => rdv.patient_id === patient.id);
                    const lastRendezVous = patientRendezVous.length > 0 
                      ? patientRendezVous.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
                      : null;
                      
                    return (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{patient.user?.name || 'N/A'}</td>
                        <td className="py-2 px-4">{patient.telephone || 'N/A'}</td>
                        <td className="py-2 px-4">{patient.user?.email || 'N/A'}</td>
                        <td className="py-2 px-4">
                          {lastRendezVous 
                            ? new Date(lastRendezVous.date).toLocaleDateString() 
                            : 'Aucun'
                          }
                        </td>
                        <td className="py-2 px-4">
                          <Link to={`/dashboard/medecin/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800 mr-2">
                            Dossier
                          </Link>
                          <Link to={`/dashboard/medecin/rendez-vous/nouveau?patient=${patient.id}`} className="text-green-600 hover:text-green-800">
                            Rendez-vous
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedecinDashboard;