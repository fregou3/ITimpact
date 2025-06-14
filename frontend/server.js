const express = require('express');
const path = require('path');
const app = express();

// Définir le port à partir de la variable d'environnement PORT ou utiliser 3000 par défaut
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier build
app.use(express.static(path.join(__dirname, 'build')));

// Pour toutes les requêtes, renvoyer index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
