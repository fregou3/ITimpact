import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>Calculateur d'Impact environnemental Clarins T.R.U.S.T.</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/calculator">Calculateur</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/aws-implication">Implication AWS</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;