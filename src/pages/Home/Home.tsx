import React from 'react';
import AboutSection from '../../components/Home/AboutSection';
import PublicationsSection from '../../components/Home/PublicationsSection';
import Footer from '../../components/Home/Footer';
import ReportsSection from '../../components/Home/ReportsSection';
import Header  from '../../components/Home/Header';

const HomePage: React.FC = () => {

    return (
        <>
            <Header />
            <AboutSection />
            <PublicationsSection />
            <ReportsSection />
            <Footer />
        </>
    );
};

export default HomePage;
