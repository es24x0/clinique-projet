import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const PatientProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_naissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    num_securite_sociale: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les infos de l'utilisateur connecté
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Récupérer les données du patient
          const patientResponse = await api.get(`/patients?user_id=${currentUser.id}`);
          if (patientResponse.data && patientResponse.data.length > 0) {
            const patientData = patientResponse.data[0];
            setPatient(patientData);
            
            // Préremplir le formulaire
            setFormData({
              name: currentUser.name || '',
              email: currentUser.email || '',
              date_naissance: patientData.date_naissance || '',
              sexe: patientData.sexe || '',
              adresse: patientData.adresse || '',
              telephone: patientData.telephone || '',
              num_securite_sociale: patientData.num_securite_sociale || ''
            });
          }
        } else {
          setError("Vous n'êtes pas connecté.");
          navigate('/login');
        }
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Mettre à jour le patient
      await api.put(`/patients/${patient.id}`, {
        date_naissance: formData.date_naissance,
        sexe: formData.sexe,
        adresse: formData.adresse,
        telephone: formData.telephone,
        num_securite_sociale: formData.num_securite_sociale
      });
      
      setSuccess("Votre profil a été mis à jour avec succès.");
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(error);
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nom complet
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Le nom ne peut pas être modifié ici.</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié ici.</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_naissance">
                  Date de naissance
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="date_naissance"
                  name="date_naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sexe">
                  Sexe
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="sexe"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="telephone"
                  name="telephone"
                  type="text"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">
                  Adresse
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="num_securite_sociale">
                  Numéro de sécurité sociale
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="num_securite_sociale"
                  name="num_securite_sociale"
                  type="text"
                  value={formData.num_securite_sociale}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard/patient')}
                className="bg-gray-300 text-gray-800 mr-4 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;