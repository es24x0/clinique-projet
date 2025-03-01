import React from 'react';
import Navbar from '../components/common/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue à la Clinique Santé+</h1>
            <p className="text-xl mb-8">Des soins de qualité pour toute la famille</p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-100 transition duration-300">
                Créer un compte
              </Link>
              <Link to="/login" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition duration-300">
                Se connecter
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-4xl mb-4">
                  🏥
                </div>
                <h3 className="text-xl font-bold mb-2">Consultations</h3>
                <p className="text-gray-700">
                  Consultations médicales avec des professionnels qualifiés.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-4xl mb-4">
                  👨‍⚕️
                </div>
                <h3 className="text-xl font-bold mb-2">Spécialistes</h3>
                <p className="text-gray-700">
                  Accès à des médecins spécialistes dans divers domaines.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-4xl mb-4">
                  📅
                </div>
                <h3 className="text-xl font-bold mb-2">Rendez-vous en ligne</h3>
                <p className="text-gray-700">
                  Prise de rendez-vous facile et rapide via notre plateforme.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Clinique Santé+. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;