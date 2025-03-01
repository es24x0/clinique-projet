import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import api from '../services/api';

const TestConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const testApiConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/check-connection');
      setTestResults(prev => [
        {
          id: Date.now(),
          success: true,
          endpoint: '/check-connection',
          message: response.data.message,
          time: response.data.time
        },
        ...prev
      ]);
    } catch (error) {
      setTestResults(prev => [
        {
          id: Date.now(),
          success: false,
          endpoint: '/check-connection',
          message: error.message,
          details: error.response?.data?.message || 'Aucun détail disponible'
        },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Test de connexion à l'API</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Tester les endpoints</h2>
          
          <div className="flex flex-col space-y-4">
            <div>
              <button
                onClick={testApiConnection}
                disabled={loading}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Test en cours...' : 'Tester la connexion à l\'API'}
              </button>
            </div>
            
            {testResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Résultats des tests</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left">Statut</th>
                        <th className="py-2 px-4 text-left">Endpoint</th>
                        <th className="py-2 px-4 text-left">Message</th>
                        <th className="py-2 px-4 text-left">Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((result) => (
                        <tr key={result.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {result.success ? 'Succès' : 'Échec'}
                            </span>
                          </td>
                          <td className="py-2 px-4">{result.endpoint}</td>
                          <td className="py-2 px-4">{result.message}</td>
                          <td className="py-2 px-4">{result.time || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestConnection;