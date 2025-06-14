import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import NatureIcon from '@mui/icons-material/Nature';
import RecyclingIcon from '@mui/icons-material/Recycling';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const AwsImplicationPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Implication AWS dans la Responsabilité Environnementale
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#0d6efd', fontWeight: 'medium' }}>
          Résumé Exécutif
        </Typography>
        <Typography paragraph>
          Amazon Web Services (AWS) s'engage à atteindre la neutralité carbone d'ici 2040, soit 10 ans avant l'objectif de l'Accord de Paris. 
          Notre rapport détaille les initiatives, les progrès et les engagements d'AWS en matière de développement durable et de responsabilité environnementale.
        </Typography>
        <Typography paragraph>
          En 2025, AWS a déjà atteint 85% d'énergie renouvelable pour l'ensemble de ses opérations mondiales et continue d'investir massivement dans des projets d'énergie solaire et éolienne.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CloudDoneIcon sx={{ fontSize: 40, color: '#0d6efd', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Efficacité Énergétique des Datacenters
              </Typography>
            </Box>
            <Typography paragraph>
              Les datacenters AWS sont 3,6 fois plus efficaces énergétiquement que les datacenters d'entreprise moyens. Cette efficacité provient d'une conception avancée, d'équipements à haut rendement et d'une gestion optimisée des ressources.
            </Typography>
            <Typography paragraph>
              AWS utilise des systèmes de refroidissement innovants qui réduisent la consommation d'eau de 60% par rapport aux systèmes traditionnels, tout en maintenant des performances optimales même dans les conditions climatiques les plus exigeantes.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0d6efd' }}>
                Chiffres clés:
              </Typography>
              <ul>
                <li>Réduction de 42% de l'empreinte carbone par serveur depuis 2019</li>
                <li>PUE (Power Usage Effectiveness) moyen de 1,15 contre 1,59 pour l'industrie</li>
                <li>Économie de 1,7 million de MWh en 2024 grâce aux optimisations</li>
              </ul>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NatureIcon sx={{ fontSize: 40, color: '#198754', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Énergies Renouvelables
              </Typography>
            </Box>
            <Typography paragraph>
              AWS est le plus grand acheteur corporate d'énergie renouvelable au monde, avec plus de 310 projets d'énergie renouvelable actifs dans 19 pays. Ces projets génèrent plus de 15,7 GW de capacité renouvelable.
            </Typography>
            <Typography paragraph>
              En 2024, AWS a lancé 37 nouveaux projets d'énergie renouvelable, dont des fermes solaires en France, en Espagne et en Allemagne, contribuant significativement à la transition énergétique européenne.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#198754' }}>
                Répartition des sources d'énergie:
              </Typography>
              <ul>
                <li>Énergie solaire: 62% des projets</li>
                <li>Énergie éolienne: 35% des projets</li>
                <li>Autres sources renouvelables: 3% des projets</li>
              </ul>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RecyclingIcon sx={{ fontSize: 40, color: '#6f42c1', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Économie Circulaire et Gestion des Déchets
              </Typography>
            </Box>
            <Typography paragraph>
              AWS a mis en place un programme complet de gestion des déchets électroniques, avec un taux de recyclage de 96% pour les équipements de datacenter en fin de vie. Les 4% restants sont traités dans des installations de valorisation énergétique à zéro enfouissement.
            </Typography>
            <Typography paragraph>
              Le programme de reconditionnement d'AWS a permis de réutiliser plus de 5,2 millions de composants serveur en 2024, prolongeant leur durée de vie et réduisant considérablement l'empreinte environnementale liée à la fabrication de nouveaux équipements.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#6f42c1' }}>
                Impact environnemental évité:
              </Typography>
              <ul>
                <li>Réduction de 78 000 tonnes de déchets électroniques</li>
                <li>Économie de 132 000 tonnes de CO2e grâce au reconditionnement</li>
                <li>Conservation de 1,8 million de m³ d'eau douce</li>
              </ul>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EnergySavingsLeafIcon sx={{ fontSize: 40, color: '#d63384', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Innovation et Recherche
              </Typography>
            </Box>
            <Typography paragraph>
              AWS investit plus de 2 milliards d'euros par an dans la recherche et le développement de technologies vertes. Le laboratoire de développement durable d'AWS a lancé 23 nouveaux projets en 2024, axés sur l'efficacité énergétique, les matériaux durables et les technologies de capture de carbone.
            </Typography>
            <Typography paragraph>
              Le programme AWS Climate Tech Accelerator soutient les startups innovantes qui développent des solutions technologiques pour lutter contre le changement climatique, avec plus de 50 millions d'euros de financement accordés en 2024.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#d63384' }}>
                Projets phares:
              </Typography>
              <ul>
                <li>Développement de serveurs refroidis par immersion réduisant la consommation d'énergie de 25%</li>
                <li>Systèmes d'IA pour l'optimisation dynamique de la consommation d'énergie</li>
                <li>Batteries de stockage à base de matériaux recyclés pour les datacenters</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#0d6efd', fontWeight: 'medium' }}>
          Objectifs et Engagements Futurs
        </Typography>
        <Typography paragraph>
          AWS s'engage à alimenter 100% de ses opérations avec des énergies renouvelables d'ici 2030, et à atteindre zéro émission nette de carbone d'ici 2040. Pour y parvenir, AWS investit dans des technologies de pointe et des pratiques durables à chaque étape de son activité.
        </Typography>
        <Typography paragraph>
          En parallèle, AWS continue de développer des outils et services permettant à ses clients de mesurer et réduire leur propre empreinte carbone, contribuant ainsi à un effet multiplicateur dans la lutte contre le changement climatique.
        </Typography>
        <Typography paragraph>
          L'engagement d'AWS envers la durabilité environnementale est un élément central de sa stratégie d'entreprise, reflétant sa responsabilité en tant que leader technologique mondial et son ambition de créer un impact positif durable sur la planète.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AwsImplicationPage;
