# Contributing to Loire Digital

Guide de contribution pour le projet Loire Digital.

## Table des matières

- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Scripts disponibles](#scripts-disponibles)
- [Conventions de code](#conventions-de-code)
- [Workflow de développement](#workflow-de-développement)

## Structure du projet

```
vitrine-loire-digital/
├── src/
│   ├── components/       # Composants réutilisables (React/Astro)
│   ├── layouts/          # Layouts Astro (BaseLayout, etc.)
│   ├── pages/            # Pages du site (routing automatique)
│   ├── content/          # Content collections (blog, portfolio)
│   ├── config/           # Fichiers de configuration (pricing, etc.)
│   └── styles/           # Styles globaux CSS/Tailwind
├── public/               # Assets statiques (images, fonts, etc.)
├── .claude/              # Documentation et tracking (gitignored)
└── dist/                 # Build output (généré)
```

### Alias TypeScript

Le projet utilise des alias pour simplifier les imports :

```typescript
import { Button } from '@components/Button'
import BaseLayout from '@layouts/BaseLayout.astro'
import { PRICING_PACKS } from '@config/pricing'
```

## Technologies utilisées

- **Astro 5** - Framework principal
- **React 19** - Pour les composants interactifs
- **TypeScript** - Typage strict
- **Tailwind CSS** - Styling
- **ESLint + Prettier** - Qualité du code

### Intégrations Astro

- `@astrojs/react` - Support React
- `@astrojs/tailwind` - Support Tailwind CSS
- `@astrojs/sitemap` - Génération du sitemap

## Scripts disponibles

### Développement

```bash
npm run dev        # Lance le serveur de dev sur http://localhost:4321
npm start          # Alias pour npm run dev
```

### Build et preview

```bash
npm run build      # Build le site pour production
npm run preview    # Preview du build en local
```

### Qualité du code

```bash
npm run lint           # Vérifie le code avec ESLint
npm run lint:fix       # Corrige automatiquement les erreurs ESLint
npm run format         # Formate le code avec Prettier
npm run format:check   # Vérifie le formatage sans modifier
```

### Workflow recommandé avant commit

```bash
npm run lint:fix && npm run format && npm run build
```

## Conventions de code

### TypeScript

- Mode strict activé (pas de `any` non justifiés)
- Toujours typer les paramètres et retours de fonction
- Utiliser les interfaces pour les objets complexes
- Préférer `const` à `let`, éviter `var`

```typescript
// ✅ Bon
interface Props {
  title: string
  count: number
}

const MyComponent = ({ title, count }: Props): JSX.Element => {
  return <div>{title}: {count}</div>
}

// ❌ Mauvais
const MyComponent = (props: any) => {
  return <div>{props.title}: {props.count}</div>
}
```

### Nommage

- **Composants** : PascalCase (`Button.tsx`, `HeroSection.astro`)
- **Fichiers utilitaires** : camelCase (`formatDate.ts`, `useLocalStorage.ts`)
- **Constantes** : UPPER_SNAKE_CASE (`PRICING_PACKS`, `API_URL`)
- **Variables/fonctions** : camelCase (`userName`, `getUserData()`)

### Composants

#### Composants Astro (.astro)

- Utiliser pour le contenu statique ou SSR
- Importer les styles Tailwind directement
- Utiliser `client:*` directives pour l'hydratation React

```astro
---
import Button from '@components/Button'

interface Props {
  title: string
}

const { title } = Astro.props
---

<section class="py-12">
  <h2>{title}</h2>
  <Button client:load>Click me</Button>
</section>
```

#### Composants React (.tsx)

- Utiliser pour les interactions côté client
- Toujours typer les props avec une interface
- Exporter par défaut ou nommé selon le contexte

```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

### Tailwind CSS

- Utiliser les classes utilitaires Tailwind
- Éviter le CSS custom sauf nécessaire
- Utiliser `@apply` dans les fichiers CSS pour les patterns récurrents
- Responsive-first : mobile d'abord, puis breakpoints

```jsx
// ✅ Bon
<div className="flex flex-col gap-4 md:flex-row md:gap-8">

// ❌ Éviter (trop de classes inline)
<div style={{ display: 'flex', gap: '1rem', ... }}>
```

## Workflow de développement

### 1. Créer une branche

```bash
git checkout -b feature/nom-de-la-feature
```

### 2. Développer

- Écrire du code propre et typé
- Tester localement avec `npm run dev`
- Vérifier avec `npm run lint` et `npm run format`

### 3. Vérifier le build

```bash
npm run build
```

Le build ne doit pas produire d'erreurs TypeScript ou ESLint.

### 4. Commit

Utiliser des messages de commit clairs en anglais :

```bash
git add .
git commit -m "Add contact form with validation"
```

### 5. Push et PR

```bash
git push origin feature/nom-de-la-feature
```

Créer une Pull Request sur GitHub avec une description claire des changements.

## Configuration des prix

**IMPORTANT** : Tous les prix du site doivent utiliser le fichier `src/config/pricing.ts`.

Ne jamais coder les prix en dur dans les composants. Toujours importer depuis la configuration :

```typescript
import { PRICING_PACKS, PRICING_OPTIONS } from '@config/pricing'

// Utiliser les données
const pack = PRICING_PACKS.find((p) => p.id === 'essentiel')
```

## Accessibilité

- Toujours ajouter des `alt` descriptifs aux images
- Utiliser des balises sémantiques HTML5
- Assurer un bon contraste de couleurs
- Tester la navigation au clavier
- Utiliser `aria-*` attributes quand nécessaire

## Performance

- Optimiser les images (WebP/AVIF)
- Utiliser `loading="lazy"` pour les images non critiques
- Minimiser les bundles JavaScript
- Préférer les composants Astro aux composants React quand possible

## Questions ?

Pour toute question, contacter l'équipe via les issues GitHub ou par email à contact@loiredigital.fr.
