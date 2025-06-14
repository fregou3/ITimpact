// Calculateur d'Impact Environnemental pour Plateforme Numérique
// Basé sur la méthodologie AWS CO2 (methodologie_aws_co2.md)
// Version 2.0 - Juin 2025

class CalculateurCO2 {
    constructor() {
        // Facteurs de conversion et constantes basés sur la méthodologie AWS CO2
        this.FACTEURS = {
            // Consommation électrique par type d'instance (Watts)
            WATTS_INSTANCES: {
                't2.micro': {min: 1.0, max: 3.5},
                't2.small': {min: 1.5, max: 5.0},
                't2.medium': {min: 2.0, max: 8.5},
                't3.micro': {min: 1.2, max: 4.0},
                't3.small': {min: 1.7, max: 5.5},
                't3.medium': {min: 2.2, max: 9.0},
                't3.large': {min: 3.5, max: 12.0},
                't3.xlarge': {min: 5.0, max: 18.0},
                't3.2xlarge': {min: 8.0, max: 25.0},
                'm5.large': {min: 5.0, max: 15.0},
                'm5.xlarge': {min: 8.0, max: 22.0},
                'm5.2xlarge': {min: 12.0, max: 35.0},
                'm5.4xlarge': {min: 20.0, max: 60.0},
                'c5.large': {min: 4.5, max: 14.0},
                'c5.xlarge': {min: 7.5, max: 21.0},
                'c5.2xlarge': {min: 11.0, max: 32.0},
                'r5.large': {min: 6.0, max: 16.0},
                'r5.xlarge': {min: 9.0, max: 24.0},
                'r5.2xlarge': {min: 14.0, max: 38.0}
            },
            
            // Facteurs d'émission par région AWS (kgCO2e/kWh)
            FACTEURS_REGIONS: {
                'eu-west-1': 0.180,  // Irlande
                'eu-west-2': 0.225,  // Londres
                'eu-west-3': 0.056,  // Paris
                'eu-central-1': 0.338, // Francfort
                'eu-north-1': 0.008,  // Stockholm
                'eu-south-1': 0.214,  // Milan
                'us-east-1': 0.415,  // Virginie
                'us-east-2': 0.442,  // Ohio
                'us-west-1': 0.190,  // Californie
                'us-west-2': 0.151,  // Oregon
                'ap-southeast-1': 0.431,  // Singapour
                'ap-southeast-2': 0.790,  // Sydney
                'ap-northeast-1': 0.506,  // Tokyo
                'ap-northeast-2': 0.500,  // Séoul
                'ap-south-1': 0.708,  // Mumbai
                'sa-east-1': 0.074,  // São Paulo
                'ca-central-1': 0.130,  // Canada
                'af-south-1': 0.890,  // Cape Town
                'me-south-1': 0.732   // Bahrain
            },
            
            // PUE moyen des datacenters AWS
            PUE: 1.2,
            
            // Émissions incorporées (manufacturing) par serveur (kgCO2e sur 4 ans)
            EMISSIONS_INCORPOREES: 300,
            
            // Heures dans une année
            HEURES_ANNEE: 365 * 24,
            
            // Consommation annuelle par type d'appareil (kgCO2e/an)
            appareils: {
                'desktop': 175,
                'laptop': 60,
                'smartphone': 30,
                'tablet': 45
            },
            
            // Facteur CO2 réseau (kgCO2e/km) calculé depuis les données
            reseau: 0.0000458,
            
            // Distance CDN optimisée (km)
            distanceCDN: 400,
            
            // Secondes dans une année
            secondesAnnee: 365 * 24 * 3600,
            
            // Équivalences pour visualisation (par tonne CO2)
            equivalences: {
                kmVoiture: 5000,
                repasBoef: 138,
                smartphones: 61,
                litresEau: 2200,
                jeans: 43,
                arbresPlantes: 50,  // Nouveaux facteurs d'équivalence
                heuresNetflix: 8300,
                chargesSmartphone: 121000
            }
        };
    }

    // 1. CALCUL INFRASTRUCTURE AWS - Méthode améliorée selon la méthodologie AWS CO2
    calculerInfrastructure(instances) {
        let totalMensuel = 0;
        let detailsInstances = [];
        
        instances.forEach(instance => {
            // Vérifier si le type d'instance est supporté
            if (!this.FACTEURS.WATTS_INSTANCES[instance.type]) {
                console.warn(`Type d'instance non supporté: ${instance.type}. Utilisation d'une estimation par défaut.`);
                // Utiliser une estimation par défaut si le type n'est pas dans notre base
                const emissionEstimee = 2.0 * (instance.nbMachines || 1);
                totalMensuel += emissionEstimee;
                detailsInstances.push({
                    type: instance.type,
                    region: instance.region,
                    nbMachines: instance.nbMachines || 1,
                    emission: emissionEstimee,
                    methode: 'estimation'
                });
                return;
            }
            
            // Récupérer les données de consommation électrique
            const wattsMin = this.FACTEURS.WATTS_INSTANCES[instance.type].min;
            const wattsMax = this.FACTEURS.WATTS_INSTANCES[instance.type].max;
            
            // Utiliser l'utilisation CPU si disponible, sinon 50%
            const cpuUtilization = instance.cpuUtilization || 50;
            
            // Calcul de la consommation énergétique
            const wattsAvg = wattsMin + (wattsMax - wattsMin) * (cpuUtilization / 100);
            
            // Heures d'utilisation par mois (par défaut 744h = 31 jours)
            const heuresUtilisation = instance.heures || 744;
            
            // Consommation en kWh
            const kwh = (wattsAvg * heuresUtilisation) / 1000;
            
            // Appliquer le PUE
            const kwhTotal = kwh * this.FACTEURS.PUE;
            
            // Facteur d'émission de la région
            const facteurRegion = this.FACTEURS.FACTEURS_REGIONS[instance.region] || 0.400; // Valeur moyenne par défaut
            
            // Émissions opérationnelles
            const co2Operationnel = kwhTotal * facteurRegion;
            
            // Émissions incorporées (manufacturing)
            const co2Incorpore = (this.FACTEURS.EMISSIONS_INCORPOREES * heuresUtilisation) / 
                                (4 * this.FACTEURS.HEURES_ANNEE);
            
            // Émissions totales pour cette instance
            const emissionTotale = (co2Operationnel + co2Incorpore) * (instance.nbMachines || 1);
            totalMensuel += emissionTotale;
            
            // Stocker les détails pour analyse
            detailsInstances.push({
                type: instance.type,
                region: instance.region,
                nbMachines: instance.nbMachines || 1,
                heures: heuresUtilisation,
                cpuUtilization: cpuUtilization,
                wattsAvg: wattsAvg,
                kwh: kwh,
                kwhTotal: kwhTotal,
                co2Operationnel: co2Operationnel,
                co2Incorpore: co2Incorpore,
                emission: emissionTotale,
                methode: 'calcul_detaille'
            });
            
            console.log(`${instance.type} (${instance.region}): ${emissionTotale.toFixed(3)} kgCO2e/mois`);
        });
        
        const totalAnnuel = totalMensuel * 12;
        
        return {
            mensuel: totalMensuel,
            annuel: totalAnnuel,
            details: detailsInstances
        };
    }

    // 2. CALCUL RÉSEAU AVEC/SANS CDN
    calculerReseau(connexionsParRegion) {
        let totalKmSansCDN = 0;
        let totalKmAvecCDN = 0;
        
        connexionsParRegion.forEach(region => {
            const kmSansCDN = region.connexions * region.distanceMoyenne;
            const kmAvecCDN = region.connexions * this.FACTEURS.distanceCDN;
            
            totalKmSansCDN += kmSansCDN;
            totalKmAvecCDN += kmAvecCDN;
            
            console.log(`${region.nom}: ${kmSansCDN.toLocaleString()} km sans CDN, ${kmAvecCDN.toLocaleString()} km avec CDN`);
        });
        
        const co2SansCDN = totalKmSansCDN * this.FACTEURS.reseau;
        const co2AvecCDN = totalKmAvecCDN * this.FACTEURS.reseau;
        const gainCDN = co2SansCDN - co2AvecCDN;
        const efficaciteCDN = (gainCDN / co2SansCDN) * 100;
        
        return {
            sansCDN: {
                kilometres: totalKmSansCDN,
                co2: co2SansCDN
            },
            avecCDN: {
                kilometres: totalKmAvecCDN,
                co2: co2AvecCDN
            },
            gain: gainCDN,
            efficacite: efficaciteCDN
        };
    }

    // 3. CALCUL USAGE UTILISATEURS
    calculerUsageUtilisateurs(sessionsParAppareil) {
        let totalCO2 = 0;
        const details = {};
        
        Object.keys(sessionsParAppareil).forEach(appareil => {
            const tempsTotal = sessionsParAppareil[appareil].tempsTotal; // en secondes
            const facteurAppareil = this.FACTEURS.appareils[appareil] || 0;
            
            // Calcul basé sur la proportion du temps annuel
            const proportionAnnuelle = tempsTotal / this.FACTEURS.secondesAnnee;
            const co2Appareil = proportionAnnuelle * facteurAppareil;
            
            details[appareil] = {
                tempsTotal: tempsTotal,
                proportionAnnuelle: proportionAnnuelle,
                co2: co2Appareil
            };
            
            totalCO2 += co2Appareil;
            
            console.log(`${appareil}: ${tempsTotal.toLocaleString()}s → ${co2Appareil.toFixed(2)} kgCO2e`);
        });
        
        return {
            total: totalCO2,
            details: details
        };
    }

    // 4. CALCUL IMPACT TOTAL PLATEFORME
    calculerImpactTotal(infrastructure, reseau, usageUtilisateurs) {
        const impactSansCDN = infrastructure.annuel + reseau.sansCDN.co2 + usageUtilisateurs.total;
        const impactAvecCDN = infrastructure.annuel + reseau.avecCDN.co2 + usageUtilisateurs.total;
        const gainOptimisation = impactSansCDN - impactAvecCDN;
        const reductionPourcentage = (gainOptimisation / impactSansCDN) * 100;
        
        return {
            sansCDN: impactSansCDN,
            avecCDN: impactAvecCDN,
            gain: gainOptimisation,
            reduction: reductionPourcentage,
            repartition: {
                infrastructure: infrastructure.annuel,
                reseauSansCDN: reseau.sansCDN.co2,
                reseauAvecCDN: reseau.avecCDN.co2,
                utilisateurs: usageUtilisateurs.total
            }
        };
    }

    // 5. MÉTRIQUES DE PERFORMANCE
    calculerMetriques(impactTotal, analytics) {
        const utilisateursUniques = analytics.utilisateursUniques || 1;
        const sessionsTotal = analytics.sessionsTotal || 1;
        const actionsTotal = analytics.actionsTotal || 1;
        
        return {
            co2ParUtilisateur: impactTotal.avecCDN / utilisateursUniques,
            co2ParSession: impactTotal.avecCDN / sessionsTotal,
            co2ParAction: impactTotal.avecCDN / actionsTotal,
            efficaciteOptimisation: impactTotal.reduction
        };
    }

    // 6. ÉQUIVALENCES VISUELLES
    calculerEquivalences(co2Tonnes) {
        const equivalences = {};
        
        Object.keys(this.FACTEURS.equivalences).forEach(type => {
            equivalences[type] = co2Tonnes * this.FACTEURS.equivalences[type];
        });
        
        return equivalences;
    }

    // 7. PROJECTION FUTURE
    projeterCroissance(impactActuel, tauxCroissanceUtilisateurs, tauxCroissanceUsage, annees = 1) {
        const facteurCroissance = Math.pow((1 + tauxCroissanceUtilisateurs) * (1 + tauxCroissanceUsage), annees);
        
        return {
            impactFutur: impactActuel * facteurCroissance,
            augmentation: (impactActuel * facteurCroissance) - impactActuel,
            facteurCroissance: facteurCroissance
        };
    }

    // 8. ANALYSE COMPLÈTE
    analyserPlateforme(donneesEntree) {
        console.log("=== ANALYSE IMPACT ENVIRONNEMENTAL PLATEFORME ===\n");
        
        // Calculs individuels
        const infrastructure = this.calculerInfrastructure(donneesEntree.instances);
        console.log(`Infrastructure: ${infrastructure.annuel.toFixed(2)} kgCO2e/an\n`);
        
        const reseau = this.calculerReseau(donneesEntree.regions);
        console.log(`Réseau sans CDN: ${reseau.sansCDN.co2.toFixed(2)} kgCO2e/an`);
        console.log(`Réseau avec CDN: ${reseau.avecCDN.co2.toFixed(2)} kgCO2e/an`);
        console.log(`Gain CDN: ${reseau.gain.toFixed(2)} kgCO2e/an (${reseau.efficacite.toFixed(1)}%)\n`);
        
        const usage = this.calculerUsageUtilisateurs(donneesEntree.sessions);
        console.log(`Usage utilisateurs: ${usage.total.toFixed(2)} kgCO2e/an\n`);
        
        // Impact total
        const impactTotal = this.calculerImpactTotal(infrastructure, reseau, usage);
        console.log(`IMPACT TOTAL:`);
        console.log(`Sans optimisation: ${impactTotal.sansCDN.toFixed(2)} kgCO2e/an`);
        console.log(`Avec optimisation: ${impactTotal.avecCDN.toFixed(2)} kgCO2e/an`);
        console.log(`Réduction: ${impactTotal.gain.toFixed(2)} kgCO2e/an (${impactTotal.reduction.toFixed(1)}%)\n`);
        
        // Métriques
        const metriques = this.calculerMetriques(impactTotal, donneesEntree.analytics);
        console.log(`MÉTRIQUES:`);
        console.log(`CO2 par utilisateur: ${metriques.co2ParUtilisateur.toFixed(3)} kgCO2e`);
        console.log(`CO2 par session: ${metriques.co2ParSession.toFixed(3)} kgCO2e`);
        console.log(`CO2 par action: ${metriques.co2ParAction.toFixed(6)} kgCO2e\n`);
        
        // Équivalences
        const co2Tonnes = impactTotal.gain / 1000;
        const equivalences = this.calculerEquivalences(co2Tonnes);
        console.log(`ÉQUIVALENCES DU GAIN (${co2Tonnes.toFixed(3)} tonnes CO2):`);
        Object.keys(equivalences).forEach(type => {
            console.log(`${type}: ${equivalences[type].toFixed(0)}`);
        });
        
        return {
            infrastructure,
            reseau,
            usage,
            impactTotal,
            metriques,
            equivalences
        };
    }
}

// EXEMPLE D'UTILISATION
const calculateur = new CalculateurCO2();

// Données d'exemple basées sur la méthodologie AWS CO2
const donneesExemple = {
    instances: [
        { type: 't2.medium', nbMachines: 1, region: 'eu-west-3', cpuUtilization: 45, heures: 744 },
        { type: 't2.micro', nbMachines: 1, region: 'eu-west-3', cpuUtilization: 30, heures: 744 },
        { type: 't3.2xlarge', nbMachines: 10, region: 'us-east-1', cpuUtilization: 65, heures: 744 },
        { type: 't3.xlarge', nbMachines: 1, region: 'ap-southeast-1', cpuUtilization: 70, heures: 744 },
        { type: 'm5.large', nbMachines: 2, region: 'eu-central-1', cpuUtilization: 55, heures: 744 }
    ],
    regions: [
        { nom: 'Europe', connexions: 14453, distanceMoyenne: 1000 },
        { nom: 'North America', connexions: 9113, distanceMoyenne: 7516 },
        { nom: 'Asia', connexions: 6133, distanceMoyenne: 7770 },
        { nom: 'Oceania', connexions: 936, distanceMoyenne: 9700 },
        { nom: 'Africa', connexions: 378, distanceMoyenne: 4900 },
        { nom: 'South America', connexions: 256, distanceMoyenne: 9900 },
        { nom: 'Central America', connexions: 100, distanceMoyenne: 8788 }
    ],
    sessions: {
        desktop: { tempsTotal: 2348210 }, // secondes
        smartphone: { tempsTotal: 2128983 },
        tablet: { tempsTotal: 1056420 },
        laptop: { tempsTotal: 1845630 }
    },
    analytics: {
        utilisateursUniques: 35000,
        sessionsTotal: 50000,
        actionsTotal: 400000,
        dataTransfereGo: 15000,
        dataStockeeGo: 8500
    }
};

// Exécuter l'analyse complète
const resultats = calculateur.analyserPlateforme(donneesExemple);

// Exporter les résultats (pour intégration avec frontend)
module.exports = {
    CalculateurCO2,
    resultatsExemple: resultats
};