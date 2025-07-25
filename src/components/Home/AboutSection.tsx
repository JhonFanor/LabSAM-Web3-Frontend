import React from 'react';
import "./AboutSection.css";

const AboutSection: React.FC = () => {
    return (
        <div className="about-section">
            <h2>¿Qué somos?</h2>
            <p>
                LabSamWeb3 es una plataforma digital creada para centralizar, analizar y 
                divulgar información relevante sobre el desarrollo de tecnologías Web3 en 
                el departamento del Meta. Su propósito es promover la comprensión, participación 
                e implementación de soluciones innovadoras basadas en blockchain, descentralización, 
                ciberseguridad e interoperabilidad.
                <br></br>
                A través de noticias, eventos, investigaciones, legislación, oferta educativa y 
                oportunidades laborales, LabSamWeb3 busca fortalecer el ecosistema tecnológico regional. 
                Esta herramienta conecta a estudiantes, investigadores, emprendedores e instituciones 
                públicas y privadas, evitando que la región se quede rezagada frente al avance 
                de las tecnologías emergentes en otras zonas del país.

            </p>
        </div>
    );
};

export default AboutSection;
