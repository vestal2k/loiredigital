/**
 * Pricing configuration for Loire Digital services
 * Single source of truth for all pricing across the site
 */

export interface PricingPack {
  id: string
  name: string
  basePrice: number
  pagesIncluded: number
  features: string[]
  popular?: boolean
}

export interface PricingOption {
  id: string
  name: string
  price: number
  description: string
}

/**
 * Main pricing packs
 */
export const PRICING_PACKS: PricingPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    basePrice: 400,
    pagesIncluded: 1,
    features: [
      'Landing page (1 page)',
      'Design sobre et professionnel',
      'Formulaire de contact',
      'Optimisation mobile',
      'Hébergement 1ère année offerte',
    ],
  },
  {
    id: 'essentiel',
    name: 'Essentiel',
    basePrice: 800,
    pagesIncluded: 4,
    popular: true,
    features: [
      'Tout du pack Starter',
      'Jusqu\'à 4 pages',
      'SEO de base',
      'Intégration Google Maps',
      'Galerie photos (20 images)',
      'Hébergement 1ère année offerte',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    basePrice: 1500,
    pagesIncluded: 8,
    features: [
      'Tout du pack Essentiel',
      'Jusqu\'à 8 pages',
      'Blog intégré',
      'SEO avancé',
      'Galerie photos illimitée',
      'Formulaires avancés',
      'Hébergement 1ère année offerte',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    basePrice: 2500,
    pagesIncluded: 10,
    features: [
      'Tout du pack Premium',
      'Boutique en ligne complète',
      'Gestion des produits',
      'Paiement en ligne sécurisé',
      'Gestion des commandes',
      'Système de panier',
      'Hébergement 1ère année offerte',
    ],
  },
]

/**
 * Price per additional page beyond what's included in the pack
 */
export const PRICE_PER_EXTRA_PAGE = 100

/**
 * Optional features/addons with fixed prices
 */
export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: 'blog',
    name: 'Blog',
    price: 300,
    description: 'Blog avec système de gestion de contenus et pagination',
  },
  {
    id: 'gallery',
    name: 'Galerie photo avancée',
    price: 200,
    description: 'Galerie photos illimitée avec lightbox et catégories',
  },
  {
    id: 'seo',
    name: 'SEO avancé',
    price: 300,
    description: 'Optimisation SEO complète + Google Business + balises avancées',
  },
  {
    id: 'booking',
    name: 'Système de réservation',
    price: 500,
    description: 'Calendrier de réservation en ligne avec gestion des créneaux',
  },
  {
    id: 'ecommerce-addon',
    name: 'Module E-commerce',
    price: 800,
    description: 'Ajout boutique en ligne à un pack existant (max 30 produits)',
  },
]

/**
 * Maintenance plans (monthly)
 */
export const MAINTENANCE_PLANS = [
  {
    id: 'basic',
    name: 'Maintenance basique',
    pricePerMonth: 29,
    features: ['Mises à jour de sécurité', 'Sauvegardes hebdomadaires', 'Support par email'],
  },
  {
    id: 'premium',
    name: 'Maintenance premium',
    pricePerMonth: 59,
    features: [
      'Tout de la maintenance basique',
      'Sauvegardes quotidiennes',
      'Support prioritaire',
      '2h de modifications/mois incluses',
      'Monitoring 24/7',
    ],
  },
]

/**
 * Helper function to calculate total price for a custom quote
 */
export function calculateQuoteTotal(
  packId: string,
  extraPages: number,
  optionIds: string[],
  _maintenanceMonths = 12
): number {
  const pack = PRICING_PACKS.find((p) => p.id === packId)
  if (!pack) return 0

  let total = pack.basePrice

  // Add extra pages cost
  if (extraPages > 0) {
    total += extraPages * PRICE_PER_EXTRA_PAGE
  }

  // Add options cost
  optionIds.forEach((optionId) => {
    const option = PRICING_OPTIONS.find((o) => o.id === optionId)
    if (option) {
      total += option.price
    }
  })

  // Note: maintenance is not included in initial total
  // as it's a recurring monthly cost

  return total
}
