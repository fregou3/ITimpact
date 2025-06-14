require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const CalculateurCO2 = require('./calculateur/CalculateurCO2');

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 5043;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Fonction pour initialiser la base de données
async function initDB() {
  try {
    // Créer les tables nécessaires
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aws_regions (
        id SERIAL PRIMARY KEY,
        region_name VARCHAR(50) NOT NULL,
        region_code VARCHAR(20) NOT NULL,
        co2_per_kwh DECIMAL(10, 4) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS instance_types (
        id SERIAL PRIMARY KEY,
        instance_name VARCHAR(50) NOT NULL,
        vcpu INTEGER NOT NULL,
        memory_gb DECIMAL(10, 2) NOT NULL,
        power_consumption_w DECIMAL(10, 2) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS country_connections (
        id SERIAL PRIMARY KEY,
        country_name VARCHAR(100) NOT NULL,
        country_code VARCHAR(10) NOT NULL,
        avg_data_transfer_mb DECIMAL(10, 2) NOT NULL,
        co2_per_gb DECIMAL(10, 4) NOT NULL
      );
    `);

    console.log('Base de données initialisée avec succès');
    
    // Lire et importer les données des fichiers Excel si nécessaire
    await importExcelData();
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
  }
}

// Fonction pour importer les données des fichiers Excel
async function importExcelData() {
  try {
    // Chemins vers les fichiers Excel
    const awsDataPath = path.join(__dirname, '..', 'AWS_CDN_CO2.xlsx');
    const clarinsDataPath = path.join(__dirname, '..', 'Clarins_Infra_CO2.xlsx');
    
    // Vérifier si les fichiers existent
    if (fs.existsSync(awsDataPath)) {
      // Lire le fichier AWS_CDN_CO2.xlsx
      const awsWorkbook = XLSX.readFile(awsDataPath);
      const awsSheet = awsWorkbook.Sheets[awsWorkbook.SheetNames[0]];
      const awsData = XLSX.utils.sheet_to_json(awsSheet);
      
      // Importer les données dans la base de données
      console.log('Données AWS disponibles pour l\'import:', awsData.length, 'entrées');
      
      // Ici, vous pourriez ajouter une logique pour insérer ces données dans les tables appropriées
    }
    
    if (fs.existsSync(clarinsDataPath)) {
      // Lire le fichier Clarins_Infra_CO2.xlsx
      const clarinsWorkbook = XLSX.readFile(clarinsDataPath);
      const clarinsSheet = clarinsWorkbook.Sheets[clarinsWorkbook.SheetNames[0]];
      const clarinsData = XLSX.utils.sheet_to_json(clarinsSheet);
      
      // Importer les données dans la base de données
      console.log('Données Clarins disponibles pour l\'import:', clarinsData.length, 'entrées');
      
      // Ici, vous pourriez ajouter une logique pour insérer ces données dans les tables appropriées
    }
    
    console.log('Import des données Excel terminé');
  } catch (err) {
    console.error('Erreur lors de l\'import des données Excel:', err);
  }
}

// Initialiser la base de données au démarrage
initDB();

// Routes API
app.get('/api/regions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aws_regions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/instances', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instance_types');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM country_connections');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// API pour calculer l'empreinte CO2
app.post('/api/calculate', async (req, res) => {
  try {
    const { 
      instances, // Liste des instances EC2 (type, région, nombre)
      connections // Liste des connexions par pays (pays, nombre de connexions)
    } = req.body;
    
    // Calcul de l'empreinte CO2 des instances EC2
    let totalInstanceCO2 = 0;
    for (const instance of instances) {
      // Récupérer les données de l'instance et de la région
      const instanceData = await pool.query(
        'SELECT * FROM instance_types WHERE instance_name = $1',
        [instance.type]
      );
      
      const regionData = await pool.query(
        'SELECT * FROM aws_regions WHERE region_code = $1',
        [instance.region]
      );
      
      if (instanceData.rows.length > 0 && regionData.rows.length > 0) {
        const { power_consumption_w } = instanceData.rows[0];
        const { co2_per_kwh } = regionData.rows[0];
        
        // Calcul du CO2: puissance * heures * co2/kwh * nombre d'instances
        // Supposons une utilisation 24/7 pendant un mois (730 heures)
        const instanceCO2 = (power_consumption_w / 1000) * 730 * co2_per_kwh * instance.count;
        totalInstanceCO2 += instanceCO2;
      }
    }
    
    // Calcul de l'empreinte CO2 des connexions réseau
    let totalConnectionCO2 = 0;
    for (const connection of connections) {
      // Récupérer les données du pays
      const countryData = await pool.query(
        'SELECT * FROM country_connections WHERE country_code = $1',
        [connection.country]
      );
      
      if (countryData.rows.length > 0) {
        const { avg_data_transfer_mb, co2_per_gb } = countryData.rows[0];
        
        // Calcul du CO2: transfert de données * co2/gb * nombre de connexions
        const connectionCO2 = (avg_data_transfer_mb / 1024) * co2_per_gb * connection.count;
        totalConnectionCO2 += connectionCO2;
      }
    }
    
    // Résultat total
    const totalCO2 = totalInstanceCO2 + totalConnectionCO2;
    
    res.json({
      instanceCO2: totalInstanceCO2,
      connectionCO2: totalConnectionCO2,
      totalCO2: totalCO2,
      unit: 'kg CO2e'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de calcul' });
  }
});

// API avancée pour calculer l'empreinte CO2 avec le nouveau calculateur
app.post('/api/calculate-advanced', async (req, res) => {
  try {
    const { 
      instances, // Liste des instances EC2 (type, région, nombre)
      connections, // Liste des connexions par pays (pays, nombre de connexions)
      useCDN = true, // Option pour utiliser CDN ou non
      deviceUsage = {}, // Données d'utilisation des appareils (optionnel)
      analytics = {} // Données analytics (optionnel)
    } = req.body;
    
    // Initialiser le calculateur CO2
    const calculateur = new CalculateurCO2();
    
    // Adapter les données au format du calculateur
    const donneesAdaptees = calculateur.adapterDonneesAPI(instances, connections);
    
    // Ajouter les données d'utilisation des appareils si fournies
    if (Object.keys(deviceUsage).length > 0) {
      donneesAdaptees.sessions = deviceUsage;
    }
    
    // Ajouter les données analytics si fournies
    if (Object.keys(analytics).length > 0) {
      donneesAdaptees.analytics = analytics;
    }
    
    // Effectuer l'analyse complète
    const resultat = calculateur.analyserPlateforme(donneesAdaptees);
    
    // Calculer les équivalences visuelles
    const co2Tonnes = resultat.impactTotal.avecCDN / 1000; // Convertir kg en tonnes
    const equivalences = calculateur.calculerEquivalences(co2Tonnes);
    
    // Ajouter des projections futures (par défaut: 10% croissance utilisateurs, 5% croissance usage)
    const projection = calculateur.projeterCroissance(
      resultat.impactTotal.avecCDN,
      0.10, // 10% croissance utilisateurs
      0.05, // 5% croissance usage
      1 // 1 an
    );
    
    // Retourner les résultats complets
    res.json({
      infrastructure: resultat.infrastructure,
      reseau: resultat.reseau,
      usage: resultat.usage,
      impactTotal: resultat.impactTotal,
      metriques: resultat.metriques,
      equivalences: equivalences,
      projection: projection,
      unit: 'kg CO2e'
    });
  } catch (err) {
    console.error('Erreur dans le calcul avancé:', err);
    res.status(500).json({ error: 'Erreur de calcul avancé', details: err.message });
  }
});

// API pour obtenir uniquement les équivalences visuelles
app.post('/api/equivalences', (req, res) => {
  try {
    const { co2Kg } = req.body;
    
    if (!co2Kg) {
      return res.status(400).json({ error: 'Le paramètre co2Kg est requis' });
    }
    
    const calculateur = new CalculateurCO2();
    const co2Tonnes = co2Kg / 1000; // Convertir kg en tonnes
    const equivalences = calculateur.calculerEquivalences(co2Tonnes);
    
    res.json({
      co2Kg,
      co2Tonnes,
      equivalences
    });
  } catch (err) {
    console.error('Erreur dans le calcul des équivalences:', err);
    res.status(500).json({ error: 'Erreur de calcul des équivalences', details: err.message });
  }
});

// API pour obtenir des projections futures
app.post('/api/projections', (req, res) => {
  try {
    const { 
      co2Actuel, 
      tauxCroissanceUtilisateurs = 0.10, 
      tauxCroissanceUsage = 0.05, 
      annees = 1 
    } = req.body;
    
    if (!co2Actuel) {
      return res.status(400).json({ error: 'Le paramètre co2Actuel est requis' });
    }
    
    const calculateur = new CalculateurCO2();
    const projection = calculateur.projeterCroissance(
      co2Actuel,
      tauxCroissanceUtilisateurs,
      tauxCroissanceUsage,
      annees
    );
    
    res.json({
      co2Actuel,
      projection,
      parametres: {
        tauxCroissanceUtilisateurs,
        tauxCroissanceUsage,
        annees
      }
    });
  } catch (err) {
    console.error('Erreur dans le calcul des projections:', err);
    res.status(500).json({ error: 'Erreur de calcul des projections', details: err.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});