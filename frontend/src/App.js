import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import components (we'll create these next)
import Login from './pages/Login';
import Home from './pages/Home';
import PartyInfo from './pages/PartyInfo';
import RSVP from './pages/RSVP';
import Registries from './pages/Registries';
import CostumeParty from './pages/CostumeParty';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/party-info" element={
              <ProtectedRoute>
                <PartyInfo />
              </ProtectedRoute>
            } />
            <Route path="/rsvp" element={
              <ProtectedRoute>
                <RSVP />
              </ProtectedRoute>
            } />
            <Route path="/registries" element={
              <ProtectedRoute>
                <Registries />
              </ProtectedRoute>
            } />
            <Route path="/costume-contest" element={
              <ProtectedRoute>
                <CostumeParty />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 