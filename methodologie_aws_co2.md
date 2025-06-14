# Méthodologie d'Évaluation CO2 Infrastructure AWS

## 🎯 **APPROCHES DISPONIBLES**

### 1. **AWS Customer Carbon Footprint Tool (CCFT)** - OFFICIEL
- **Accès** : Console AWS Billing > Customer Carbon Footprint Tool
- **Méthodologie** : Version 2.0 (depuis janvier 2025), vérifiée par un tiers
- **Granularité** : Par région AWS, par service (EC2, S3, autres)
- **Format** : MTCO2e (tonnes CO2 équivalent)
- **Délai** : Données disponibles avec 3 mois de retard
- **Limites** : Scope 1 et 2 uniquement, pas de temps réel

### 2. **Outils Open Source** 
- **Cloud Carbon Footprint** : Multi-cloud (AWS, GCP, Azure)
- **Teads Carbon Estimator** : Spécialisé instances EC2
- **Cloud-Carbon (Giant Swarm)** : Basé sur Cost & Usage Reports

---

## 📊 **INDICATEURS NÉCESSAIRES**

### **Données d'Infrastructure**
```
✓ Type d'instances EC2 (t2.micro, m5.large, etc.)
✓ Durée d'utilisation (heures/mois)
✓ Nombre d'instances par type
✓ Région AWS de déploiement
✓ Utilisation CPU moyenne (si disponible)
✓ Services utilisés (S3, Lambda, RDS, etc.)
✓ Trafic réseau (Go transférés)
```

### **Données de Contexte**
```
✓ Mix énergétique régional (fourni par AWS)
✓ PUE (Power Usage Effectiveness) du datacenter
✓ Facteurs d'émission électricité par région
✓ Émissions incorporées (manufacturing)
```

### **Métriques Business**
```
✓ Nombre d'utilisateurs actifs
✓ Transactions/requêtes traitées
✓ Volume de données stockées/transférées
✓ Sessions utilisateur
```

---

## 🔬 **MÉTHODOLOGIE DÉTAILLÉE**

### **ÉTAPE 1 : Collecte des Données**

#### A. Via AWS Cost & Usage Reports (CUR)
```sql
-- Configuration dans AWS Billing
1. Activer Cost & Usage Reports
2. Inclure Resource IDs
3. Format CSV/Parquet vers S3
4. Granularité horaire/quotidienne
```

#### B. Via AWS APIs
```python
# Exemple avec boto3
import boto3

ec2 = boto3.client('ec2')
cloudwatch = boto3.client('cloudwatch')

# Récupérer instances actives
instances = ec2.describe_instances()

# Récupérer métriques utilisation CPU
cpu_metrics = cloudwatch.get_metric_statistics(
    Namespace='AWS/EC2',
    MetricName='CPUUtilization',
    Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
    StartTime=start_time,
    EndTime=end_time,
    Period=3600,
    Statistics=['Average']
)
```

### **ÉTAPE 2 : Calcul des Émissions**

#### A. **Formule Générale**
```
Total CO2e = Émissions Opérationnelles + Émissions Incorporées

Émissions Opérationnelles = 
Usage Service × Facteur Énergie × PUE × Facteur Émission Réseau

Émissions Incorporées = 
Émissions Manufacturing Serveurs × Allocation Temps d'Usage
```

#### B. **Calcul par Instance EC2**
```python
def calculer_co2_instance(instance_type, heures_usage, region, cpu_utilization=50):
    # Facteurs par type d'instance (Watts)
    WATTS_INSTANCES = {
        't2.micro': {'min': 1.0, 'max': 3.5},
        't2.small': {'min': 1.5, 'max': 5.0},
        't2.medium': {'min': 2.0, 'max': 8.5},
        'm5.large': {'min': 5.0, 'max': 15.0},
        # ... autres types
    }
    
    # Facteurs régionaux (kgCO2e/kWh)
    FACTEURS_REGIONS = {
        'eu-west-1': 0.180,  # Irlande
        'eu-west-3': 0.056,  # Paris
        'us-east-1': 0.415,  # Virginie
        'ap-southeast-1': 0.431,  # Singapour
        # ... autres régions
    }
    
    # Calcul consommation énergétique
    watts_min = WATTS_INSTANCES[instance_type]['min']
    watts_max = WATTS_INSTANCES[instance_type]['max']
    watts_avg = watts_min + (watts_max - watts_min) * (cpu_utilization / 100)
    
    # Consommation en kWh
    kwh = (watts_avg * heures_usage) / 1000
    
    # PUE moyen AWS ≈ 1.2
    kwh_total = kwh * 1.2
    
    # Émissions opérationnelles
    co2_operationnel = kwh_total * FACTEURS_REGIONS[region]
    
    # Émissions incorporées (≈ 300 kgCO2e sur 4 ans)
    co2_incorpore = (300 * heures_usage) / (4 * 365 * 24)
    
    return co2_operationnel + co2_incorpore
```

### **ÉTAPE 3 : Agrégation et Analyse**

#### A. **Par Service AWS**
```python
def calculer_co2_total(usage_data):
    total_co2 = 0
    
    for service in usage_data:
        if service['type'] == 'EC2':
            co2 = calculer_co2_instance(
                service['instance_type'],
                service['heures'],
                service['region'],
                service.get('cpu_util', 50)
            )
        elif service['type'] == 'S3':
            co2 = calculer_co2_stockage(service['gb_stockes'], service['region'])
        elif service['type'] == 'Lambda':
            co2 = calculer_co2_lambda(service['gb_secondes'], service['region'])
        
        total_co2 += co2
    
    return total_co2
```

#### B. **Métriques de Performance**
```python
def calculer_metriques(co2_total, business_metrics):
    return {
        'co2_par_utilisateur': co2_total / business_metrics['utilisateurs'],
        'co2_par_transaction': co2_total / business_metrics['transactions'],
        'co2_par_gb_data': co2_total / business_metrics['gb_transferes'],
        'intensite_carbone': co2_total / business_metrics['chiffre_affaires']
    }
```

---

## 🛠️ **OUTILS ET IMPLÉMENTATION**

### **1. AWS CCFT (Recommandé pour Production)**
```bash
# Accès via AWS CLI
aws ce get-carbon-footprint \
    --time-period Start=2024-01-01,End=2024-12-31 \
    --group-by Type=DIMENSION,Key=SERVICE

# Export CSV pour analyse
aws ce get-carbon-footprint-data-export \
    --destination-s3-bucket my-carbon-data \
    --format CSV
```

### **2. Cloud Carbon Footprint (Open Source)**
```bash
# Installation
npm install -g @cloud-carbon-footprint/cli

# Configuration AWS
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=eu-west-1

# Exécution
ccf --startDate 2024-01-01 --endDate 2024-12-31
```

### **3. Solution Custom**
```python
class AWSCarbonCalculator:
    def __init__(self, aws_session):
        self.session = aws_session
        self.ec2 = aws_session.client('ec2')
        self.cloudwatch = aws_session.client('cloudwatch')
        self.cur = aws_session.client('cur')
    
    def get_usage_data(self, start_date, end_date):
        # Récupérer données d'usage depuis CUR
        pass
    
    def calculate_emissions(self, usage_data):
        # Appliquer formules de calcul
        pass
    
    def generate_report(self, emissions_data):
        # Générer rapport avec métriques
        pass
```

---

## 📈 **FACTEURS DE PRÉCISION**

### **Niveau de Précision Croissant**
1. **Basique** : Facteurs moyens par type d'instance
2. **Intermédiaire** : Utilisation CPU réelle + région
3. **Avancé** : Microarchitecture processeur + mix énergétique temps réel
4. **Expert** : PUE spécifique + émissions incorporées détaillées

### **Validation des Résultats**
```python
def valider_coherence(resultats):
    # Vérifications de cohérence
    if resultats['co2_par_euro'] > 10:  # Seuil d'alerte
        print("⚠️ Intensité carbone élevée détectée")
    
    if resultats['variation_mensuelle'] > 50:  # >50% variation
        print("⚠️ Variation importante à investiguer")
    
    # Benchmark industrie
    benchmark_saas = 0.2  # kgCO2e par utilisateur/mois
    if resultats['co2_par_utilisateur'] > benchmark_saas:
        print("📊 Au-dessus de la moyenne industrie")
```

---

## 🎯 **RECOMMANDATIONS D'OPTIMISATION**

### **Actions Immédiates**
1. **Rightsizing** : Ajuster tailles instances à l'usage réel
2. **Graviton** : Migrer vers processeurs ARM (20-40% plus efficaces)
3. **Régions vertes** : Prioriser eu-west-3 (Paris), eu-north-1 (Stockholm)
4. **Auto Scaling** : Éviter sur-provisioning

### **Actions Moyen Terme**
1. **Serverless** : Migrer vers Lambda/Fargate
2. **Storage Tiers** : Utiliser S3 Intelligent Tiering
3. **CDN** : Réduire distances réseau avec CloudFront
4. **Scheduling** : Éteindre ressources non-critiques

### **Métriques de Suivi**
```python
KPIs = {
    'co2_par_utilisateur_actif': 'kgCO2e/utilisateur/mois',
    'efficacite_energetique': 'kWh/transaction',
    'ratio_graviton': '% instances ARM',
    'facteur_utilisation': '% CPU moyen',
    'reduction_mensuelle': '% évolution CO2'
}
```

Cette méthodologie vous permet d'obtenir une mesure précise et actionnable de l'impact carbone de votre infrastructure AWS, avec des recommandations concrètes d'optimisation.