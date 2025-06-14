// Calculateur d'Impact Environnemental pour Plateforme Numérique
// Basé sur les données Clarins_Infra_CO2.xlsx et AWS_CDN_CO2.xlsx

class CalculateurCO2 {
    constructor() {
        // Facteurs de conversion et constantes
        this.FACTEURS = {
            // Émissions par type d'instance AWS (kgCO2e pour 744h)
            instances: {
                't2.micro': 0.897,
                't2.medium': 1.8,
                't3.xlarge': 2.7,
                't3.2xlarge': 0.55 // par machine
            },
            
            // Consommation annuelle par type d'appareil (kgCO2e/an)
            appareils: {
                'desktop': 175,
                'laptop': 60,
                'smartphone': 30
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
                jeans: 43
            }
        };
    }

    // 1. CALCUL INFRASTRUCTURE AWS
    calculerInfrastructure(instances) {
        let totalMensuel = 0;
        
        instances.forEach(instance => {
            const emissionBase = this.FACTEURS.instances[instance.type] || 0;
            const emission = emissionBase * (instance.nbMachines || 1);
            totalMensuel += emission;
        });
        
        const totalAnnuel = totalMensuel * 12;
        
        return {
            mensuel: totalMensuel,
            annuel: totalAnnuel
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
        // Calculs individuels
        const infrastructure = this.calculerInfrastructure(donneesEntree.instances);
        const reseau = this.calculerReseau(donneesEntree.regions);
        const usage = this.calculerUsageUtilisateurs(donneesEntree.sessions);
        
        // Impact total
        const impactTotal = this.calculerImpactTotal(infrastructure, reseau, usage);
        
        // Métriques
        const metriques = this.calculerMetriques(impactTotal, donneesEntree.analytics);
        
        // Équivalences
        const co2Tonnes = impactTotal.gain / 1000;
        const equivalences = this.calculerEquivalences(co2Tonnes);
        
        return {
            infrastructure,
            reseau,
            usage,
            impactTotal,
            metriques,
            equivalences
        };
    }

    // Méthode pour adapter les données du format API au format du calculateur
    adapterDonneesAPI(instances, connexions) {
        // Adapter les instances
        const instancesAdaptees = instances.map(instance => ({
            type: instance.type,
            nbMachines: instance.count
        }));

        // Créer des données de régions par défaut si non fournies
        const regionsParDefaut = [
            { nom: 'Europe', distanceMoyenne: 1000 },
            { nom: 'North America', distanceMoyenne: 7516 },
            { nom: 'Asia', distanceMoyenne: 7770 },
            { nom: 'Oceania', distanceMoyenne: 9700 },
            { nom: 'Africa', distanceMoyenne: 4900 },
            { nom: 'South America', distanceMoyenne: 9900 },
            { nom: 'Central America', distanceMoyenne: 8788 }
        ];

        // Adapter les connexions
        const regionsAdaptees = [];
        const regionsMap = new Map();

        // Initialiser les régions avec des valeurs par défaut
        regionsParDefaut.forEach(region => {
            regionsMap.set(region.nom, {
                nom: region.nom,
                connexions: 0,
                distanceMoyenne: region.distanceMoyenne
            });
        });

        // Ajouter les connexions par pays
        connexions.forEach(connexion => {
            // Associer les codes pays aux régions (simplification)
            let region;
            switch(connexion.country) {
                case 'FR':
                case 'DE':
                case 'GB':
                    region = 'Europe';
                    break;
                case 'US':
                    region = 'North America';
                    break;
                case 'JP':
                case 'CN':
                case 'IN':
                    region = 'Asia';
                    break;
                case 'AU':
                    region = 'Oceania';
                    break;
                default:
                    region = 'Europe'; // Par défaut
            }

            // Ajouter les connexions à la région
            const regionData = regionsMap.get(region);
            if (regionData) {
                regionData.connexions += connexion.count;
            }
        });

        // Convertir la Map en tableau
        regionsMap.forEach(value => {
            if (value.connexions > 0) {
                regionsAdaptees.push(value);
            } else {
                // Ajouter un minimum de connexions pour les régions sans données
                regionsAdaptees.push({...value, connexions: 10});
            }
        });

        // Données de sessions par défaut (simplifiées)
        const sessions = {
            desktop: { tempsTotal: 2348210 }, // secondes
            smartphone: { tempsTotal: 2128983 }
        };

        // Données analytics par défaut
        const analytics = {
            utilisateursUniques: 35000,
            sessionsTotal: 50000,
            actionsTotal: 400000
        };

        return {
            instances: instancesAdaptees,
            regions: regionsAdaptees,
            sessions,
            analytics
        };
    }
}

module.exports = CalculateurCO2;
