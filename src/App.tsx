import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { Navbar, Header } from './components';
import { Login, Register } from './components'; // Importa los nuevos componentes
import News from './pages/News';
import Events from './pages/Events';
import './App.css';
import Companies from './pages/Companies';
import Investigations from './pages/Investigations';
import JobBoard from './pages/JobBoard';
import ResumenBank from './pages/ResumenBank';
import EducationalOffers from './pages/EducationalOffers';
import Legislations from './pages/Legislations';
import Documentations from './pages/Documentations';
import { useAuth } from './providers/Auth';

const App: React.FC = () => {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          toggleMenu={toggleMenu} 
          menuVisible={menuVisible} 
          onLoginClick={handleLoginClick} 
          onRegisterClick={handleRegisterClick} 
        />
        <Navbar menuVisible={menuVisible} />
        <div className="main">
          <Routes>  
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Events />} /> 
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/job-board" element={<JobBoard />} /> 
            <Route path="/resume-bank" element={<ResumenBank />} />  
            <Route path="/companies" element={<Companies />} /> 
            <Route path="/educational-offers" element={<EducationalOffers />} /> 
            <Route path="/legislations" element={<Legislations />} /> 
            <Route path="/documentations" element={<Documentations />} /> 
          </Routes>
        </div>
        {!user && showLogin && (
          <div className="modal-overlay" onClick={closeModals}>
            <div onClick={(e) => e.stopPropagation()}> {/* Detener la propagación del evento */}
              <Login
                onClose={closeModals}
                onSwitchToRegister={handleRegisterClick}
              />
            </div>
          </div>
        )}
        {!user &&showRegister && (
          <div className="modal-overlay" onClick={closeModals}>
            <div onClick={(e) => e.stopPropagation()}> {/* Detener la propagación del evento */}
              <Register
                onClose={closeModals}
                onSwitchToLogin={handleLoginClick}
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;