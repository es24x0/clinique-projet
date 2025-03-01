import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthService from './services/auth.service';
import TestConnection from './pages/TestConnection';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import PatientProfile from './pages/dashboards/PatientProfile';
import MedecinDashboard from './pages/dashboards/MedecinDashboard';
import MedecinPatientDetail from './pages/dashboards/MedecinPatientDetail';
import InfirmierDashboard from './pages/dashboards/InfirmierDashboard';
import InfirmierConstantes from './pages/dashboards/InfirmierConstantes';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminUserCreate from './pages/dashboards/AdminUserCreate';

// Composant temporaire pour les pages en construction
const UnderConstruction = ({ pageName }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Page en construction</h1>
        <p className="text-gray-600 mb-6">La page {pageName} est en cours de développement.</p>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  </div>
);

// Route protégée qui vérifie l'authentification et le rôle
const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<UnderConstruction pageName="Contact" />} />
        
        {/* Route de test de connexion */}
        <Route path="/test-connection" element={<TestConnection />} />
        
        {/* Routes Patient */}
        <Route 
          path="/dashboard/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/patient/profile" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/patient/rendez-vous/nouveau" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <UnderConstruction pageName="Prise de rendez-vous" />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes Médecin */}
        <Route 
          path="/dashboard/medecin" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <MedecinDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/patients/:patientId" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <MedecinPatientDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/patients" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Liste des patients" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/agenda" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Agenda complet" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/rendez-vous/nouveau" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Nouveau rendez-vous" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/prescriptions/nouvelle" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Nouvelle prescription" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/prescriptions/:id" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Détails de la prescription" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/medecin/profile" 
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <UnderConstruction pageName="Profil médecin" />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes Infirmier */}
        <Route 
          path="/dashboard/infirmier" 
          element={
            <ProtectedRoute allowedRoles={['infirmier']}>
              <InfirmierDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/infirmier/constantes" 
          element={
            <ProtectedRoute allowedRoles={['infirmier']}>
              <InfirmierConstantes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/infirmier/constantes/:patientId" 
          element={
            <ProtectedRoute allowedRoles={['infirmier']}>
              <InfirmierConstantes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/infirmier/planning" 
          element={
            <ProtectedRoute allowedRoles={['infirmier']}>
              <UnderConstruction pageName="Planning complet" />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes Admin */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/users/create" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUserCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UnderConstruction pageName="Liste des utilisateurs" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/users/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UnderConstruction pageName="Modification d'utilisateur" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin/statistiques" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UnderConstruction pageName="Statistiques détaillées" />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;