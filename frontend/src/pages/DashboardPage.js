import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import 'leaflet/dist/leaflet.css';

// Composant de contrôle pour réinitialiser la vue de la carte
const ResetViewControl = ({ center, zoom }) => {
  const map = useMap();
  
  const handleReset = () => {
    map.setView(center, zoom);
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '60px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleReset}
          title="Réinitialiser la vue"
          style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ZoomOutMapIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

// Composant WorldMap avec OpenStreetMap via react-leaflet
const WorldMap = () => {
  // Position et zoom par défaut
  const defaultCenter = [30, 0];
  const defaultZoom = 2;
  
  // Coordonnées des pays (latitude, longitude)
  const countryPositions = [
    { id: 'CN', name: 'Chine', lat: 35.8617, lng: 104.1954, visits: 22528, color: '#d32f2f' },
    { id: 'US', name: 'États-Unis', lat: 37.0902, lng: -95.7129, visits: 5876, color: '#0d47a1' },
    { id: 'FR', name: 'France', lat: 46.2276, lng: 2.2137, visits: 5419, color: '#1976d2' },
    { id: 'JP', name: 'Japon', lat: 36.2048, lng: 138.2529, visits: 3504, color: '#d32f2f' },
    { id: 'GB', name: 'Royaume-Uni', lat: 55.3781, lng: -3.4360, visits: 2707, color: '#9c27b0' },
    { id: 'CA', name: 'Canada', lat: 56.1304, lng: -106.3468, visits: 2359, color: '#d32f2f' },
    { id: 'ES', name: 'Espagne', lat: 40.4637, lng: -3.7492, visits: 1762, color: '#ffc107' },
    { id: 'HK', name: 'Hong Kong', lat: 22.3193, lng: 114.1694, visits: 1328, color: '#d32f2f' },
    { id: 'SG', name: 'Singapour', lat: 1.3521, lng: 103.8198, visits: 1315, color: '#d32f2f' },
    { id: 'IT', name: 'Italie', lat: 41.8719, lng: 12.5674, visits: 1197, color: '#4caf50' },
    { id: 'TH', name: 'Thaïlande', lat: 15.8700, lng: 100.9925, visits: 1162, color: '#9575cd' },
    { id: 'DE', name: 'Allemagne', lat: 51.1657, lng: 10.4515, visits: 1159, color: '#ff9800' },
    { id: 'IN', name: 'Inde', lat: 20.5937, lng: 78.9629, visits: 1143, color: '#ff5722' },
    { id: 'KR', name: 'Corée du Sud', lat: 35.9078, lng: 127.7669, visits: 1016, color: '#2196f3' },
    { id: 'MX', name: 'Mexique', lat: 23.6345, lng: -102.5528, visits: 983, color: '#4caf50' },
    { id: 'AU', name: 'Australie', lat: -25.2744, lng: 133.7751, visits: 960, color: '#8bc34a' },
    { id: 'MY', name: 'Malaisie', lat: 4.2105, lng: 101.9758, visits: 829, color: '#795548' },
    { id: 'TW', name: 'Taiwan', lat: 23.6978, lng: 120.9605, visits: 787, color: '#d32f2f' },
    { id: 'CH', name: 'Suisse', lat: 46.8182, lng: 8.2275, visits: 606, color: '#f44336' },
    { id: 'BE', name: 'Belgique', lat: 50.5039, lng: 4.4699, visits: 558, color: '#ffeb3b' },
  ];
  
  // Calcul de la taille des cercles en fonction du nombre de visites
  const getCircleRadius = (visits) => {
    return Math.log(visits) * 1.5;
  };
  
  // Style pour les cercles
  const getCircleStyle = (color) => {
    return { fillColor: color, color: 'white', weight: 1, fillOpacity: 0.8 };
  };
  
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={defaultZoom} 
      style={{ height: '400px', width: '100%', borderRadius: '4px' }}
      attributionControl={false}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ResetViewControl center={defaultCenter} zoom={defaultZoom} />
      {countryPositions.map((country) => (
        <CircleMarker
          key={country.id}
          center={[country.lat, country.lng]}
          radius={getCircleRadius(country.visits)}
          pathOptions={getCircleStyle(country.color)}
        >
          <Tooltip permanent={country.visits > 5000}>
            <span style={{ fontWeight: 'bold' }}>{country.name}</span>
            <br />
            {country.visits.toLocaleString()} visites
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const [totalCO2, setTotalCO2] = useState(3388);
  
  // Données pour le graphique en donut
  const [donutData, setDonutData] = useState({
    labels: ['Infrastructure', 'Fournisseur', 'Consommateur', 'Consommateur Mobile'],
    datasets: [{
      data: [132, 306, 2395, 554],
      backgroundColor: [
        '#1976d2',  // bleu pour Infrastructure
        '#9c27b0',  // violet pour Fournisseur
        '#2e7d32',  // vert pour Consommateur
        '#0288d1',  // bleu clair pour Consommateur Mobile
      ],
      borderColor: ['white', 'white', 'white', 'white'],
      borderWidth: 2,
    }]
  });
  
  // Données pour le top 10 des pays
  const countryData = [
    { name: 'Chine', visits: 22528 },
    { name: 'États-Unis', visits: 5876 },
    { name: 'France', visits: 5419 },
    { name: 'Japon', visits: 3504 },
    { name: 'Royaume-Uni', visits: 2707 },
    { name: 'Canada', visits: 2359 },
    { name: 'Espagne', visits: 1762 },
    { name: 'Hong Kong', visits: 1328 },
    { name: 'Singapour', visits: 1315 },
    { name: 'Italie', visits: 1197 },
    { name: 'Thaïlande', visits: 1162 },
    { name: 'Allemagne', visits: 1159 },
    { name: 'Inde', visits: 1143 },
    { name: 'Corée du Sud', visits: 1016 },
    { name: 'Mexique', visits: 983 },
    { name: 'Australie', visits: 960 },
    { name: 'Malaisie', visits: 829 },
    { name: 'Taiwan', visits: 787 },
    { name: 'Suisse', visits: 606 },
    { name: 'Belgique', visits: 558 },
  ];
  
  const [topCountries] = useState(countryData);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, mb: 1 }}>
          Dashboard d'impact environnemental
        </Typography>
        
        {/* Section 1: Consommation CO2 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Consommation CO2 de la plateforme en 2025
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative',
                height: '240px',
                maxWidth: '350px',
                margin: '0 auto'
              }}>
                <Doughnut 
                  data={donutData} 
                  options={{
                    cutout: '75%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / totalCO2) * 100).toFixed(1);
                            return `${label}: ${value} kgCO2e (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  width: '100%',
                  pointerEvents: 'none'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total (kgCO2e)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totalCO2.toLocaleString()}
                  </Typography>
                </Box>
                
                {/* Légende sous le graphique */}
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 2,
                  width: '100%'
                }}>
                  {donutData.labels.map((label, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: donutData.datasets[0].backgroundColor[index] 
                        }} 
                      />
                      <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                        {label} ({((donutData.datasets[0].data[index] / totalCO2) * 100).toFixed(1)}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <TableContainer sx={{ backgroundColor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Applications et Infrastructure</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Émissions (kgCO2e)</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Infrastructure</TableCell>
                      <TableCell align="right">132</TableCell>
                      <TableCell align="right">3.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fournisseur</TableCell>
                      <TableCell align="right">306</TableCell>
                      <TableCell align="right">9.04%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consommateur</TableCell>
                      <TableCell align="right">2,395</TableCell>
                      <TableCell align="right">70.69%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consommateur Mobile</TableCell>
                      <TableCell align="right">554</TableCell>
                      <TableCell align="right">16.37%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
        
        {/* Section 2: Équivalences */}
        <Box sx={{ mb: 6, mt: 12, pt: 5 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            {totalCO2.toLocaleString()} kgCO2e, cela représente
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                py: 2
              }}>
                <DirectionsCarIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  13 200km
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  en voiture
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: '#ffebee',
                borderRadius: 1,
                py: 2
              }}>
                <RestaurantIcon sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                  455
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  repas avec du bœuf
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: '#e8f5e9',
                borderRadius: 1,
                py: 2
              }}>
                <SmartphoneIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  201
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  smartphones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: '#e3f2fd',
                borderRadius: 1,
                py: 2
              }}>
                <ShoppingBagIcon sx={{ fontSize: 40, color: '#0288d1', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0288d1' }}>
                  142
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  jeans
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Section 3: Carte du monde */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Consommation CO2 par pays en 2025
          </Typography>
          
          <Box sx={{ position: 'relative', width: '100%', mb: 4 }}>
            <WorldMap />
          </Box>
          
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Top 20 des pays par nombre de visites
            </Typography>
            <TableContainer>
              <Table size="small" aria-label="tableau des pays">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rang</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pays</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Visites</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCountries.map((country, index) => (
                    <TableRow 
                      key={country.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
                        fontWeight: index < 3 ? 'bold' : 'normal'
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {country.name}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {country.visits.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box 
                          sx={{ 
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: Math.log(country.visits) * 3,
                              height: 10,
                              backgroundColor: country.color,
                              borderRadius: 1
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
