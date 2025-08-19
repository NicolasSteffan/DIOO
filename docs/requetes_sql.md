# Requêtes SQL - Application DIOO

## 📋 Structure de la table

La table principale contient les colonnes suivantes :
- `[Dx]` - Identifiant de l'application (anciennement D*)
- `[App Appli]` - Nom de l'application (anciennement App. Name)
- `[App Code]` - Code de l'application (anciennement App. Code)
- `[Operator/Department]` - Opérateur ou département
- `[Business criticality]` - Criticité métier (Critical, High, Medium, Low)
- `[Functional monitoring (BSM)]` - Monitoring fonctionnel BSM (YES/NO)
- `[In HCC]` - Présence dans HCC (YES/NO)
- `[HCC eligibility]` - Éligibilité HCC (YES/NO)

## 🎯 Requêtes principales (Cartes de consolidation)

### 1. Total d'applications critiques
```sql
SELECT COUNT(*) AS total_critiques
FROM dioo_donnees 
WHERE [Dx] LIKE 'DP%' 
  AND [Business criticality] = 'Critical';
```

### 2. Monitored in BSM
```sql
SELECT COUNT(*) AS monitored_bsm
FROM dioo_donnees 
WHERE [Dx] = 'DP' 
  AND [Business criticality] = 'Critical'
  AND [Functional monitoring (BSM)] = 'YES';
```

### 3. Still To Be Monitored
```sql
SELECT COUNT(*) AS still_to_monitor
FROM dioo_donnees 
WHERE [Dx] = 'DP' 
  AND [Business criticality] = 'Critical'
  AND [In HCC] = 'NO';
```

### 4. Confirmed Not Required in BSM
```sql
SELECT COUNT(*) AS not_required_bsm
FROM dioo_donnees 
WHERE [Dx] = 'DP' 
  AND [Business criticality] = 'Critical'
  AND [Functional monitoring (BSM)] = 'NO'
  AND [HCC eligibility] = 'NO';
```

### 5. Monitored in HCC
```sql
SELECT COUNT(*) AS monitored_hcc
FROM dioo_donnees 
WHERE [Dx] = 'DP' 
  AND [Business criticality] = 'Critical'
  AND [In HCC] = 'YES';
```

### 6. Confirmed not required in HCC
```sql
SELECT COUNT(*) AS not_required_hcc
FROM dioo_donnees 
WHERE [Dx] = 'DP' 
  AND [Business criticality] = 'Critical'
  AND [In HCC] = 'NO'
  AND [HCC eligibility] = 'NO';
```

## 🎯 Section DP spéciale

### 7. Critical Business Services (Total des lignes)
```sql
SELECT COUNT(*) AS critical_business_services
FROM dioo_donnees;
```

### 8. Still to be onboarded (Section DP)
```sql
SELECT COUNT(*) AS still_to_onboard
FROM dioo_donnees 
WHERE [Dx] LIKE 'DP%' 
  AND [Business criticality] = 'Critical'
  AND [Functional monitoring (BSM)] = 'YES';
```

## 🎯 Sections DPx (DPA, DPB, DPC, DPP, DPS)

### Total par section (exemple pour DPA)
```sql
SELECT COUNT(*) AS total_dpa
FROM dioo_donnees 
WHERE [Dx] LIKE 'DPA%' 
  AND [Business criticality] = 'Critical';
```

### Monitored par section (exemple pour DPA)
```sql
SELECT COUNT(*) AS monitored_dpa
FROM dioo_donnees 
WHERE [Dx] LIKE 'DPA%' 
  AND [Business criticality] = 'Critical'
  AND [Functional monitoring (BSM)] = 'YES';
```

### Requête combinée pour toutes les sections DPx
```sql
SELECT 
    CASE 
        WHEN [Dx] LIKE 'DPA%' THEN 'DPA'
        WHEN [Dx] LIKE 'DPB%' THEN 'DPB'
        WHEN [Dx] LIKE 'DPC%' THEN 'DPC'
        WHEN [Dx] LIKE 'DPP%' THEN 'DPP'
        WHEN [Dx] LIKE 'DPS%' THEN 'DPS'
    END AS section,
    COUNT(*) AS total,
    SUM(CASE WHEN [Functional monitoring (BSM)] = 'YES' THEN 1 ELSE 0 END) AS monitored
FROM dioo_donnees 
WHERE [Dx] LIKE 'DP%' 
  AND [Business criticality] = 'Critical'
  AND ([Dx] LIKE 'DPA%' OR [Dx] LIKE 'DPB%' OR [Dx] LIKE 'DPC%' OR [Dx] LIKE 'DPP%' OR [Dx] LIKE 'DPS%')
GROUP BY 
    CASE 
        WHEN [Dx] LIKE 'DPA%' THEN 'DPA'
        WHEN [Dx] LIKE 'DPB%' THEN 'DPB'
        WHEN [Dx] LIKE 'DPC%' THEN 'DPC'
        WHEN [Dx] LIKE 'DPP%' THEN 'DPP'
        WHEN [Dx] LIKE 'DPS%' THEN 'DPS'
    END
ORDER BY section;
```

## 📊 Requêtes de calcul de pourcentages

### Pourcentages BSM
```sql
SELECT 
    COUNT(*) AS total_critiques,
    SUM(CASE WHEN [Functional monitoring (BSM)] = 'NO' AND [HCC eligibility] = 'NO' THEN 1 ELSE 0 END) AS not_required_bsm,
    ROUND(
        (SUM(CASE WHEN [Functional monitoring (BSM)] = 'NO' AND [HCC eligibility] = 'NO' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
        0
    ) AS pct_not_required_bsm
FROM dioo_donnees 
WHERE [D*] LIKE 'DP%' 
  AND [Business criticality] = 'Critical';
```

### Pourcentages HCC
```sql
SELECT 
    COUNT(*) AS total_critiques,
    SUM(CASE WHEN [In HCC] = 'YES' THEN 1 ELSE 0 END) AS monitored_hcc,
    SUM(CASE WHEN [In HCC] = 'NO' AND [HCC eligibility] = 'NO' THEN 1 ELSE 0 END) AS not_required_hcc,
    ROUND(
        (SUM(CASE WHEN [In HCC] = 'YES' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
        0
    ) AS pct_monitored_hcc,
    ROUND(
        (SUM(CASE WHEN [In HCC] = 'NO' AND [HCC eligibility] = 'NO' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
        0
    ) AS pct_not_required_hcc
FROM dioo_donnees 
WHERE [D*] LIKE 'DP%' 
  AND [Business criticality] = 'Critical';
```

## 🔍 Requêtes de diagnostic

### Vérifier la répartition des criticités
```sql
SELECT 
    [Business criticality],
    COUNT(*) AS count
FROM dioo_donnees 
GROUP BY [Business criticality]
ORDER BY count DESC;
```

### Vérifier les préfixes D*
```sql
SELECT 
    LEFT([D*], 3) AS prefix,
    COUNT(*) AS count
FROM dioo_donnees 
WHERE [D*] LIKE 'DP%'
GROUP BY LEFT([D*], 3)
ORDER BY count DESC;
```

### Vue d'ensemble des données
```sql
SELECT 
    COUNT(*) AS total_lignes,
    COUNT(CASE WHEN [D*] LIKE 'DP%' THEN 1 END) AS lignes_dp,
    COUNT(CASE WHEN [Business criticality] = 'Critical' THEN 1 END) AS lignes_critical,
    COUNT(CASE WHEN [D*] LIKE 'DP%' AND [Business criticality] = 'Critical' THEN 1 END) AS lignes_dp_critical
FROM dioo_donnees;
```

## 📝 Notes d'implémentation

- Les requêtes utilisent `LIKE 'DP%'` pour filtrer les applications commençant par "DP"
- Les comparaisons de texte sont insensibles à la casse (conversion en majuscules)
- Les pourcentages sont arrondis à l'entier le plus proche
- La section DP spéciale utilise le nombre total de lignes comme référence
- Les autres sections (DPA, DPB, etc.) utilisent uniquement les lignes critiques DP

## 🚀 Utilisation

Ces requêtes correspondent exactement aux calculs effectués par l'application DIOO. 
Elles peuvent être utilisées pour :
- Valider les résultats de l'application
- Effectuer des analyses directement en base de données
- Créer des rapports personnalisés
- Déboguer les calculs de consolidation