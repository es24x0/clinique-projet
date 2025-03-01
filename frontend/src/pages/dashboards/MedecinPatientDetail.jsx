import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const MedecinPatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [rendezVous, setRendezVous] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Vérifier l'authentification
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'medecin') {
          setError("Accès non autorisé");
          navigate('/login');
          return;
        }
        
        setUser(currentUser);
        
        // Récupérer les données du patient
        try {
          const patientResponse = await api.get(`/patients/${patientId}`);
          setPatient(patientResponse.data);
          
          // Récupérer les rendez-vous du patient
          const rdvResponse = await api.get(`/rendez-vous?patient_id=${patientId}`);
          setRendezVous(rdvResponse.data);
          
          // Récupérer les prescriptions du patient
          // Note: vous devez adapter ceci selon votre API
          const prescriptionPromises = rdvResponse.data.map(rdv => 
            api.get(`/prescriptions?rendez_vous_id=${rdv.id}`).catch(() => ({ data: [] }))
          );
          const prescriptionResponses = await Promise.all(prescriptionPromises);
          const allPrescriptions = prescriptionResponses.flatMap(resp => resp.data);
          setPrescriptions(allPrescriptions);
          
        } catch (apiError) {
          console.error("Erreur API:", apiError);
          setError("Erreur lors de la récupération des données du patient.");
        }
      } catch (error) {
        console.error("Erreur générale:", error);
        setError("Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, navigate]);
  
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      // Ici, vous pouvez adapter selon votre API pour ajouter une note
      // Par exemple, vous pourriez créer un nouveau rendez-vous avec une note ou mettre à jour un rendez-vous existant
      
      // Pour cet exemple, supposons que nous mettons à jour le dernier rendez-vous
      if (rendezVous.length > 0) {
        const lastRdv = rendezVous[0]; // Dernier rendez-vous (supposons qu'ils sont déjà triés)
        
        await api.put(`/rendez-vous/${lastRdv.id}`, {
          ...lastRdv,
          notes: lastRdv.notes ? `${lastRdv.notes}\n${new Date().toLocaleString()}: ${newNote}` : newNote
        });
        
        // Mettre à jour l'interface
        setRendezVous(rendezVous.map(rdv => 
          rdv.id === lastRdv.id 
            ? {...rdv, notes: rdv.notes ? `${rdv.notes}\n${new Date().toLocaleString()}: ${newNote}` : newNote} 
            : rdv
        ));
        
        setNewNote('');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
      setError("Erreur lors de l'ajout de la note.");
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
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-blue-600 hover:text-blue-800">
            &larr; Retour
          </button>
          <h1 className="text-2xl font-bold">Dossier patient: {patient?.user?.name}</h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Informations du patient */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Nom complet</p>
              <p className="font-semibold">{patient?.user?.name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="font-semibold">{patient?.user?.email || 'N/A'}</p>
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
            
            <div>
              <p className="text-gray-600 mb-1">Numéro de sécurité sociale</p>
              <p className="font-semibold">{patient?.num_securite_sociale || 'Non renseigné'}</p>
            </div>
          </div>
        </div>
        
        {/* Historique des rendez-vous */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Historique des rendez-vous</h2>
            <Link to={`/dashboard/medecin/rendez-vous/nouveau?patient=${patientId}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Nouveau rendez-vous
            </Link>
          </div>
          
          {rendezVous.length === 0 ? (
            <p className="text-gray-600">Aucun rendez-vous enregistré.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Heure</th>
                    <th className="py-2 px-4 text-left">Raison</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVous.map((rdv) => (
                    <tr key={rdv.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{new Date(rdv.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{rdv.heure}</td>
                      <td className="py-2 px-4">{rdv.raison}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${rdv.status === 'confirmé' ? 'bg-green-100 text-green-800' : 
                            rdv.status === 'planifié' ? 'bg-yellow-100 text-yellow-800' : 
                            rdv.status === 'annulé' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {rdv.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="max-h-20 overflow-y-auto">
                          {rdv.notes ? rdv.notes.split('\n').map((note, i) => (
                            <p key={i} className="text-sm">{note}</p>
                          )) : 'Aucune note'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Ajouter une note */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Ajouter une note</h2>
          
          <div className="flex">
            <textarea
              className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="Ajouter une note médicale..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            ></textarea>
            
            <button
              onClick={handleAddNote}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 self-end"
            >
              Ajouter
            </button>
          </div>
        </div>
        
        {/* Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Prescriptions</h2>
            <Link to={`/dashboard/medecin/prescriptions/nouvelle?patient=${patientId}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Nouvelle prescription
            </Link>
          </div>
          
          {prescriptions.length === 0 ? (
            <p className="text-gray-600">Aucune prescription enregistrée.</p>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">Prescription du {new Date(prescription.date_prescription).toLocaleDateString()}</h3>
                    <Link to={`/dashboard/medecin/prescriptions/${prescription.id}`} className="text-blue-600 hover:text-blue-800">
                      Voir détails
                    </Link>
                  </div>
                  <p className="text-gray-700">{prescription.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedecinPatientDetail;