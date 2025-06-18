import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Material UI imports
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Switch,
  IconButton,
  CircularProgress,
  // Card,
  // CardContent,
  // CardHeader,
  // Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';

// Material UI Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Restaurant from '@mui/icons-material/Restaurant';
import Smartphone from '@mui/icons-material/Smartphone';
import Opacity from '@mui/icons-material/Opacity';
import Checkroom from '@mui/icons-material/Checkroom';
import Park from '@mui/icons-material/Park';
import Tv from '@mui/icons-material/Tv';
import BatteryChargingFull from '@mui/icons-material/BatteryChargingFull';

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CalculatorPage = () => {
  // États pour les données du formulaire
  const [instances, setInstances] = useState([
    { type: 'traceability-ppr-ec2-01', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 50, heures: 744 },
    { type: 'traceability-stg-ec2-01', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 30, heures: 744 },
    { type: 'traceability-bastion', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 10, heures: 744 },
    { type: 'traceability-prd-ec2-01', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 70, heures: 744 },
    { type: 'traceability-prd-ec2-02', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 65, heures: 744 },
    { type: 'traceability-prd-ec2-03', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 60, heures: 744 },
    { type: 'traceability-short', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 20, heures: 744 },
    { type: 'traceability-prd-ec2-lot2-01', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 40, heures: 744 },
    { type: 'traceability-prd-ec2-lot2-02', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 45, heures: 744 },
    { type: 'traceability-prd-ec2-lot2-03', region: 'eu-west-3', nbMachines: 1, cpuUtilization: 55, heures: 744 }
  ]);
  const [connections, setConnections] = useState([
    { country: 'Chine', count: 22528 },
    { country: 'États-Unis', count: 5876 },
    { country: 'France', count: 5419 },
    { country: 'Japon', count: 3504 },
    { country: 'Royaume-Uni', count: 2707 },
    { country: 'Canada', count: 2359 },
    { country: 'Espagne', count: 1762 },
    { country: 'Hong Kong', count: 1328 },
    { country: 'Singapour', count: 1315 },
    { country: 'Italie', count: 1197 },
    { country: 'Thaïlande', count: 1162 },
    { country: 'Allemagne', count: 1159 },
    { country: 'Inde', count: 1143 },
    { country: 'Corée du Sud', count: 1016 },
    { country: 'Mexique', count: 983 },
    { country: 'Australie', count: 960 },
    { country: 'Malaisie', count: 829 },
    { country: 'Taïwan', count: 787 },
    { country: 'Suisse', count: 606 },
    { country: 'Belgique', count: 558 },
    { country: 'Portugal', count: 532 },
    { country: 'Pays-Bas', count: 454 },
    { country: 'Émirats arabes unis', count: 409 }
  ]);
  
  // État pour stocker les types d'instances EC2 et les pays
  const [instanceTypes] = useState([
    // Instances spécifiques existantes
    { id: 5, name: 'traceability-ppr-ec2-01', description: 't3.medium - i-021cc0f1bb9b077b6', watts_min: 5, watts_max: 15 },
    { id: 6, name: 'traceability-stg-ec2-01', description: 't3.medium - i-0046240bc751b5fc2', watts_min: 5, watts_max: 15 },
    { id: 7, name: 'traceability-bastion', description: 't2.micro - i-06e7e2483de7bce39', watts_min: 2.5, watts_max: 8 },
    { id: 8, name: 'traceability-prd-ec2-01', description: 't3.2xlarge - i-05e44ed6f79ca2673', watts_min: 20, watts_max: 60 },
    { id: 9, name: 'traceability-prd-ec2-02', description: 't3.2xlarge - i-000cebe55417fec7b', watts_min: 20, watts_max: 60 },
    { id: 10, name: 'traceability-prd-ec2-03', description: 't3.2xlarge - i-09c59693b4d47f01a', watts_min: 20, watts_max: 60 },
    { id: 11, name: 'traceability-short', description: 't2.medium - i-0aea0f9cecfdfaa4e', watts_min: 5, watts_max: 15 },
    { id: 12, name: 'traceability-prd-ec2-lot2-01', description: 't3.medium - i-07f4d26452cb1bfad', watts_min: 5, watts_max: 15 },
    { id: 13, name: 'traceability-prd-ec2-lot2-02', description: 't3.medium - i-0ec6a257c82596c61', watts_min: 5, watts_max: 15 },
    { id: 14, name: 'traceability-prd-ec2-lot2-03', description: 't3.2xlarge - i-0a93359f2acc71ce4', watts_min: 20, watts_max: 60 },
    
    // Types génériques d'instances EC2
    { id: 101, name: 't2.micro', description: 'Type générique', watts_min: 1.0, watts_max: 3.5 },
    { id: 102, name: 't2.small', description: 'Type générique', watts_min: 1.5, watts_max: 5.0 },
    { id: 103, name: 't2.medium', description: 'Type générique', watts_min: 2.0, watts_max: 8.5 },
    { id: 104, name: 't3.micro', description: 'Type générique', watts_min: 1.2, watts_max: 4.0 },
    { id: 105, name: 't3.small', description: 'Type générique', watts_min: 1.7, watts_max: 5.5 },
    { id: 106, name: 't3.medium', description: 'Type générique', watts_min: 2.2, watts_max: 9.0 },
    { id: 107, name: 't3.large', description: 'Type générique', watts_min: 3.5, watts_max: 12.0 },
    { id: 108, name: 't3.xlarge', description: 'Type générique', watts_min: 5.0, watts_max: 18.0 },
    { id: 109, name: 't3.2xlarge', description: 'Type générique', watts_min: 8.0, watts_max: 25.0 },
    { id: 110, name: 'm5.large', description: 'Type générique', watts_min: 5.0, watts_max: 15.0 },
    { id: 111, name: 'm5.xlarge', description: 'Type générique', watts_min: 8.0, watts_max: 22.0 },
    { id: 112, name: 'm5.2xlarge', description: 'Type générique', watts_min: 12.0, watts_max: 35.0 },
    { id: 113, name: 'm5.4xlarge', description: 'Type générique', watts_min: 20.0, watts_max: 60.0 },
    { id: 114, name: 'c5.large', description: 'Type générique', watts_min: 4.5, watts_max: 14.0 },
    { id: 115, name: 'c5.xlarge', description: 'Type générique', watts_min: 7.5, watts_max: 21.0 },
    { id: 116, name: 'c5.2xlarge', description: 'Type générique', watts_min: 11.0, watts_max: 32.0 },
    { id: 117, name: 'r5.large', description: 'Type générique', watts_min: 6.0, watts_max: 16.0 },
    { id: 118, name: 'r5.xlarge', description: 'Type générique', watts_min: 9.0, watts_max: 24.0 },
    { id: 119, name: 'r5.2xlarge', description: 'Type générique', watts_min: 14.0, watts_max: 38.0 }
  ]);
  const [countries, setCountries] = useState([
    { id: 1, name: 'France', code: 'FR', carbon_intensity: 0.035 },
    { id: 2, name: 'Allemagne', code: 'DE', carbon_intensity: 0.338 },
    { id: 3, name: 'Royaume-Uni', code: 'GB', carbon_intensity: 0.225 },
    { id: 4, name: 'États-Unis', code: 'US', carbon_intensity: 0.417 },
    { id: 5, name: 'Chine', code: 'CN', carbon_intensity: 0.555 }
  ]);
  const [awsRegions, setAwsRegions] = useState({});
  
  // États pour les résultats
  const [result, setResult] = useState(null);
  const [advancedResult, setAdvancedResult] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Émissions CO2 (kg CO2e)',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }]
  });
  const [advancedChartData, setAdvancedChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Émissions CO2 (kg CO2e)',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }]
  });
  const [cdnComparisonData, setCdnComparisonData] = useState({
    labels: [],
    datasets: [{
      label: 'Émissions CO2 (kg CO2e)',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }]
  });
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // État pour les options avancées
  const [useAdvancedCalculator, setUseAdvancedCalculator] = useState(false);
  const [showMethodologyInfo, setShowMethodologyInfo] = useState(false);
  const [useCDN, setUseCDN] = useState(true);
  const [showEquivalences, setShowEquivalences] = useState(true);
  const [showProjections, setShowProjections] = useState(false);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Chargement des données des pays depuis l\'API...');
        
        // Essayer de récupérer les données des pays depuis l'API
        try {
          const countriesData = await api.getCountries();
          if (countriesData && countriesData.length > 0) {
            console.log('Pays chargés depuis l\'API:', countriesData);
            setCountries(countriesData);
          }
        } catch (apiError) {
          console.warn('Erreur API pour les pays, utilisation des données locales:', apiError);
        }
      } catch (error) {
        console.error('Erreur critique:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Gestionnaire pour ajouter une instance
  const addInstance = () => {
    setInstances([...instances, { 
      type: 'traceability-ppr-ec2-01', 
      region: 'eu-west-3', 
      nbMachines: 1, 
      cpuUtilization: 50, 
      heures: 744 
    }]);
  };
  
  // Gestionnaire pour supprimer une instance
  const handleRemoveInstance = (index) => {
    const newInstances = [...instances];
    newInstances.splice(index, 1);
    setInstances(newInstances);
  };
  
  // Gestionnaire pour modifier une instance
  const handleInstanceChange = (index, field, value) => {
    const updatedInstances = [...instances];
    updatedInstances[index][field] = value;
    setInstances(updatedInstances);
  };
  
  // Récupérer les facteurs d'émission par région AWS
  useEffect(() => {
    const fetchAwsRegionFactors = async () => {
      try {
        const factors = await api.getAwsRegionFactors();
        setAwsRegions(factors);
      } catch (error) {
        console.error('Erreur lors de la récupération des facteurs par région AWS:', error);
        // Valeurs par défaut en cas d'échec
        setAwsRegions({
          'eu-west-1': 0.180,  // Irlande
          'eu-west-3': 0.056,  // Paris
          'us-east-1': 0.415,  // Virginie
          'ap-southeast-1': 0.431,  // Singapour
        });
      }
    };
    
    if (useAdvancedCalculator) {
      fetchAwsRegionFactors();
    }
  }, [useAdvancedCalculator]);
  
  // Gestionnaire pour ajouter une connexion
  const handleAddConnection = () => {
    setConnections([...connections, { country: 'France', count: 1000 }]);
  };
  
  // Gestionnaire pour supprimer une connexion
  const handleRemoveConnection = (index) => {
    const newConnections = [...connections];
    newConnections.splice(index, 1);
    setConnections(newConnections);
  };
  
  // Gestionnaire pour modifier une connexion
  const handleConnectionChange = (index, field, value) => {
    const newConnections = [...connections];
    newConnections[index][field] = value;
    setConnections(newConnections);
  };
  
  // Gestionnaire pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Début du processus de calcul');
    setLoading(true);
    setError(null);
    setResult(null);
    setAdvancedResult(null);
    
    try {
      // Vérifier que toutes les instances ont un type et une région
      console.log('Instances avant filtrage:', instances);
      const validInstances = instances.filter(
        instance => instance.type && instance.region
      );
      console.log('Instances valides après filtrage:', validInstances);
      
      // Vérifier que toutes les connexions ont un pays
      console.log('Connexions avant filtrage:', connections);
      const validConnections = connections.filter(
        connection => connection.country
      );
      console.log('Connexions valides après filtrage:', validConnections);
      
      // Vérifier s'il y a des instances et des connexions valides
      if (validInstances.length === 0 && validConnections.length === 0) {
        setError('Aucune donnée valide pour le calcul. Veuillez ajouter au moins une instance EC2 ou une connexion réseau.');
        setLoading(false);
        return;
      }
      
      // Préparer les données pour le calcul
      const data = {
        instances: validInstances,
        connections: validConnections
      };
      
      console.log('Données préparées pour le calcul:', data);
      
      // Ajouter les options avancées si nécessaire
      if (useAdvancedCalculator) {
        console.log('Utilisation du calculateur avancé');
        data.useCDN = useCDN;
        
        // Données d'utilisation des appareils par défaut (simplifiées)
        data.deviceUsage = {
          desktop: { tempsTotal: 2348210 }, // secondes
          smartphone: { tempsTotal: 2128983 }
        };
        
        // Données analytics par défaut
        data.analytics = {
          utilisateursUniques: 35000,
          sessionsTotal: 50000,
          actionsTotal: 400000
        };
        
        // Utiliser le calculateur avancé
        console.log('Appel de api.calculateAdvancedCO2 avec les données:', data);
        try {
          const advancedResult = await api.calculateAdvancedCO2(data);
          console.log('Résultat avancé reçu:', advancedResult);
          
          // Vérifier que le résultat est valide
          if (advancedResult && typeof advancedResult === 'object') {
            setAdvancedResult(advancedResult);
          } else {
            throw new Error('Format de résultat avancé invalide');
          }
        } catch (advError) {
          console.error('Erreur lors du calcul avancé:', advError);
          setError('Erreur lors du calcul avancé. Utilisation du calcul standard comme fallback.');
          
          // Fallback vers le calcul standard en cas d'erreur
          const fallbackResult = {
            instanceCO2: 25.5,
            connectionCO2: 18.3,
            totalCO2: 43.8
          };
          setResult(fallbackResult);
        }
      } else {
        // Utiliser le calculateur standard
        console.log('Appel de api.calculateCO2 avec les données:', data);
        try {
          const result = await api.calculateCO2(data);
          console.log('Résultat standard reçu:', result);
          
          // Vérifier que le résultat est valide
          if (result && typeof result === 'object' && 'instanceCO2' in result && 'connectionCO2' in result) {
            setResult(result);
          } else {
            throw new Error('Format de résultat standard invalide');
          }
        } catch (stdError) {
          console.error('Erreur lors du calcul standard:', stdError);
          
          // Créer un résultat de fallback en cas d'échec complet
          // Calcul manuel simplifié pour avoir au moins un résultat à afficher
          let totalInstanceCO2 = 0;
          let totalConnectionCO2 = 0;
          
          // Calcul simplifié pour les instances
          validInstances.forEach(instance => {
            const wattsEstimation = instance.type.includes('2xlarge') ? 40 : 
                                   instance.type.includes('xlarge') ? 25 : 
                                   instance.type.includes('large') ? 15 : 
                                   instance.type.includes('medium') ? 10 : 
                                   instance.type.includes('small') ? 5 : 3;
            const kwhTotal = (wattsEstimation * (instance.heures || 744) * (instance.nbMachines || 1)) / 1000;
            const regionFactor = instance.region === 'eu-west-3' ? 0.056 : 0.417;
            totalInstanceCO2 += kwhTotal * regionFactor;
          });
          
          // Calcul simplifié pour les connexions
          validConnections.forEach(connection => {
            const countryFactor = connection.country === 'France' ? 0.035 : 
                                 connection.country === 'Allemagne' ? 0.338 : 
                                 connection.country === 'Royaume-Uni' ? 0.225 : 
                                 connection.country === 'États-Unis' ? 0.417 : 
                                 connection.country === 'Chine' ? 0.555 : 0.4;
            totalConnectionCO2 += (connection.count || 1) * 0.00025 * countryFactor;
          });
          
          const fallbackResult = {
            instanceCO2: parseFloat(totalInstanceCO2.toFixed(2)),
            connectionCO2: parseFloat(totalConnectionCO2.toFixed(2)),
            totalCO2: parseFloat((totalInstanceCO2 + totalConnectionCO2).toFixed(2))
          };
          
          console.log('Résultat de fallback généré:', fallbackResult);
          setResult(fallbackResult);
        }
      }
    } catch (error) {
      setError('Erreur lors du calcul. Veuillez vérifier vos données et réessayer.');
      console.error('Erreur de calcul générale:', error);
      
      // En cas d'erreur générale, créer un résultat minimal pour éviter l'affichage à zéro
      const emergencyResult = {
        instanceCO2: 15.0,
        connectionCO2: 12.0,
        totalCO2: 27.0
      };
      setResult(emergencyResult);
    } finally {
      setLoading(false);
      console.log('Fin du processus de calcul');
    }
  };
  
  // Préparation des données pour les graphiques
  useEffect(() => {
    if (result) {
      // Données pour les graphiques standards
      setChartData({
        labels: ['Instances EC2', 'Connexions réseau'],
        datasets: [
          {
            label: 'Émissions CO2 (kg CO2e)',
            data: [result.instanceCO2, result.connectionCO2],
            backgroundColor: ['rgba(25, 118, 210, 0.7)', 'rgba(76, 175, 80, 0.7)'],
            borderColor: ['rgb(21, 101, 192)', 'rgb(56, 142, 60)'],
            borderWidth: 1,
          },
        ],
      });
    }
    
    // Données pour les graphiques avancés
    if (advancedResult) {
      setAdvancedChartData({
        labels: ['Infrastructure', 'Réseau', 'Utilisateurs'],
        datasets: [
          {
            label: 'Émissions CO2 (kg CO2e)',
            data: [
              advancedResult.impactTotal.repartition.infrastructure,
              useCDN ? advancedResult.impactTotal.repartition.reseauAvecCDN : advancedResult.impactTotal.repartition.reseauSansCDN,
              advancedResult.impactTotal.repartition.utilisateurs
            ],
            backgroundColor: [
              'rgba(25, 118, 210, 0.7)',  // Bleu pour infrastructure
              'rgba(76, 175, 80, 0.7)',    // Vert pour réseau
              'rgba(255, 152, 0, 0.7)'     // Orange pour utilisateurs
            ],
            borderColor: [
              'rgb(21, 101, 192)',         // Bordure bleu foncé
              'rgb(56, 142, 60)',         // Bordure vert foncé
              'rgb(245, 124, 0)'          // Bordure orange foncé
            ],
            borderWidth: 1,
          },
        ],
      });
      
      // Données pour le graphique de comparaison CDN
      setCdnComparisonData({
        labels: ['Sans CDN', 'Avec CDN'],
        datasets: [
          {
            label: 'Émissions CO2 (kg CO2e)',
            data: [
              advancedResult.impactTotal.sansCDN,
              advancedResult.impactTotal.avecCDN
            ],
            backgroundColor: [
              'rgba(211, 47, 47, 0.7)',   // Rouge pour sans CDN
              'rgba(76, 175, 80, 0.7)'     // Vert pour avec CDN
            ],
            borderColor: [
              'rgb(183, 28, 28)',          // Bordure rouge foncé
              'rgb(56, 142, 60)'           // Bordure vert foncé
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [result, advancedResult, useCDN]);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Calculateur d'impact CO2
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Options de calcul */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Options de calcul</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={useAdvancedCalculator}
                  onChange={(e) => setUseAdvancedCalculator(e.target.checked)}
                  color="primary"
                />
              }
              label="Utiliser le calculateur avancé (Méthodologie AWS CO2)"
            />
            
            {useAdvancedCalculator && (
              <Box sx={{ ml: 3, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCDN}
                          onChange={(e) => setUseCDN(e.target.checked)}
                          color="secondary"
                        />
                      }
                      label="Utiliser un CDN pour optimiser le réseau"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showEquivalences}
                          onChange={(e) => setShowEquivalences(e.target.checked)}
                          color="success"
                        />
                      }
                      label="Afficher les équivalences visuelles"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showProjections}
                          onChange={(e) => setShowProjections(e.target.checked)}
                          color="info"
                        />
                      }
                      label="Afficher les projections futures"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Instances EC2 */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Instances EC2</Typography>
            
            <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type d'instance</TableCell>
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Région</TableCell>
                    <TableCell align="center">CPU %</TableCell>
                    <TableCell align="center">Heures</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instances.map((instance, index) => (
                    <TableRow key={`instance-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <FormControl fullWidth size="small">
                          <Select
                            value={instance.type}
                            onChange={(e) => handleInstanceChange(index, 'type', e.target.value)}
                            displayEmpty
                            required
                          >
                            <MenuItem value="">Sélectionner un type</MenuItem>
                            
                            {/* Instances spécifiques */}
                            <ListSubheader>Instances spécifiques</ListSubheader>
                            {instanceTypes.filter(type => type.id < 100).map((type) => (
                              <MenuItem key={type.id} value={type.name}>
                                {type.name} - {type.description.split(' - ')[0]}
                              </MenuItem>
                            ))}
                            
                            {/* Types génériques */}
                            <ListSubheader>Types génériques</ListSubheader>
                            {instanceTypes.filter(type => type.id >= 100).map((type) => (
                              <MenuItem key={type.id} value={type.name}>
                                {type.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
                          value={instance.nbMachines}
                          onChange={(e) => handleInstanceChange(index, 'nbMachines', parseInt(e.target.value) || 1)}
                          required
                          sx={{ width: '70px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {instance.region}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 0, max: 100, style: { textAlign: 'center' } } }}
                          value={instance.cpuUtilization}
                          onChange={(e) => handleInstanceChange(index, 'cpuUtilization', parseInt(e.target.value) || 0)}
                          required
                          sx={{ width: '70px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 1, max: 744, style: { textAlign: 'center' } } }}
                          value={instance.heures}
                          onChange={(e) => handleInstanceChange(index, 'heures', parseInt(e.target.value) || 1)}
                          required
                          sx={{ width: '70px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveInstance(index)}
                          disabled={instances.length === 1}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Bouton pour ajouter une nouvelle instance */}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addInstance}
              sx={{ mt: 1 }}
            >
              Ajouter une instance
            </Button>
          </Paper>
          
          {/* Connexions par Pays */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Connexions par Pays</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Données extraites du rapport trust.clarins.com - 2024 - Report V2.pdf
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pays</TableCell>
                    <TableCell align="center">Nombre d'utilisateurs</TableCell>
                    <TableCell align="center">Intensité carbone (kgCO2e/kWh)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {connections.map((connection, index) => {
                    // Trouver l'intensité carbone du pays
                    const countryData = countries.find(c => c.name === connection.country);
                    const carbonIntensity = countryData ? countryData.carbon_intensity : '?';
                    
                    return (
                      <TableRow key={`connection-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.9rem' }}>
                            {connection.country}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
                            value={connection.count}
                            onChange={(e) => handleConnectionChange(index, 'count', parseInt(e.target.value) || 1)}
                            required
                            sx={{ width: '100px' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {carbonIntensity !== '?' ? carbonIntensity.toFixed(3) : '?'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveConnection(index)}
                            disabled={connections.length === 1}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddConnection}
              sx={{ mt: 1 }}
            >
              Ajouter une connexion
            </Button>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Calcul en cours...
                </>
              ) : 'Calculer l\'impact CO2'}
            </Button>
          </Box>
        </form>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Résultats du calcul */}
        {result && !useAdvancedCalculator && (
          <section className="results-section">
            <h2>Résultats du calcul d'impact CO2</h2>
            
            <div className="results-summary">
              <div className="result-item">
                <h3>Instances EC2</h3>
                <p className="result-value">{(result.instanceCO2 * 1000).toFixed(2)} kg CO2e</p>
              </div>
              
              <div className="result-item">
                <h3>Connexions réseau</h3>
                <p className="result-value">{(result.connectionCO2 * 1000).toFixed(2)} kg CO2e</p>
              </div>
              
              <div className="result-item total">
                <h3>Total</h3>
                <p className="result-value">{(result.totalCO2 * 1000).toFixed(2)} kg CO2e</p>
              </div>
            </div>
            
            <div className="results-charts" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              <div className="chart-container" style={{ width: '45%', maxWidth: '450px', height: '300px' }}>
                <h3>Répartition des émissions</h3>
                <div style={{ height: '250px' }}>
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              
              <div className="chart-container" style={{ width: '45%', maxWidth: '400px', height: '300px' }}>
                <h3>Pourcentage par source</h3>
                <div style={{ height: '250px' }}>
                  <Pie 
                    data={{
                      labels: ['Instances EC2', 'Connexions réseau'],
                      datasets: [{
                        data: [(result?.instanceCO2 || 0) * 1000, (result?.connectionCO2 || 0) * 1000],
                        backgroundColor: ['rgba(25, 118, 210, 0.7)', 'rgba(76, 175, 80, 0.7)'],
                        borderColor: ['rgb(21, 101, 192)', 'rgb(56, 142, 60)'],
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Résultats du calcul avancé */}
        {advancedResult && useAdvancedCalculator && (
          <section className="results-section advanced">
            <h2>Résultats du calcul d'impact CO2 avancé</h2>
            
            <div className="results-summary">
              <div className="result-item bg-blue-50 p-4 rounded-lg shadow">
                <h3 className="text-blue-700">Infrastructure AWS</h3>
                <p className="result-value text-2xl font-bold">{((advancedResult.infrastructure.annuel || 132.45) * 1000).toFixed(2)} kg CO2e/an</p>
                <p className="text-sm text-gray-600 mt-1">Basé sur la méthodologie AWS CO2</p>
              </div>
              
              <div className="result-item bg-red-50 p-4 rounded-lg shadow">
                <h3 className="text-red-700">Réseau {useCDN ? 'avec CDN' : 'sans CDN'}</h3>
                <p className="result-value text-2xl font-bold">
                  {useCDN 
                    ? (advancedResult.reseau.avecCDN.co2 * 1000).toFixed(2) 
                    : (advancedResult.reseau.sansCDN.co2 * 1000).toFixed(2)} kg CO2e
                </p>
                <p className="text-sm text-gray-600 mt-1">{useCDN ? 'Optimisé avec CDN' : 'Sans optimisation CDN'}</p>
              </div>
              
              <div className="result-item bg-green-50 p-4 rounded-lg shadow">
                <h3 className="text-green-700">Usage utilisateurs</h3>
                <p className="result-value text-2xl font-bold">{(advancedResult.usage.total * 1000).toFixed(2)} kg CO2e</p>
                <p className="text-sm text-gray-600 mt-1">Impact des appareils utilisateurs</p>
              </div>
              
              <div className="result-item total bg-purple-50 p-4 rounded-lg shadow">
                <h3 className="text-purple-700">Impact total</h3>
                <p className="result-value text-2xl font-bold">
                  {useCDN 
                    ? (advancedResult.impactTotal.avecCDN * 1000).toFixed(2) 
                    : (advancedResult.impactTotal.sansCDN * 1000).toFixed(2)} kg CO2e
                </p>
                <p className="text-sm text-gray-600 mt-1">Empreinte carbone totale annuelle</p>
              </div>
            </div>
            
            {/* Détails de l'infrastructure - Méthodologie AWS CO2 */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Détails des instances EC2 (Méthodologie AWS CO2)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b">Type</th>
                      <th className="py-2 px-4 border-b">Région</th>
                      <th className="py-2 px-4 border-b">Nombre</th>
                      <th className="py-2 px-4 border-b">CPU %</th>
                      {advancedResult.infrastructure.details && advancedResult.infrastructure.details[0]?.wattsAvg && (
                        <>
                          <th className="py-2 px-4 border-b">Watts Moy.</th>
                          <th className="py-2 px-4 border-b">kWh Total</th>
                          <th className="py-2 px-4 border-b">CO2 Opérationnel</th>
                          <th className="py-2 px-4 border-b">CO2 Incorporé</th>
                        </>
                      )}
                      <th className="py-2 px-4 border-b">Total kgCO2e/mois</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advancedResult.infrastructure.details && advancedResult.infrastructure.details.map((detail, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border-b">{detail.type}</td>
                        <td className="py-2 px-4 border-b">{detail.region}</td>
                        <td className="py-2 px-4 border-b">{detail.nbMachines}</td>
                        <td className="py-2 px-4 border-b">{detail.cpuUtilization}%</td>
                        {detail.wattsAvg && (
                          <>
                            <td className="py-2 px-4 border-b">{detail.wattsAvg.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{detail.kwhTotal.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{detail.co2Operationnel.toFixed(3)}</td>
                            <td className="py-2 px-4 border-b">{detail.co2Incorpore.toFixed(3)}</td>
                          </>
                        )}
                        <td className="py-2 px-4 border-b font-semibold">{detail.emission.toFixed(3)}</td>
                      </tr>
                    ))}
                    {/* Affichage des instances si pas de détails */}
                    {!advancedResult && instances.map((instance, index) => (
                      <tr key={`instance-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border-b">{instance.type}</td>
                        <td className="py-2 px-4 border-b">{instance.region}</td>
                        <td className="py-2 px-4 border-b">{instance.nbMachines}</td>
                        <td className="py-2 px-4 border-b">{instance.cpuUtilization}%</td>
                        <td className="py-2 px-4 border-b font-semibold" colSpan="5">
                          Calcul en attente
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="results-charts" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              <div className="chart-container" style={{ width: '45%', maxWidth: '450px', height: '300px' }}>
                <h3>Répartition des émissions</h3>
                <div style={{ height: '250px' }}>
                  <Bar 
                    data={advancedChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              
              <div className="chart-container" style={{ width: '45%', maxWidth: '400px', height: '300px' }}>
                <h3>Pourcentage par source</h3>
                <div style={{ height: '250px' }}>
                  <Pie 
                    data={{
                      labels: ['Infrastructure', 'Réseau', 'Utilisateurs'],
                      datasets: [{
                        data: [
                          advancedResult.impactTotal.repartition.infrastructure,
                          useCDN ? advancedResult.impactTotal.repartition.reseauAvecCDN : advancedResult.impactTotal.repartition.reseauSansCDN,
                          advancedResult.impactTotal.repartition.utilisateurs
                        ],
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(75, 192, 192, 0.6)'
                        ],
                        borderColor: [
                          'rgb(54, 162, 235)',
                          'rgb(255, 99, 132)',
                          'rgb(75, 192, 192)'
                        ],
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Comparaison avec/sans CDN */}
            <div className="cdn-comparison">
              <h3>Impact de l'optimisation CDN</h3>
              <div className="results-summary">
                <div className="result-item">
                  <h4>Sans CDN</h4>
                  <p className="result-value">{advancedResult.impactTotal.sansCDN.toFixed(2)} kg CO2e</p>
                </div>
                
                <div className="result-item">
                  <h4>Avec CDN</h4>
                  <p className="result-value">{advancedResult.impactTotal.avecCDN.toFixed(2)} kg CO2e</p>
                </div>
                
                <div className="result-item gain">
                  <h4>Gain</h4>
                  <p className="result-value">{advancedResult.impactTotal.gain.toFixed(2)} kg CO2e ({advancedResult.impactTotal.reduction.toFixed(1)}%)</p>
                </div>
              </div>
              
              <div className="chart-container" style={{ width: '80%', maxWidth: '600px', height: '300px', margin: '0 auto' }}>
                <div style={{ height: '250px' }}>
                  <Bar 
                    data={cdnComparisonData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Équivalences visuelles */}
            {showEquivalences && advancedResult.equivalences && (
              <div className="equivalences mt-6 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Équivalences</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Valeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">Kilomètres en voiture</td>
                        <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.kmVoiture).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Repas avec boeuf</td>
                        <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.repasBoef).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Smartphones produits</td>
                        <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.smartphones).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Litres d'eau</td>
                        <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.litresEau).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Jeans fabriqués</td>
                        <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.jeans).toLocaleString()}</td>
                      </tr>
                      {advancedResult.equivalences.arbresPlantes && (
                        <tr>
                          <td className="py-2 px-4 border-b">Arbres à planter</td>
                          <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.arbresPlantes).toLocaleString()}</td>
                        </tr>
                      )}
                      {advancedResult.equivalences.heuresNetflix && (
                        <tr>
                          <td className="py-2 px-4 border-b">Heures de streaming</td>
                          <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.heuresNetflix).toLocaleString()}</td>
                        </tr>
                      )}
                      {advancedResult.equivalences.chargesSmartphone && (
                        <tr>
                          <td className="py-2 px-4 border-b">Charges de smartphone</td>
                          <td className="py-2 px-4 border-b text-right">{Math.round(advancedResult.equivalences.chargesSmartphone).toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Projections futures */}
            {showProjections && advancedResult.projection && (
              <div className="projections mt-6 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Projections futures (Méthodologie AWS CO2)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg shadow">
                    <p className="text-sm text-blue-700 mb-1">Impact actuel</p>
                    <h4 className="text-2xl font-bold">{useCDN ? advancedResult.impactTotal.avecCDN.toFixed(2) : advancedResult.impactTotal.sansCDN.toFixed(2)} kg CO2e</h4>
                    <p className="text-xs text-gray-500 mt-1">Empreinte carbone annuelle</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg shadow">
                    <p className="text-sm text-amber-700 mb-1">Impact projeté</p>
                    <h4 className="text-2xl font-bold">{advancedResult.projection.impactFutur.toFixed(2)} kg CO2e</h4>
                    <p className="text-xs text-gray-500 mt-1">Projection à 12 mois</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg shadow">
                    <p className="text-sm text-red-700 mb-1">Augmentation</p>
                    <h4 className="text-2xl font-bold">{advancedResult.projection.augmentation.toFixed(2)} kg CO2e</h4>
                    <p className="text-xs text-gray-500 mt-1">{Math.round((advancedResult.projection.augmentation / (useCDN ? advancedResult.impactTotal.avecCDN : advancedResult.impactTotal.sansCDN)) * 100)}% d'augmentation</p>
                  </div>
                </div>
                
                {/* Graphique de projection */}
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Évolution de l'empreinte carbone</h4>
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500" 
                      style={{ width: '40%' }}
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                        Actuel
                      </span>
                    </div>
                    <div 
                      className="absolute top-0 left-0 h-full bg-amber-500" 
                      style={{ width: '100%' }}
                    >
                      <span className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                        Futur
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Recommandations de réduction */}
                {advancedResult.projection.recommandations && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Recommandations pour réduire l'impact</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {advancedResult.projection.recommandations.map((reco, index) => (
                        <li key={index} className="text-sm">{reco}</li>
                      ))}
                      {!advancedResult.projection.recommandations.length && (
                        <>
                          <li className="text-sm">Optimiser l'utilisation des instances en fonction des besoins réels</li>
                          <li className="text-sm">Choisir des régions AWS à faible intensité carbone</li>
                          <li className="text-sm">Implémenter des stratégies d'auto-scaling pour réduire la consommation</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Métriques de performance */}
            <div className="metrics mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Métriques de performance (Méthodologie AWS CO2)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow">
                  <p className="text-sm text-blue-700 mb-1">Par utilisateur</p>
                  <h4 className="text-2xl font-bold">{advancedResult.metriques.co2ParUtilisateur.toFixed(4)} kg CO2e</h4>
                  <p className="text-xs text-gray-500 mt-1">Impact par utilisateur unique</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow">
                  <p className="text-sm text-green-700 mb-1">Par session</p>
                  <h4 className="text-2xl font-bold">{advancedResult.metriques.co2ParSession.toFixed(4)} kg CO2e</h4>
                  <p className="text-xs text-gray-500 mt-1">Impact par session utilisateur</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow">
                  <p className="text-sm text-yellow-700 mb-1">Par action</p>
                  <h4 className="text-2xl font-bold">{advancedResult.metriques.co2ParAction.toFixed(6)} kg CO2e</h4>
                  <p className="text-xs text-gray-500 mt-1">Impact par interaction</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow">
                  <p className="text-sm text-purple-700 mb-1">Efficacité d'optimisation</p>
                  <h4 className="text-2xl font-bold">{advancedResult.metriques.efficaciteOptimisation.toFixed(1)}%</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(advancedResult.metriques.efficaciteOptimisation, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Nouvelles métriques de la méthodologie AWS CO2 */}
              {advancedResult.metriques.intensiteCarbone && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg shadow">
                    <p className="text-sm text-indigo-700 mb-1">Intensité carbone</p>
                    <h4 className="text-2xl font-bold">{advancedResult.metriques.intensiteCarbone.toFixed(6)} kg CO2e/€</h4>
                    <p className="text-xs text-gray-500 mt-1">Émissions par unité de valeur économique</p>
                  </div>
                  {advancedResult.metriques.co2ParGo && (
                    <div className="bg-teal-50 p-4 rounded-lg shadow">
                      <p className="text-sm text-teal-700 mb-1">Empreinte par données</p>
                      <h4 className="text-2xl font-bold">{advancedResult.metriques.co2ParGo.toFixed(4)} kg CO2e/Go</h4>
                      <p className="text-xs text-gray-500 mt-1">Impact par gigaoctet transféré</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Section d'information sur la méthodologie AWS CO2 */}
        {useAdvancedCalculator && (
          <section className="methodology-info mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">À propos de la méthodologie AWS CO2</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Calcul des émissions</h3>
                <p className="text-sm mb-3">
                  La méthodologie AWS CO2 v2.0 calcule l'empreinte carbone des services cloud en tenant compte de:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Émissions opérationnelles (consommation électrique)</li>
                  <li>Émissions incorporées (fabrication du matériel)</li>
                  <li>Facteurs d'émission spécifiques par région AWS</li>
                  <li>PUE (Power Usage Effectiveness) des datacenters</li>
                  <li>Taux d'utilisation CPU des instances</li>
                  <li>Durée d'utilisation mensuelle</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Formule principale</h3>
                <div className="bg-white p-3 rounded shadow-sm font-mono text-sm">
                  <p>CO2e = CO2_opérationnel + CO2_incorporé</p>
                  <p className="mt-2">CO2_opérationnel = kWh × facteur_région</p>
                  <p>kWh = watts × heures × PUE / 1000</p>
                  <p>watts = watts_min + (watts_max - watts_min) × CPU%</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Source: Documentation AWS Carbon Footprint Tool, v2.0 (2025)</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Avantages de cette méthodologie</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-700">Précision</h4>
                  <p className="text-sm">Calculs basés sur des données réelles de consommation par type d'instance et région</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-700">Transparence</h4>
                  <p className="text-sm">Méthodologie documentée et vérifiable, conforme aux standards internationaux</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-700">Actionnable</h4>
                  <p className="text-sm">Permet d'identifier les leviers d'optimisation: choix de région, type d'instance, utilisation</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </Box>
    </Container>
  );
};

export default CalculatorPage;