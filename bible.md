# 📖 Bible du Projet YesData Frequentation

## Règles Fondamentales du Projet

Ces règles sont **obligatoires** et doivent être respectées pour toute modification ou évolution du code.
Elles garantissent la cohérence, la maintenabilité et la qualité du projet.

## 1. 🏗️ Paradigme de développement

- **Utiliser la programmation orientée objet (POO) comme base.**
- Organiser le code en classes avec des méthodes claires et cohérentes.
- Chaque classe doit respecter le principe de responsabilité unique (SRP).
- Les fonctions doivent être indépendantes et réutilisables.

## 2. 📁 Structure et organisation des fichiers

- **Multiplier les fichiers si nécessaire** pour une meilleure lisibilité.
- Organiser par dossiers logiques :
  - `services/` → logique métier et appels externes
  - `controllers/` → gestion des flux de données et des requêtes
  - `models/` → structures de données et modèles
  - `utils/` → fonctions utilitaires réutilisables
  - `components/` → composants réutilisables de l'interface
  - `pages/` → vues et pages complètes
- **Ne jamais modifier le dossier `proto`** (contenu et structure intacts).

## 3. 🎨 Séparation du style

- **Tout le code CSS doit être complètement séparé du code métier.**
- Créer un dossier `style/ClaudS4/` et placer tous les fichiers CSS.
- Le reste de l'organisation du code doit être maintenu dans les autres dossiers.

## 4. 🔄 Compatibilité fonctionnelle

- **Garder la compatibilité fonctionnelle du projet** (mêmes entrées/sorties et comportement).
- Les utilisateurs ne doivent voir aucune différence dans l'utilisation.
- Toute nouvelle fonctionnalité doit être rétrocompatible.

## 5. 📝 Clarté et documentation

- **Utiliser des noms clairs et cohérents** pour les variables, fonctions et classes.
- **Ajouter des commentaires/docstrings** pour décrire le rôle des classes et méthodes.
- Documenter les paramètres d'entrée et de sortie.
- Expliquer la logique complexe avec des commentaires inline.

## 6. 🧪 Tests et validation

- Chaque module doit être testable indépendamment.
- Implémenter des tests de régression pour valider la compatibilité.
- Utiliser les tests de compatibilité pour vérifier les modifications.

## 7. 🔧 Gestion des erreurs

- Implémenter une gestion d'erreurs robuste et centralisée.
- Logger les erreurs avec des détails suffisants pour le debug.
- Prévoir des fallbacks et des mécanismes de récupération.

## 8. ⚡ Performance et optimisation

- Utiliser des mécanismes de cache intelligents.
- Optimiser les requêtes et les accès aux données.
- Éviter les fuites mémoire et nettoyer les ressources.

## 9. 🔒 Sécurité et validation

- Valider toutes les entrées utilisateur et données externes.
- Protéger contre les injections et attaques communes.
- Respecter les principes de moindre privilège.

## 10. 📊 Monitoring et observabilité

- Intégrer des métriques de performance.
- Logger les actions importantes pour le debugging.
- Fournir des outils de diagnostic et de santé du système.

## 11. 🚀 Script de lancement

- **Le fichier de lancement principal est `go.bat`**
- Ce script doit être **remis à jour et fourni à chaque réponse** de l'assistant
- Il constitue le **point d'entrée unique** pour démarrer l'environnement de développement
- Toute modification du projet doit être **répercutée dans go.bat**
- Le script doit rester **robuste et auto-diagnostique**
- **Version hybride obligatoire** : fichier local (immédiat) + serveur localhost (développement)

---

## ⚠️ Règles Non-Négociables

### 🚫 Interdictions Absolues

1. **Jamais de code CSS inline** dans les fichiers JavaScript
2. **Aucune modification** du dossier `proto/`
3. **Pas de variables globales** non documentées
4. **Aucun code dupliqué** sans justification
5. **Pas de fonctions > 50 lignes** sans refactorisation

### ✅ Obligations Strictes

1. **Toujours utiliser les classes** pour la logique métier
2. **Documenter chaque fonction publique**
3. **Tester la compatibilité** après chaque modification
4. **Respecter la structure des dossiers** définie
5. **Suivre les conventions de nommage** établies
6. **Maintenir go.bat à jour** et le fournir à chaque réponse

---

## 🎯 Objectifs Principaux

- **Maintenabilité** : Code facile à comprendre et modifier
- **Réutilisabilité** : Composants modulaires et indépendants
- **Robustesse** : Gestion d'erreurs et validation complète
- **Performance** : Optimisations et cache intelligents
- **Évolutivité** : Architecture prête pour les extensions futures

---

## 📚 Références et Documentation

- `go.bat` - **Script de lancement principal (point d'entrée unique)**
- `REFACTORING_SUMMARY.md` - Architecture technique détaillée
- `MIGRATION_GUIDE.md` - Guide de migration et utilisation
- `tests/compatibility-test.js` - Tests de validation
- `src/index.js` - Point d'entrée principal et exemples d'usage

---

**🔥 Cette bible est le fondement du projet. Tout développement doit s'y conformer.**