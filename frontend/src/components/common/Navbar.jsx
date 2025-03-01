import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Clinique Santé+</Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-200">Accueil</Link>
          <Link to="/contact" className="hover:text-blue-200">Contact</Link>
          
          {currentUser ? (
            <>
              <Link to={`/dashboard/${currentUser.role}`} className="hover:text-blue-200">
                Mon Espace
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-200">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Connexion</Link>
              <Link to="/register" className="hover:text-blue-200">Inscription</Link>
              <Link to="/test-connection" className="hover:text-blue-200">Test API</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;