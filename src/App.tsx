import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { Navbar, Header } from './components';
import { Login, Register } from './components'; 
import News from './pages/News/News';
import Events from './pages/Event/Event';
import './App.css';
import Companies from './pages/Company/Company';
import JobBoard from './pages/JobBoard/JobBoard';
import EducationalOffers from './pages/EducationalOffer/EducationalOffer';
import Legislations from './pages/Legislation/Legislation';
import Documentation from './pages/Documentation/Documentation';
import { useAuth } from './providers/Auth';
import NewsDetail from './pages/News/NewsDetails';
import EventsDetail from './pages/Event/EventDetails';
import JobBoardDetail from './pages/JobBoard/JobBoardDetails';
import EducationalOfferDetail from './pages/EducationalOffer/EducationalOfferDetails';
import LegislationDetail from './pages/Legislation/LegislationDetails';
import DocumentationDetail from './pages/Documentation/DocumentationDetails';
import PendingApprovals from './pages/Admin/PendingApprovals';
import BankOfResumeNotApprovedDetail from './pages/BankOfResume/BankOfResumeNotApprovedDetail';
import DocumentationNotApprovedDetail from './pages/Documentation/DocumentationNotApprovedDetail';
import InvestigationDetail from './pages/Investigation/InvestigationDetails';
import Investigation from './pages/Investigation/Investigation';
import BankOfResume from './pages/BankOfResume/BankOfResume';
import BankOfResumeDetail from './pages/BankOfResume/BankOfResumeDetails';
import CompanyDetail from './pages/Company/CompanyDetails';
import CompanyNotApprovedDetail from './pages/Company/CompanyNotApprovedDetail';
import NewsNotApprovedDetail from './pages/News/NewsNotApprovedDetail';
import EventNotApprovedDetail from './pages/Event/EventNotApprovedDetail';
import InvestigationNotApprovedDetail from './pages/Investigation/InvestigationNotApprovedDetail';
import JobBoardNotApprovedDetail from './pages/JobBoard/JobBoardNotApprovedDetail';
import EducationalOfferNotApprovedDetail from './pages/EducationalOffer/EducationalOfferNotApprovedDetail';
import LegislationNotApprovedDetail from './pages/Legislation/LegislationNotApprovedDetail';
import Unauthorized from './pages/Admin/Unauthorized';
import AdminRoute from './components/Admin/AdminRoute';
import NewsByUserIDDetails from './pages/News/NewsByUserIDDetails';
import PublicationPage from './pages/User/Publication';

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
            <Route path="/user/news/:id" element={<NewsByUserIDDetails />} />
            <Route path="/admin/news/:id" element={<AdminRoute><NewsNotApprovedDetail /></AdminRoute>} />
            <Route path="/events" element={<Events />} /> 
            <Route path="/event/:id" element={<EventsDetail />} />
            <Route path="/admin/event/:id" element={<AdminRoute><EventNotApprovedDetail /></AdminRoute>} />
            <Route path="/investigations" element={<Investigation />} />
            <Route path="/investigation/:id" element={<InvestigationDetail />} />
            <Route path="/admin/investigation/:id" element={<AdminRoute><InvestigationNotApprovedDetail /></AdminRoute>} />
            <Route path="/jobs-board" element={<JobBoard />} /> 
            <Route path="/job-board/:id" element={<JobBoardDetail />} /> 
            <Route path="/admin/job-board/:id" element={<AdminRoute><JobBoardNotApprovedDetail /></AdminRoute>} />
            <Route path="/bank-of-resumes" element={<BankOfResume />} />  
            <Route path="/bank-of-resume/:id" element={<BankOfResumeDetail />} />
            <Route path="/admin/bank-of-resume/:id" element={<AdminRoute><BankOfResumeNotApprovedDetail /></AdminRoute>} />
            <Route path="/companies" element={<Companies />} /> 
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/admin/company/:id" element={<AdminRoute><CompanyNotApprovedDetail /></AdminRoute>} />
            <Route path="/educational-offers" element={<EducationalOffers />} /> 
            <Route path="/educational-offer/:id" element={<EducationalOfferDetail />} />
            <Route path="/admin/educational-offer/:id" element={<AdminRoute><EducationalOfferNotApprovedDetail /></AdminRoute>} />
            <Route path="/legislations" element={<Legislations />} /> 
            <Route path="/legislation/:id" element={<LegislationDetail />} />
            <Route path="/admin/legislation/:id" element={<AdminRoute><LegislationNotApprovedDetail /></AdminRoute>} />
            <Route path="/documentations" element={<Documentation />} /> 
            <Route path="/documentation/:id" element={<DocumentationDetail />} />
            <Route path="/admin/documentation/:id" element={<AdminRoute><DocumentationNotApprovedDetail /></AdminRoute>} />
            <Route path="/admin/pending-approvals" element={<AdminRoute><PendingApprovals /></AdminRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/user/publications" element={<PublicationPage />} />
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