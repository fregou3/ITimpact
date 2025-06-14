import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <h1>Calculez l'Impact Environnemental de votre Infrastructure AWS</h1>
          <p>
            Cet outil vous permet d'estimer l'empreinte carbone de votre infrastructure cloud AWS
            en fonction de vos instances EC2, du trafic réseau et de la localisation de vos utilisateurs.
          </p>
          <Link to="/calculator" className="btn btn-primary">
            Commencer le calcul
          </Link>
        </section>
        
        <section className="features">
          <h2>Fonctionnalités</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Calcul précis</h3>
              <p>
                Estimez l'empreinte CO2 en fonction des types d'instances, des régions AWS et du trafic réseau.
              </p>
            </div>
            <div className="feature-card">
              <h3>Données réelles</h3>
              <p>
                Basé sur des données réelles de consommation énergétique et d'émissions de CO2 par région.
              </p>
            </div>
            <div className="feature-card">
              <h3>Optimisations</h3>
              <p>
                Recevez des recommandations pour réduire l'empreinte carbone de votre infrastructure.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;