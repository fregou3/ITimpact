# Calculateur d'Impact Environnemental AWS

Cette application permet de calculer l'empreinte carbone d'une infrastructure cloud AWS. Elle prend en compte les instances EC2 (type et localisation) ainsi que le nombre de connexions par pays.

## Structure du projet

```
ImpactEnvironnemental_1.0/
├── AWS_CDN_CO2.xlsx          # Données sur les régions AWS et les pays
├── Clarins_Infra_CO2.xlsx    # Données sur les types d'instances EC2
├── backend/                  # Backend Node.js/Express
├── frontend/                 # Frontend React
├── docker-compose.yml        # Configuration PostgreSQL
└── render.yaml                # Configuration Render
```

## Configuration requise

- Node.js (v14+)
- Docker Desktop
- PostgreSQL (via Docker)

## Déploiement sur Render

Cette application est configurée pour être déployée sur Render à l'aide du fichier `render.yaml`.

### Étapes de déploiement

1. Créez un compte sur [Render](https://render.com/) si vous n'en avez pas déjà un
2. Dans le tableau de bord Render, cliquez sur "New" puis "Blueprint"
3. Connectez votre dépôt GitHub et sélectionnez ce projet
4. Render détectera automatiquement le fichier `render.yaml` et configurera les services
5. Cliquez sur "Apply" pour démarrer le déploiement

### Configuration manuelle

Si vous préférez configurer manuellement les services :

#### Frontend

1. Créez un nouveau service Web
2. Sélectionnez le dépôt GitHub et le répertoire `frontend`
3. Définissez le build command : `npm install && npm run build`
4. Définissez le start command : `npm run serve`
5. Ajoutez la variable d'environnement `PORT=10000`

#### Backend

1. Créez un nouveau service Web
2. Sélectionnez le dépôt GitHub et le répertoire `backend`
3. Définissez le build command : `npm install`
4. Définissez le start command : `npm start`
5. Ajoutez la variable d'environnement `PORT=5043`

## Installation et démarrage

### 1. Base de données PostgreSQL

Lancez la base de données PostgreSQL avec Docker :

```
docker-compose up -d
```

### 2. Backend

Installez les dépendances et lancez le serveur backend :

```
cd backend
npm install
npm run import-data   # Importe les données des fichiers Excel dans la base de données
npm run dev           # Démarre le serveur de développement
```

Le serveur backend sera accessible sur http://localhost:5043

### 3. Frontend

Installez les dépendances et lancez l'application frontend :

```
cd frontend
npm install
npm start
```

L'application frontend sera accessible sur http://localhost:3043

## Fonctionnalités

- Calcul de l'empreinte CO2 des instances EC2 en fonction de leur type et de leur région
- Calcul de l'empreinte CO2 du trafic réseau en fonction des pays de connexion
- Visualisation des résultats avec des graphiques
- Recommandations pour réduire l'empreinte carbone

## Fichiers de données

- **AWS_CDN_CO2.xlsx** : Contient les données sur les régions AWS et leurs facteurs d'émission CO2, ainsi que les données sur les pays et leur empreinte carbone par GB de données transférées.
- **Clarins_Infra_CO2.xlsx** : Contient les données sur les types d'instances EC2 et leur consommation énergétique.

## Développement

- Backend : Node.js avec Express et PostgreSQL
- Frontend : React avec Chart.js pour les visualisations