import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import AuthService from '../../services/auth.service';
import api from '../../services/api';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_patients: 0,
    total_medecins: 0,
    total_infirmiers: 0,
    total_rendez_vous: 0,
    rendez_vous_today: 0,
  });
  const [users, setUsers] = useState([]);
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
            // Récupérer les statistiques
            const statsResponse = await api.get('/dashboard/stats');
            setStats(statsResponse.data);
            
            // Récupérer la liste des utilisateurs
            const usersResponse = await api.get('/users');
            setUsers(usersResponse.data);
            
          } catch (apiError) {
            console.error("Erreur API:", apiError);
            setError("Erreur lors de la récupération des données.");
            
            // Pour la démo, utiliser des données factices si l'API échoue
            setStats({
              total_patients: 48,
              total_medecins: 12,
              total_infirmiers: 25,
              total_rendez_vous: 156,
              rendez_vous_today: 23,
            });
            
            // Simuler des utilisateurs
            setUsers([
              { id: 1, name: 'Admin', email: 'admin@clinique.com', role: 'admin' },
              { id: 2, name: 'Dr. Martin', email: 'medecin@clinique.com', role: 'medecin' },
              { id: 3, name: 'Inf. Sophie', email: 'infirmier@clinique.com', role: 'infirmier' },
              { id: 4, name: 'Jean Dupont', email: 'patient@clinique.com', role: 'patient' },
              { id: 5, name: 'Sabir Essaad', email: 'sabir@gmail.com', role: 'patient' }
            ]);
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
        <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Cards statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Patients</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.total_patients}</p>
            <p className="text-sm text-gray-500 mt-1">Total des patients</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Médecins</h2>
            <p className="text-3xl font-bold text-green-600">{stats.total_medecins}</p>
            <p className="text-sm text-gray-500 mt-1">Total des médecins</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Infirmiers</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.total_infirmiers}</p>
            <p className="text-sm text-gray-500 mt-1">Total des infirmiers</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Rendez-vous</h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.total_rendez_vous}</p>
            <p className="text-sm text-gray-500 mt-1">Total des rendez-vous</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Aujourd'hui</h2>
            <p className="text-3xl font-bold text-red-600">{stats.rendez_vous_today}</p>
            <p className="text-sm text-gray-500 mt-1">Rendez-vous du jour</p>
          </div>
        </div>
        
        {/* Graphique et statistiques */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Statistiques</h2>
            <Link to="/dashboard/admin/statistiques" className="text-blue-600 hover:text-blue-800">
              Voir toutes les statistiques
            </Link>
          </div>
          
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p>Graphique des rendez-vous par mois</p>
            {/* Ici, on intégrerait un graphique avec une bibliothèque comme Chart.js ou Recharts */}
          </div>
        </div>
        
        {/* Gestion des utilisateurs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
            <Link to="/dashboard/admin/users/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Ajouter un utilisateur
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Nom</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Rôle</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.id}</td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'medecin' ? 'bg-green-100 text-green-800' :
                          user.role === 'infirmier' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/dashboard/admin/users/${user.id}/edit`} className="text-blue-600 hover:text-blue-800 mr-2">
                        Modifier
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <Link to="/dashboard/admin/users" className="text-blue-600 hover:text-blue-800">
              Voir tous les utilisateurs →
            </Link>
          </div>
        </div>
        
        {/* Dernières activités */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dernières activités</h2>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
              <div className="ml-3">
                <p className="text-sm text-gray-700">Nouveau médecin ajouté: Dr. Martin</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50">
              <div className="ml-3">
                <p className="text-sm text-gray-700">3 nouveaux patients inscrits</p>
                <p className="text-xs text-gray-500">Aujourd'hui à 10:30</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <div className="ml-3">
                <p className="text-sm text-gray-700">Mise à jour du système effectuée</p>
                <p className="text-xs text-gray-500">Hier à 18:45</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;