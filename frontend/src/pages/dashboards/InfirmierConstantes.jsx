import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const InfirmierConstantes = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    tension_systolique: '',
    tension_diastolique: '',
    temperature: '',
    pouls: '',
    saturation: '',
    glycemie: '',
    notes: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Vérifier l'authentification
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'infirmier') {
          navigate('/login');
          return;
        }
        
        if (patientId) {
          // Récupérer les infos du patient
          const patientResponse = await api.get(`/patients/${patientId}`);
          setPatient(patientResponse.data);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur lors de la récupération des données du patient.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, navigate]);
  
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
      // Dans une application réelle, vous enverriez ces données à votre API
      // await api.post('/constantes', { 
      //   patient_id: patientId,
      //   ...formData
      // });
      
      // Simuler une sauvegarde réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Les constantes ont été enregistrées avec succès.");
      
      // Réinitialiser le formulaire
      setFormData({
        tension_systolique: '',
        tension_diastolique: '',
        temperature: '',
        pouls: '',
        saturation: '',
        glycemie: '',
        notes: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des constantes:", error);
      setError("Erreur lors de l'enregistrement des constantes.");
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
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-blue-600 hover:text-blue-800">
            &larr; Retour
          </button>
          <h1 className="text-2xl font-bold">
            {patientId 
              ? `Saisie des constantes: ${patient?.user?.name}` 
              : 'Saisie des constantes'}
          </h1>
        </div>
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {!patientId && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient">
                    Patient
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="patient"
                    name="patient"
                    required
                  >
                    <option value="">Sélectionnez un patient</option>
                    <option value="1">Jean Dupont</option>
                    <option value="2">Marie Martin</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tension">
                  Tension artérielle
                </label>
                <div className="flex">
                  <input
                    className="shadow appearance-none border rounded-l w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="tension_systolique"
                    name="tension_systolique"
                    type="number"
                    min="60"
                    max="250"
                    placeholder="Systolique"
                    value={formData.tension_systolique}
                    onChange={handleChange}
                  />
                  <span className="flex items-center bg-gray-200 px-2">/</span>
                  <input
                    className="shadow appearance-none border rounded-r w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="tension_diastolique"
                    name="tension_diastolique"
                    type="number"
                    min="40"
                    max="150"
                    placeholder="Diastolique"
                    value={formData.tension_diastolique}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ex: 120/80 mmHg</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="temperature">
                  Température
                </label>
                <div className="flex">
                  <input
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="34"
                    max="42"
                    placeholder="36.8"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                  <span className="flex items-center bg-gray-200 px-2 rounded-r">°C</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pouls">
                  Pouls
                </label>
                <div className="flex">
                  <input
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="pouls"
                    name="pouls"
                    type="number"
                    min="40"
                    max="200"
                    placeholder="72"
                    value={formData.pouls}
                    onChange={handleChange}
                  />
                  <span className="flex items-center bg-gray-200 px-2 rounded-r">bpm</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saturation">
                  Saturation en oxygène
                </label>
                <div className="flex">
                  <input
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="saturation"
                    name="saturation"
                    type="number"
                    min="50"
                    max="100"
                    placeholder="98"
                    value={formData.saturation}
                    onChange={handleChange}
                  />
                  <span className="flex items-center bg-gray-200 px-2 rounded-r">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="glycemie">
                  Glycémie (si applicable)
                </label>
                <div className="flex">
                  <input
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="glycemie"
                    name="glycemie"
                    type="number"
                    step="0.01"
                    min="0"
                    max="30"
                    placeholder="5.5"
                    value={formData.glycemie}
                    onChange={handleChange}
                  />
                  <span className="flex items-center bg-gray-200 px-2 rounded-r">mmol/L</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                  Notes / Observations
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Observations complémentaires..."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
                {saving ? 'Enregistrement...' : 'Enregistrer les constantes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InfirmierConstantes;