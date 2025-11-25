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
    id: 'decouverte',
    name: 'Découverte',
    basePrice: 599,
    pagesIncluded: 3,
    features: [
      'Design moderne et responsive',
      '3 pages incluses',
      'Formulaire de contact',
      'Optimisation mobile',
      'Hébergement 1ère année offerte',
    ],
  },
  {
    id: 'essentiel',
    name: 'Essentiel',
    basePrice: 999,
    pagesIncluded: 5,
    popular: true,
    features: [
      'Tout du pack Découverte',
      '5 pages incluses',
      'SEO de base',
      'Intégration Google Maps',
      'Galerie photos (20 images)',
      'Hébergement 1ère année offerte',
    ],
  },
  {
    id: 'complet',
    name: 'Complet',
    basePrice: 1499,
    pagesIncluded: 8,
    features: [
      'Tout du pack Essentiel',
      '8 pages incluses',
      'Blog intégré',
      'SEO avancé',
      'Galerie photos illimitée',
      'Formulaires avancés',
      'Hébergement 1ère année offerte',
    ],
  },
]

/**
 * Price per additional page beyond what's included in the pack
 */
export const PRICE_PER_EXTRA_PAGE = 100

/**
 * Optional features/addons
 */
export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: 'blog',
    name: 'Blog',
    price: 200,
    description: 'Blog avec système de gestion de contenus',
  },
  {
    id: 'gallery',
    name: 'Galerie photo avancée',
    price: 150,
    description: 'Galerie photos avec lightbox et catégories',
  },
  {
    id: 'seo',
    name: 'SEO local avancé',
    price: 250,
    description: 'Optimisation SEO complète + Google Business',
  },
  {
    id: 'booking',
    name: 'Système de réservation',
    price: 400,
    description: 'Calendrier de réservation en ligne',
  },
  {
    id: 'ecommerce-basic',
    name: 'E-commerce basique',
    price: 600,
    description: 'Boutique en ligne (max 20 produits)',
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
    features: [
      'Mises à jour de sécurité',
      'Sauvegardes hebdomadaires',
      'Support par email',
    ],
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
  maintenanceMonths = 12
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
