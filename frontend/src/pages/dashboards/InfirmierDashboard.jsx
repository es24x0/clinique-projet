import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const InfirmierDashboard = () => {
  const [user, setUser] = useState(null);
  const [infirmier, setInfirmier] = useState(null);
  const [patients, setPatients] = useState([]);
  const [planningJour, setPlanningJour] = useState([]);
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
            // Récupérer les données de l'infirmier
            const infirmierResponse = await api.get(`/infirmiers?user_id=${currentUser.id}`);
            if (infirmierResponse.data && infirmierResponse.data.length > 0) {
              setInfirmier(infirmierResponse.data[0]);
              
              // Pour démonstration, récupérer tous les patients
              // Dans une vraie application, filtrer selon le service de l'infirmier
              const patientsResponse = await api.get('/patients');
              setPatients(patientsResponse.data);
              
              // Simuler un planning pour la démonstration
              // Dans une vraie application, récupérer depuis une table de planification
              const planning = [
                {
                  id: 1,
                  patient_id: patientsResponse.data[0]?.id,
                  chambre: '101',
                  heure: '09:00',
                  soin: 'Prise de constantes',
                  statut: 'à faire'
                },
                {
                  id: 2,
                  patient_id: patientsResponse.data[1]?.id,
                  chambre: '105',
                  heure: '10:30',
                  soin: 'Administration médicaments',
                  statut: 'à faire'
                },
                {
                  id: 3,
                  patient_id: patientsResponse.data[0]?.id,
                  chambre: '101',
                  heure: '14:00',
                  soin: 'Changement pansement',
                  statut: 'à faire'
                }
              ];
              
              setPlanningJour(planning);
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
  
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.user?.name || 'Patient inconnu';
  };
  
  const handleChangerStatut = (id, nouveauStatut) => {
    setPlanningJour(planningJour.map(item => 
      item.id === id ? { ...item, statut: nouveauStatut } : item
    ));
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
        <h1 className="text-2xl font-bold mb-6">Bonjour, {user?.name}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Cards d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Service</h2>
            <p className="text-3xl font-bold text-blue-600">{infirmier?.service || 'Non assigné'}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Soins aujourd'hui</h2>
            <p className="text-3xl font-bold text-blue-600">{planningJour.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Soins terminés</h2>
            <p className="text-3xl font-bold text-blue-600">
              {planningJour.filter(item => item.statut === 'terminé').length}
            </p>
          </div>
        </div>
        
        {/* Planning du jour */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Planning du jour</h2>
            <div>
              <Link to="/dashboard/infirmier/planning" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                Voir planning complet
              </Link>
            </div>
          </div>
          
          {planningJour.length === 0 ? (
            <p className="text-gray-600">Aucun soin prévu aujourd'hui.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Heure</th>
                    <th className="py-2 px-4 text-left">Chambre</th>
                    <th className="py-2 px-4 text-left">Patient</th>
                    <th className="py-2 px-4 text-left">Soin</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {planningJour.map((soin) => (
                    <tr key={soin.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{soin.heure}</td>
                      <td className="py-2 px-4">{soin.chambre}</td>
                      <td className="py-2 px-4">{getPatientName(soin.patient_id)}</td>
                      <td className="py-2 px-4">{soin.soin}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${soin.statut === 'terminé' ? 'bg-green-100 text-green-800' : 
                            soin.statut === 'en cours' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {soin.statut}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/dashboard/infirmier/constantes/${soin.patient_id}`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Constantes
                          </Link>
                          {soin.statut === 'à faire' && (
                            <button 
                              onClick={() => handleChangerStatut(soin.id, 'en cours')} 
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Commencer
                            </button>
                          )}
                          {soin.statut === 'en cours' && (
                            <button 
                              onClick={() => handleChangerStatut(soin.id, 'terminé')} 
                              className="text-green-600 hover:text-green-800"
                            >
                              Terminer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Saisie des constantes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dernières constantes enregistrées</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Patient</th>
                  <th className="py-2 px-4 text-left">Tension</th>
                  <th className="py-2 px-4 text-left">Température</th>
                  <th className="py-2 px-4 text-left">Pouls</th>
                  <th className="py-2 px-4 text-left">Saturation O2</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">Jean Dupont</td>
                  <td className="py-2 px-4">12/8</td>
                  <td className="py-2 px-4">37.2°C</td>
                  <td className="py-2 px-4">72 bpm</td>
                  <td className="py-2 px-4">98%</td>
                  <td className="py-2 px-4">{new Date().toLocaleDateString()}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">Marie Martin</td>
                  <td className="py-2 px-4">13/9</td>
                  <td className="py-2 px-4">36.8°C</td>
                  <td className="py-2 px-4">68 bpm</td>
                  <td className="py-2 px-4">99%</td>
                  <td className="py-2 px-4">{new Date().toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <Link to="/dashboard/infirmier/constantes" className="text-blue-600 hover:text-blue-800">
              Voir toutes les constantes →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfirmierDashboard;