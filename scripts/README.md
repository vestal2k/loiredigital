# Scripts de test

Ce dossier contient les scripts de test et d'automatisation pour le projet Loire Digital.

---

## 🧪 Test Phase 8 : CRM et Automatisation

### Lancement rapide

```bash
npm run test:phase8
```

### Ce que ce script teste

Le script `test-phase8.js` effectue une série de tests automatiques pour valider la Phase 8 :

#### Tests de structure
- ✅ Vérification de l'existence des schémas Sanity (`lead.ts`, `quoteLead.ts`)
- ✅ Vérification de l'importation des schémas dans `index.ts`
- ✅ Vérification de la structure des fichiers du projet
- ✅ Vérification de la configuration du client Sanity
- ✅ Vérification des variables d'environnement

#### Tests des APIs (nécessite que le serveur tourne)
- ✅ API Contact avec données valides (200 OK)
- ✅ API Contact avec données invalides (400 Bad Request)
- ✅ API Devis avec données valides (200 OK)
- ✅ API Devis avec données invalides (400 Bad Request)
- ✅ Rate limiting (5 requêtes max, puis 429 Too Many Requests)

### Prérequis

Pour lancer les tests complets, le serveur de développement doit tourner :

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:phase8
```

### Options

Le script utilise par défaut `http://localhost:4321`. Pour tester contre un autre environnement :

```bash
TEST_URL=https://loiredigital.fr npm run test:phase8
```

### Rapport de test

Le script génère un rapport détaillé avec :
- ✅ Nombre de tests réussis
- ❌ Nombre de tests échoués
- ⚠️ Nombre d'avertissements
- 📊 Score global en pourcentage
- 📝 Liste détaillée des erreurs

Exemple de sortie :

```
==============================================================
📊 RAPPORT DE TESTS - PHASE 8
==============================================================

Résumé :
  ✅ Tests réussis : 25
  ❌ Tests échoués : 0
  ⚠️  Avertissements : 1

Score :
  100% - Excellent ! 🎉
==============================================================
```

---

## 📋 Tests manuels

Pour les tests manuels complets, consultez :
- `.claude/phase8-tests.md` - Guide détaillé de tous les tests manuels

---

## 🔧 Maintenance

### Ajouter de nouveaux tests

Pour ajouter de nouveaux tests au script :

1. Créer une nouvelle fonction de test dans `test-phase8.js`
2. Utiliser `addResult()` pour enregistrer les résultats
3. Appeler la fonction dans `runAllTests()`

Exemple :

```javascript
async function testMonNouveauTest() {
  log.section('Test X: Mon nouveau test')

  const result = // ... logique de test

  addResult(
    'Description du test',
    result === attendu,
    `Message d'erreur si échec`
  )
}
```

### Debugging

Pour voir plus de détails pendant l'exécution :

1. Ajouter des `console.log()` dans le script
2. Vérifier les logs du serveur dev (terminal où tourne `npm run dev`)
3. Consulter Sanity Studio pour vérifier les données enregistrées

---

## 🚀 CI/CD

Ce script peut être intégré dans un pipeline CI/CD :

```yaml
# Exemple GitHub Actions
- name: Run Phase 8 tests
  run: |
    npm run dev &
    sleep 5
    npm run test:phase8
```

---

**Dernière mise à jour** : 28 novembre 2025
