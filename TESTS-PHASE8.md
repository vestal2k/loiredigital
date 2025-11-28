# 🧪 Système de Tests Phase 8

Guide rapide pour tester le système CRM et l'automatisation des leads.

---

## 🚀 Démarrage rapide

### Option 1 : Tests automatiques (recommandé)

```bash
# Terminal 1 : Lancer le serveur
npm run dev

# Terminal 2 : Lancer les tests
npm run test:phase8
```

**Durée estimée :** ~2 minutes (avec rate limiting) ou ~10 secondes (sans)

Le script va automatiquement tester :
- ✅ Présence des schémas Sanity
- ✅ APIs de contact et devis
- ✅ Validation des données
- ✅ Rate limiting (optionnel)
- ✅ Configuration du projet

**Résultat :** Rapport détaillé avec score de réussite

---

### Option 2 : Tests manuels complets

Consultez le guide détaillé : `.claude/phase8-tests.md`

1. Ouvrir Sanity Studio : `npm run sanity`
2. Tester le formulaire de contact
3. Tester le calculateur de devis
4. Vérifier les enregistrements dans Sanity
5. Tester le rate limiting

**Durée estimée :** ~15 minutes

---

## 📊 Résultats attendus

### Tests automatiques

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

### Tests manuels

- ✅ Les leads apparaissent dans Sanity Studio
- ✅ Les simulations de devis sont enregistrées
- ✅ Les emails sont envoyés
- ✅ Le rate limiting bloque après 5 requêtes
- ✅ La validation empêche les données invalides

---

## 🎯 Ce qui est testé

### 1. Structure du projet
- Schémas Sanity (`lead.ts`, `quoteLead.ts`)
- Schémas de validation Zod
- Client Sanity avec droits d'écriture
- Rate limiter

### 2. API Contact (`/api/contact`)
- ✅ Accepte les données valides (200)
- ✅ Rejette les emails invalides (400)
- ✅ Rejette les noms trop courts (400)
- ✅ Enregistre le lead dans Sanity
- ✅ Envoie l'email via Resend
- ✅ Rate limiting (5 req/min)

### 3. API Devis (`/api/devis`)
- ✅ Accepte les données valides (200)
- ✅ Rejette les packs invalides (400)
- ✅ Rejette les pages invalides (400)
- ✅ Rejette les prix négatifs (400)
- ✅ Enregistre la simulation dans Sanity
- ✅ Envoie l'email via Resend
- ✅ Rate limiting (5 req/min)

### 4. Sécurité
- ✅ Validation côté serveur (Zod)
- ✅ Rate limiting actif
- ✅ Logs d'erreur détaillés
- ✅ Protection contre les injections

---

## 🔧 Prérequis

### Variables d'environnement

Vérifier que `.env` contient :

```env
PUBLIC_SANITY_PROJECT_ID=r98l8u9o
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_...
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_live_...
```

### Services actifs

- ✅ Serveur dev : `npm run dev` (http://localhost:4321)
- ✅ Sanity Studio : `npm run sanity` (http://localhost:3333)

---

## 🚨 Dépannage

### Les tests échouent

**Problème :** "Server not accessible"
**Solution :** Lancer `npm run dev` dans un autre terminal

**Problème :** "Lead not saved to Sanity"
**Solution :** Vérifier `SANITY_API_TOKEN` dans `.env`

**Problème :** "Rate limit not working"
**Solution :** Normal, le rate limiter est en mémoire et se réinitialise

### Vérifier manuellement

```bash
# Vérifier les schémas Sanity
npm run sanity
# → Ouvrir http://localhost:3333
# → Vérifier "Leads" et "Simulations de devis"

# Tester l'API de contact
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "project": "creation",
    "message": "Test",
    "rgpdConsent": true
  }'

# Résultat attendu : {"success":true,"message":"..."}
```

---

## 📚 Documentation complète

- **Guide de tests manuels :** `.claude/phase8-tests.md`
- **Documentation Phase 8 :** `.claude/phase8-crm-automatisation.md`
- **Documentation des scripts :** `scripts/README.md`

---

## 🎉 Après les tests

### Si tous les tests passent

✅ **Phase 8 validée !**

Prochaines étapes :
1. Déployer sur Vercel : `git push`
2. Vérifier en production : https://loiredigital.fr
3. Tester le formulaire en production
4. Vérifier que les leads arrivent dans Sanity

### Si des tests échouent

1. Consulter le rapport de tests détaillé
2. Vérifier les logs du serveur (`npm run dev`)
3. Consulter `.claude/phase8-tests.md` pour le dépannage
4. Vérifier Sanity Studio pour les données

---

## 🔄 Tests en production

Une fois déployé sur Vercel :

```bash
# Tester contre la production
TEST_URL=https://loiredigital.fr npm run test:phase8
```

**Important :** Le rate limiting en production peut bloquer les tests multiples

---

## 📈 Statistiques

| Type de test | Nombre | Durée |
|--------------|--------|-------|
| Tests de structure | 8 | ~1s |
| Tests d'API | 10 | ~5s |
| Test de rate limiting | 1 | ~61s |
| **Total** | **19+** | **~2 min** |

---

## 💡 Conseils

- Lancer les tests **avant chaque déploiement**
- Vérifier Sanity Studio **après les tests automatiques**
- Tester manuellement les **cas limites**
- Consulter les **logs du serveur** en cas d'erreur

---

**Dernière mise à jour** : 28 novembre 2025

Pour toute question, consultez `.claude/phase8-tests.md`
