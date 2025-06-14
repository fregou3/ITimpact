# Règles de Calcul Impact Environnemental - Plateforme Numérique

## 1. INFRASTRUCTURE CLOUD (AWS)

### Règle de Base
**Émissions = Type Instance × Durée × Nombre Machines × Facteur Régional**

### Paramètres par Type d'Instance
- **t2.micro** : 0.897 kgCO2e pour 744h (1 mois)
- **t2.medium** : 1.8 kgCO2e pour 744h
- **t3.xlarge** : 2.7 kgCO2e pour 744h  
- **t3.2xlarge** : 0.55 kgCO2e pour 744h (par machine, avec 10 machines)

### Calcul Mensuel Infrastructure
```
Total Infrastructure = Σ(Instance_i × Durée_i × Nb_Machines_i)
Exemple : 1.8 + 0.897 + 2.7 + (0.55 × 10) = 11.0 kgCO2e/mois
```

### Facteur d'Extrapolation Annuelle
```
Émissions Annuelles Infrastructure = Émissions Mensuelles × 12
```

---

## 2. RÉSEAU ET DISTRIBUTION (CDN)

### Règle de Distance
**Émissions Réseau = Distance × Connexions × Facteur CO2 Transport**

### Calcul Sans CDN
```
Distance_totale = Σ(Connexions_région × Distance_moyenne_région)
CO2_sans_CDN = Distance_totale × Facteur_CO2_réseau

Exemple basé sur les données :
- Europe : 14,453 × 1,000 km = 14,453,000 km
- North America : 9,113 × 7,516 km = 68,493,308 km
- Asie : 6,133 × 7,770 km = 47,653,410 km
Total : 144,944,318 km → 6,642 kgCO2e
```

### Calcul Avec CDN
```
Distance_CDN = Σ(Connexions_région × 400 km)
CO2_avec_CDN = Distance_CDN × Facteur_CO2_réseau

Total CDN : 12,547,600 km → 575 kgCO2e
```

### Facteur CO2 Réseau
```
Facteur_CO2 = 6,642 kgCO2e / 144,944,318 km = 0.0000458 kgCO2e/km
```

---

## 3. USAGE UTILISATEURS (POSTES CLIENTS)

### Règle par Type d'Appareil
**Émissions = Puissance Appareil × Temps Usage × Facteur CO2 Électricité**

### Consommation Annuelle par Appareil
- **Desktop** : 175 kgCO2e/an
- **Laptop** : 60 kgCO2e/an  
- **Smartphone** : 30 kgCO2e/an

### Calcul Basé sur le Temps d'Usage
```
Émissions_utilisateur = (Temps_session_secondes / Temps_annuel_secondes) × Émissions_annuelles_appareil

Temps_annuel = 365 × 24 × 3600 = 31,536,000 secondes

Exemple Desktop :
- Temps total sessions : 2,348,210 secondes
- Émissions = (2,348,210 / 31,536,000) × 175 = 13.02 kgCO2e
```

### Répartition par Appareil (basée sur analytics)
```
Desktop/Laptop : 2,348,210 secondes → 13.02 kgCO2e
Smartphone : 2,128,983 secondes → 2.03 kgCO2e (facteur 30/175)
```

---

## 4. CALCUL GLOBAL PLATEFORME

### Formule Générale
```
Impact_Total = Infrastructure + Réseau + Usage_Utilisateurs

Impact_Total = (AWS_mensuel × 12) + CO2_réseau + Σ(Usage_par_appareil)
```

### Exemple Complet T.R.U.S.T.
```
Infrastructure : 11.0 × 12 = 132 kgCO2e/an
Réseau sans CDN : 6,642 kgCO2e/an
Réseau avec CDN : 575 kgCO2e/an  
Usage clients : ~15 kgCO2e/an

Total sans CDN : 132 + 6,642 + 15 = 6,789 kgCO2e/an
Total avec CDN : 132 + 575 + 15 = 722 kgCO2e/an
Gain CDN : 6,067 kgCO2e/an (89% de réduction)
```

---

## 5. RÈGLES D'OPTIMISATION

### Facteur CDN
```
Réduction_CDN = (Distance_sans_CDN - Distance_avec_CDN) / Distance_sans_CDN
Gain_CO2 = CO2_sans_CDN × Réduction_CDN
```

### Optimisation par Région
```
Priorité_optimisation = Connexions × Distance_moyenne
```

Régions prioritaires (impact décroissant) :
1. North America : 68,493,308 km×connexions
2. Asie : 47,653,410 km×connexions  
3. Europe : 14,453,000 km×connexions

---

## 6. MÉTRIQUES DE SUIVI

### KPI Principaux
- **kgCO2e par utilisateur actif mensuel**
- **kgCO2e par Go de données transférées**
- **kgCO2e par heure d'usage plateforme**
- **% de réduction grâce aux optimisations**

### Calculs de Normalisation
```
CO2_par_utilisateur = Impact_total / Nb_utilisateurs_uniques
CO2_par_session = Impact_total / Nb_sessions_totales
CO2_par_action = Impact_total / Nb_actions_totales
```

### Facteurs de Conversion (Équivalences)
Pour 1 tonne CO2e :
- 5,000 km en voiture
- 138 repas avec bœuf
- 61 smartphones  
- 2,200 litres d'eau
- 43 jeans

---

## 7. FORMULES DE PROJECTION

### Croissance Plateforme
```
Impact_futur = Impact_actuel × (1 + Taux_croissance_utilisateurs) × (1 + Taux_croissance_usage)
```

### Optimisations Prévisionnelles
```
Gain_optimisation = Impact_baseline × Efficacité_optimisation
Impact_optimisé = Impact_baseline - Gain_optimisation
```

### Seuils d'Alerte
- **Augmentation >20%** → Audit infrastructure
- **CO2/utilisateur >X** → Optimisation urgente
- **Efficacité CDN <80%** → Révision architecture réseau