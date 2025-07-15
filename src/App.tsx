import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { Navbar, Header } from './components';
import { Login, Register } from './components'; 
import News from './pages/News';
import Events from './pages/Event';
import './App.css';
import Companies from './pages/Company';
import Investigations from './pages/Investigation';
import JobBoard from './pages/JobBoard';
import BankOfResume from './pages/BankOfResume';
import EducationalOffers from './pages/EducationalOffer';
import Legislations from './pages/Legislation';
import Documentation from './pages/Documentation';
import { useAuth } from './providers/Auth';
import NewsDetail from './pages/NewsDetails';
import EventsDetail from './pages/EventDetails';
import InvestigationDetails from './pages/InvestigationDetails';
import JobBoardDetail from './pages/JobBoardDetails';
import BankOfResumeDetail from './pages/BankOfResumeDetails';
import CompanyDetail from './pages/CompanyDetails';
import EducationalOfferDetail from './pages/EducationalOfferDetails';
import LegislationDetail from './pages/LegislationDetails';
import DocumentationDetail from './pages/DocumentationDetails';

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
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<Events />} /> 
            <Route path="/event/:id" element={<EventsDetail />} />
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/investigation/:id" element={<InvestigationDetails />} />
            <Route path="/job-board" element={<JobBoard />} /> 
            <Route path="/job-board/:id" element={<JobBoardDetail />} /> 
            <Route path="/bank-of-resume" element={<BankOfResume />} />  
            <Route path="/bank-of-resume/:id" element={<BankOfResumeDetail />} />
            <Route path="/companies" element={<Companies />} /> 
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/educational-offers" element={<EducationalOffers />} /> 
            <Route path="/educational-offer/:id" element={<EducationalOfferDetail />} />
            <Route path="/legislations" element={<Legislations />} /> 
            <Route path="/legislation/:id" element={<LegislationDetail />} />
            <Route path="/documentations" element={<Documentation />} /> 
            <Route path="/documentation/:id" element={<DocumentationDetail />} />
          </Routes>
        </div>
        {!user && showLogin && (
          <div className="modal-overlay" onClick={closeModals}>
            <div onClick={(e) => e.stopPropagation()}> 
              <Login
                onClose={closeModals}
                onSwitchToRegister={handleRegisterClick}
              />
            </div>
          </div>
        )}
        {!user &&showRegister && (
          <div className="modal-overlay" onClick={closeModals}>
            <div onClick={(e) => e.stopPropagation()}> 
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