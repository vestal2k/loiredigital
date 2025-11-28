# Loire Digital

**Vitrine professionnelle pour la création de sites web destinés aux commerces locaux de Saint-Étienne et de la Loire.**

## 📋 Table des matières

- [À propos](#à-propos)
- [Technologies](#technologies)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [Déploiement](#déploiement)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Licence](#licence)

## À propos

Loire Digital est une vitrine web professionnelle dédiée à la création de sites internet pour les commerces de proximité, TPE et associations de la région stéphanoise. Le site propose :

- **Des offres claires et transparentes** : packs Starter, Essentiel, Premium et E-commerce
- **Un calculateur de devis interactif** avec génération PDF
- **Un système de paiement sécurisé** via Stripe (paiement intégral ou acompte)
- **Un espace client** permettant le suivi de projet, la validation de maquettes et l'accès aux factures
- **Un blog optimisé SEO** avec articles ciblés par secteur d'activité
- **Un CRM intégré** via Sanity pour gérer les leads et devis

## Technologies

### Framework & Langages

- **[Astro](https://astro.build/)** - Framework web moderne et performant
- **[React](https://react.dev/)** - Composants interactifs (formulaires, calculateur)
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first

### Backend & Services

- **[Sanity CMS](https://www.sanity.io/)** - CMS headless + CRM
- **[Stripe](https://stripe.com/)** - Paiements en ligne sécurisés
- **[Resend](https://resend.com/)** - Envoi d'emails transactionnels
- **[Crisp](https://crisp.chat/)** - Chat en direct
- **[Vercel](https://vercel.com/)** - Hébergement et déploiement

### Validation & Sécurité

- **[Zod](https://zod.dev/)** - Validation des schémas de données
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hachage de mots de passe
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - Authentification JWT
- **Rate Limiting** - Protection contre les abus d'API

### Monitoring & Analytics

- **[@vercel/analytics](https://vercel.com/analytics)** - Statistiques de trafic
- **[@vercel/speed-insights](https://vercel.com/docs/speed-insights)** - Métriques de performance

## Fonctionnalités

### ✅ Pages principales

- **Accueil** : présentation des services, portfolio, témoignages
- **Services** : détail des offres et prestations
- **À propos** : présentation du freelance
- **Portfolio** : projets réalisés (gérés via Sanity)
- **Blog** : articles SEO optimisés par secteur
- **Contact** : formulaire + chat Crisp
- **Devis** : calculateur interactif avec génération PDF

### ✅ Pages légales (conformité RGPD)

- Mentions légales
- Conditions générales de vente (CGV)
- Politique de confidentialité

### ✅ Système de paiement

- Intégration Stripe Checkout
- Paiement intégral (-5% de réduction)
- Paiement en 2 fois (acompte 30% + solde)
- Pages de confirmation et annulation

### ✅ Espace client

- Authentification sécurisée (JWT + cookies httpOnly)
- Dashboard avec statistiques des projets
- Suivi de progression en temps réel
- Validation/révision des maquettes
- Accès aux factures PDF
- Fil d'actualités des mises à jour

### ✅ CRM et automatisation

- Enregistrement automatique des leads (formulaire de contact)
- Enregistrement des simulations de devis
- Dashboard Sanity Studio pour gérer les leads
- Rate limiting (5 requêtes/minute par IP)
- Logs détaillés pour le debugging

### ✅ Blog et SEO

- Articles de blog avec markdown + Sanity
- Optimisation SEO (meta titles, descriptions, alt)
- Sitemap automatique
- Images optimisées avec astro-image
- Contrastes accessibles (WCAG)

## Structure du projet

```
vitrine-loire-digital/
├── src/
│   ├── components/           # Composants UI Astro et React
│   │   ├── Icon.astro
│   │   ├── Section.astro
│   │   ├── FeatureCard.astro
│   │   ├── PricingCard.astro
│   │   ├── CTABlock.astro
│   │   ├── ContactForm.tsx   # Formulaire React
│   │   ├── QuoteCalculator.tsx  # Calculateur React
│   │   └── ClientHeader.astro
│   ├── pages/                # Pages et routes Astro
│   │   ├── index.astro       # Accueil
│   │   ├── services.astro
│   │   ├── about.astro
│   │   ├── portfolio.astro
│   │   ├── contact.astro
│   │   ├── devis.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── paiement/
│   │   │   ├── index.astro
│   │   │   ├── succes.astro
│   │   │   └── annule.astro
│   │   ├── espace-client/
│   │   │   ├── connexion.astro
│   │   │   ├── dashboard.astro
│   │   │   └── projet/[id].astro
│   │   ├── mentions-legales.astro
│   │   ├── cgv.astro
│   │   ├── politique-confidentialite.astro
│   │   └── api/              # API endpoints
│   │       ├── contact.ts
│   │       ├── devis.ts
│   │       ├── create-checkout-session.ts
│   │       ├── stripe-webhook.ts
│   │       ├── auth/
│   │       │   ├── login.ts
│   │       │   ├── logout.ts
│   │       │   └── me.ts
│   │       └── client/
│   │           ├── projects.ts
│   │           ├── project/[id].ts
│   │           └── mockup-feedback.ts
│   ├── layouts/              # Layouts Astro
│   │   ├── Layout.astro      # Layout général
│   │   └── BaseLayout.astro
│   ├── content/              # Contenu markdown
│   │   ├── blog/
│   │   └── config.ts
│   ├── lib/                  # Utilitaires et helpers
│   │   ├── sanity.ts         # Client Sanity (lecture)
│   │   ├── sanity-client.ts  # Client Sanity (écriture)
│   │   ├── stripe.ts         # Configuration Stripe
│   │   ├── stripe-products.ts
│   │   ├── auth.ts           # Utilitaires JWT
│   │   ├── rate-limiter.ts   # Rate limiting
│   │   ├── blog.ts           # Helpers blog
│   │   ├── portfolio.ts      # Helpers portfolio
│   │   └── portableText.ts   # Conversion Portable Text
│   ├── schemas/              # Schémas de validation Zod
│   │   ├── contact.schema.ts
│   │   └── quote.schema.ts
│   ├── config/               # Configuration
│   │   └── pricing.ts
│   └── styles/
│       └── global.css
├── sanity/                   # Configuration Sanity Studio
│   ├── schemaTypes/
│   │   ├── post.ts           # Schéma blog
│   │   ├── project.ts        # Schéma portfolio
│   │   ├── lead.ts           # Schéma leads
│   │   ├── quoteLead.ts      # Schéma devis
│   │   ├── client.ts         # Schéma clients
│   │   └── clientProject.ts  # Schéma projets clients
│   ├── sanity.config.ts
│   └── sanity.cli.ts
├── .claude/                  # Documentation interne (git-ignored)
│   ├── todos.md              # Liste des tâches par phase
│   ├── sanity-setup.md
│   ├── stripe-setup.md
│   ├── client-portal-setup.md
│   └── phase8-crm-automatisation.md
├── public/                   # Assets statiques
│   ├── images/
│   ├── icons/
│   └── logo.svg
├── scripts/                  # Scripts utilitaires
│   ├── test-phase8.js
│   └── test-phase8-quick.js
├── create-client.js          # Script création client
├── reset-client-password.js  # Script reset mot de passe
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Installation

### Prérequis

- **Node.js** >= 18.x
- **npm** ou **pnpm**
- Un compte [Sanity.io](https://www.sanity.io/)
- Un compte [Stripe](https://stripe.com/)
- Un compte [Resend](https://resend.com/)

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/vitrine-loire-digital.git
cd vitrine-loire-digital
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet (voir section [Configuration](#configuration))

4. **Démarrer le serveur de développement**

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:4321`

5. **Démarrer Sanity Studio (optionnel)**

```bash
npm run sanity
```

Le studio sera accessible sur `http://localhost:3333`

## Configuration

### Variables d'environnement

Créer un fichier `.env` avec les variables suivantes :

```env
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token

# Stripe
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (emails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@loiredigital.fr

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# URLs
PUBLIC_SITE_URL=http://localhost:4321
```

### Sanity CMS

1. Créer un projet sur [sanity.io](https://www.sanity.io/)
2. Récupérer le `Project ID`
3. Créer un token API avec droits d'écriture
4. Mettre à jour les variables d'environnement
5. Déployer le studio : `npm run sanity:deploy`

### Stripe

1. Créer un compte sur [stripe.com](https://stripe.com/)
2. Activer le mode test
3. Récupérer les clés API (publishable et secret)
4. Configurer les webhooks pour `/api/stripe-webhook`
5. Récupérer le webhook secret

### Resend

1. Créer un compte sur [resend.com](https://resend.com/)
2. Vérifier votre domaine d'envoi
3. Récupérer la clé API
4. Mettre à jour `RESEND_FROM_EMAIL`

## Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement
npm run build            # Build pour production (avec check TypeScript)
npm run preview          # Prévisualiser le build de production

# Sanity Studio
npm run sanity           # Démarrer Sanity Studio en local
npm run sanity:deploy    # Déployer Sanity Studio

# Clients
npm run create-client    # Créer un nouveau client pour l'espace client
npm run reset-password   # Réinitialiser le mot de passe d'un client

# Tests
npm run test:phase8         # Tests Phase 8 (CRM, avec rate limiting)
npm run test:phase8:quick   # Tests Phase 8 rapides (sans rate limiting)

# Qualité de code
npm run lint             # Vérifier le code avec ESLint
npm run lint:fix         # Corriger automatiquement les erreurs ESLint
npm run format           # Formater le code avec Prettier
npm run format:check     # Vérifier le formatage sans modification
```

## Déploiement

### Vercel (recommandé)

Le projet est optimisé pour Vercel avec l'adaptateur `@astrojs/vercel`.

1. **Connecter le repository à Vercel**

```bash
vercel
```

2. **Configurer les variables d'environnement** dans les settings Vercel

3. **Déployer**

```bash
vercel --prod
```

### Variables d'environnement Vercel

Ajouter toutes les variables du fichier `.env` dans les settings du projet Vercel.

### Webhooks Stripe

Mettre à jour l'URL du webhook Stripe avec l'URL de production :
```
https://votre-domaine.com/api/stripe-webhook
```

## Documentation

La documentation complète du projet est disponible dans le dossier `.claude/` :

- **todos.md** - Liste des tâches par phase de développement
- **sanity-setup.md** - Guide de configuration Sanity CMS
- **stripe-setup.md** - Guide d'intégration Stripe
- **client-portal-setup.md** - Documentation de l'espace client
- **phase8-crm-automatisation.md** - Détails du système CRM

## Roadmap

### ✅ Phases complétées

- **Phase 1** : Tarifs et offres
- **Phase 2** : Design et UX
- **Phase 3** : Pages légales et contenu
- **Phase 4** : SEO et accessibilité
- **Phase 5** : Formulaire et intégrations
- **Phase 6** : Blog et CMS
- **Phase 7** : Paiement et espace client
- **Phase 8** : CRM et automatisation

### 🚧 Phase en cours

- **Phase 9** : Code et tests
  - [ ] Restructurer le code (features, sections)
  - [ ] Ajouter des tests unitaires
  - [ ] Ajouter des tests E2E

### 📋 Phases à venir

- **Phase 10** : Marketing et communication
- **Phase 11** : Internationalisation et sécurité
- **Phase 12** : Monitoring et maintenance

Voir `.claude/todos.md` pour le détail complet de toutes les phases.

## Conformité

### RGPD

Le site est conforme au RGPD :
- ✅ Politique de confidentialité
- ✅ Consentement explicite dans les formulaires
- ✅ Information sur la collecte de données (Crisp, Analytics)
- ✅ Cookies sécurisés (httpOnly, sameSite)

### Accessibilité

- ✅ Contrastes respectés (WCAG)
- ✅ Balises alt sur toutes les images
- ✅ Navigation clavier complète
- ✅ aria-labels sur les éléments interactifs

## Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Loire Digital** - Création de sites web pour commerces locaux à Saint-Étienne
<br>
Dernière mise à jour : 28 novembre 2025
