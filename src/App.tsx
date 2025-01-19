import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { Navbar } from './components';
import News from './pages/News';
import Events from './pages/Events';
import { Header } from './components';
import './App.css';
import Companies from './pages/Companies';
import Investigations from './pages/Investigations';
import JobBoard from './pages/JobBoard';
import ResumenBank from './pages/ResumenBank';
import EducationalOffers from './pages/EducationalOffers';
import Legislations from './pages/Legislations';
import Documentations from './pages/Documentations';

const App: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Router>
      <div className="app">
        <Header toggleMenu={toggleMenu} menuVisible={menuVisible} />
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
      </div>
    </Router>
  );
};

export default App;
