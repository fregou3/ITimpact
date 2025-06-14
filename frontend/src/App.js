import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import DashboardPage from './pages/DashboardPage';
import AwsImplicationPage from './pages/AwsImplicationPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/aws-implication" element={<AwsImplicationPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Calculateur d'Impact Environnemental AWS</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
