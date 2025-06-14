require('dotenv').config();
const { Pool } = require('pg');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function createTables() {
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

    console.log('Tables créées avec succès');
  } catch (err) {
    console.error('Erreur lors de la création des tables:', err);
    throw err;
  }
}

async function importAwsData() {
  try {
    const awsDataPath = path.join(__dirname, '..', 'AWS_CDN_CO2.xlsx');
    
    if (!fs.existsSync(awsDataPath)) {
      console.log(`Le fichier ${awsDataPath} n'existe pas.`);
      return;
    }
    
    console.log(`Lecture du fichier: ${awsDataPath}`);
    const workbook = XLSX.readFile(awsDataPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Données lues: ${data.length} entrées`);
    
    // Vider les tables existantes
    await pool.query('TRUNCATE TABLE aws_regions CASCADE');
    await pool.query('TRUNCATE TABLE country_connections CASCADE');
    
    // Insérer les données AWS regions
    if (data.length > 0) {
      for (const row of data) {
        // Adaptez ces champs en fonction de la structure réelle de votre fichier Excel
        if (row.region_name && row.region_code && row.co2_per_kwh) {
          await pool.query(
            'INSERT INTO aws_regions (region_name, region_code, co2_per_kwh) VALUES ($1, $2, $3)',
            [row.region_name, row.region_code, row.co2_per_kwh]
          );
        }
        
        // Insérer les données de pays si elles existent
        if (row.country_name && row.country_code && row.avg_data_transfer_mb && row.co2_per_gb) {
          await pool.query(
            'INSERT INTO country_connections (country_name, country_code, avg_data_transfer_mb, co2_per_gb) VALUES ($1, $2, $3, $4)',
            [row.country_name, row.country_code, row.avg_data_transfer_mb, row.co2_per_gb]
          );
        }
      }
    }
    
    console.log('Données AWS importées avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'import des données AWS:', err);
    throw err;
  }
}

async function importClarinsData() {
  try {
    const clarinsDataPath = path.join(__dirname, '..', 'Clarins_Infra_CO2.xlsx');
    
    if (!fs.existsSync(clarinsDataPath)) {
      console.log(`Le fichier ${clarinsDataPath} n'existe pas.`);
      return;
    }
    
    console.log(`Lecture du fichier: ${clarinsDataPath}`);
    const workbook = XLSX.readFile(clarinsDataPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Données lues: ${data.length} entrées`);
    
    // Vider la table existante
    await pool.query('TRUNCATE TABLE instance_types CASCADE');
    
    // Insérer les données des types d'instances
    if (data.length > 0) {
      for (const row of data) {
        // Adaptez ces champs en fonction de la structure réelle de votre fichier Excel
        if (row.instance_name && row.vcpu && row.memory_gb && row.power_consumption_w) {
          await pool.query(
            'INSERT INTO instance_types (instance_name, vcpu, memory_gb, power_consumption_w) VALUES ($1, $2, $3, $4)',
            [row.instance_name, row.vcpu, row.memory_gb, row.power_consumption_w]
          );
        }
      }
    }
    
    console.log('Données Clarins importées avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'import des données Clarins:', err);
    throw err;
  }
}

async function insertDummyData() {
  try {
    // Insérer des données de test pour les régions AWS si la table est vide
    const regionCount = await pool.query('SELECT COUNT(*) FROM aws_regions');
    if (parseInt(regionCount.rows[0].count) === 0) {
      console.log('Insertion de données de test pour les régions AWS');
      const regions = [
        { name: 'US East (N. Virginia)', code: 'us-east-1', co2: 0.4147 },
        { name: 'US East (Ohio)', code: 'us-east-2', co2: 0.4407 },
        { name: 'US West (Oregon)', code: 'us-west-2', co2: 0.1531 },
        { name: 'Europe (Ireland)', code: 'eu-west-1', co2: 0.3748 },
        { name: 'Europe (Frankfurt)', code: 'eu-central-1', co2: 0.3377 },
        { name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1', co2: 0.4663 },
        { name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1', co2: 0.4332 },
        { name: 'Asia Pacific (Sydney)', code: 'ap-southeast-2', co2: 0.5522 }
      ];
      
      for (const region of regions) {
        await pool.query(
          'INSERT INTO aws_regions (region_name, region_code, co2_per_kwh) VALUES ($1, $2, $3)',
          [region.name, region.code, region.co2]
        );
      }
    }
    
    // Insérer des données de test pour les types d'instances
    const instanceCount = await pool.query('SELECT COUNT(*) FROM instance_types');
    if (parseInt(instanceCount.rows[0].count) === 0) {
      console.log('Insertion de données de test pour les types d\'instances');
      const instances = [
        { name: 't2.micro', vcpu: 1, memory: 1, power: 15.5 },
        { name: 't2.small', vcpu: 1, memory: 2, power: 19.7 },
        { name: 't2.medium', vcpu: 2, memory: 4, power: 25.2 },
        { name: 'm5.large', vcpu: 2, memory: 8, power: 44.5 },
        { name: 'm5.xlarge', vcpu: 4, memory: 16, power: 68.8 },
        { name: 'c5.large', vcpu: 2, memory: 4, power: 38.2 },
        { name: 'c5.xlarge', vcpu: 4, memory: 8, power: 57.6 },
        { name: 'r5.large', vcpu: 2, memory: 16, power: 51.3 }
      ];
      
      for (const instance of instances) {
        await pool.query(
          'INSERT INTO instance_types (instance_name, vcpu, memory_gb, power_consumption_w) VALUES ($1, $2, $3, $4)',
          [instance.name, instance.vcpu, instance.memory, instance.power]
        );
      }
    }
    
    // Insérer des données de test pour les pays
    const countryCount = await pool.query('SELECT COUNT(*) FROM country_connections');
    if (parseInt(countryCount.rows[0].count) === 0) {
      console.log('Insertion de données de test pour les pays');
      const countries = [
        { name: 'France', code: 'FR', transfer: 5.2, co2: 0.00855 },
        { name: 'United States', code: 'US', transfer: 6.8, co2: 0.01223 },
        { name: 'Germany', code: 'DE', transfer: 4.9, co2: 0.00912 },
        { name: 'United Kingdom', code: 'GB', transfer: 5.1, co2: 0.00732 },
        { name: 'Japan', code: 'JP', transfer: 4.7, co2: 0.01531 },
        { name: 'China', code: 'CN', transfer: 3.9, co2: 0.01952 },
        { name: 'India', code: 'IN', transfer: 3.2, co2: 0.01732 },
        { name: 'Australia', code: 'AU', transfer: 5.5, co2: 0.01233 }
      ];
      
      for (const country of countries) {
        await pool.query(
          'INSERT INTO country_connections (country_name, country_code, avg_data_transfer_mb, co2_per_gb) VALUES ($1, $2, $3, $4)',
          [country.name, country.code, country.transfer, country.co2]
        );
      }
    }
    
    console.log('Données de test insérées avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'insertion des données de test:', err);
    throw err;
  }
}

async function main() {
  try {
    // Créer les tables
    await createTables();
    
    // Importer les données des fichiers Excel
    await importAwsData();
    await importClarinsData();
    
    // Insérer des données de test si les fichiers Excel ne contiennent pas les bonnes données
    await insertDummyData();
    
    console.log('Import de données terminé avec succès');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de l\'import:', err);
    process.exit(1);
  }
}

// Exécuter le script
main();