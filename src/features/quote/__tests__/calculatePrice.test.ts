import { describe, it, expect } from 'vitest'
import {
  calculateQuotePrice,
  getMaintenancePlanDetails,
  getPackDetails,
  getOptionDetails,
} from '../calculatePrice'
import {
  PRICING_PACKS,
  PRICING_OPTIONS,
  PRICE_PER_EXTRA_PAGE,
  MAINTENANCE_PLANS,
} from '@/config/pricing'

describe('calculateQuotePrice', () => {
  describe('Basic price calculations', () => {
    it('should calculate price for starter pack with no extras', () => {
      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: '',
      })

      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')
      expect(result.basePrice).toBe(starterPack?.basePrice)
      expect(result.extraPagesPrice).toBe(0)
      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack?.basePrice)
      expect(result.maintenancePrice).toBe(0)
    })

    it('should calculate price for essentiel pack with no extras', () => {
      const result = calculateQuotePrice({
        packId: 'essentiel',
        pages: 4,
        optionIds: [],
        maintenance: '',
      })

      const essentielPack = PRICING_PACKS.find((p) => p.id === 'essentiel')
      expect(result.basePrice).toBe(essentielPack?.basePrice)
      expect(result.extraPagesPrice).toBe(0)
      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(essentielPack?.basePrice)
    })

    it('should calculate price for complet pack with no extras', () => {
      const result = calculateQuotePrice({
        packId: 'complet',
        pages: 8,
        optionIds: [],
        maintenance: '',
      })

      const completPack = PRICING_PACKS.find((p) => p.id === 'complet')
      expect(result.basePrice).toBe(completPack?.basePrice)
      expect(result.extraPagesPrice).toBe(0)
      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(completPack?.basePrice)
    })
  })

  describe('Extra pages calculations', () => {
    it('should calculate extra pages price correctly', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!
      const extraPages = 5
      const totalPages = starterPack.pagesIncluded + extraPages

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: totalPages,
        optionIds: [],
        maintenance: '',
      })

      expect(result.extraPagesPrice).toBe(extraPages * PRICE_PER_EXTRA_PAGE)
      expect(result.totalPrice).toBe(
        starterPack.basePrice + extraPages * PRICE_PER_EXTRA_PAGE
      )
    })

    it('should not charge for extra pages when within pack limit', () => {
      const essentielPack = PRICING_PACKS.find((p) => p.id === 'essentiel')!

      const result = calculateQuotePrice({
        packId: 'essentiel',
        pages: essentielPack.pagesIncluded - 1,
        optionIds: [],
        maintenance: '',
      })

      expect(result.extraPagesPrice).toBe(0)
    })

    it('should calculate extra pages for exactly one page over limit', () => {
      const completPack = PRICING_PACKS.find((p) => p.id === 'complet')!

      const result = calculateQuotePrice({
        packId: 'complet',
        pages: completPack.pagesIncluded + 1,
        optionIds: [],
        maintenance: '',
      })

      expect(result.extraPagesPrice).toBe(PRICE_PER_EXTRA_PAGE)
    })
  })

  describe('Options pricing', () => {
    it('should add single option price correctly', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!
      const seoOption = PRICING_OPTIONS.find((o) => o.id === 'seo')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: ['seo'],
        maintenance: '',
      })

      expect(result.optionsPrice).toBe(seoOption.price)
      expect(result.totalPrice).toBe(starterPack.basePrice + seoOption.price)
    })

    it('should add multiple options prices correctly', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!
      const seoOption = PRICING_OPTIONS.find((o) => o.id === 'seo')!
      const blogOption = PRICING_OPTIONS.find((o) => o.id === 'blog')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: ['seo', 'blog'],
        maintenance: '',
      })

      expect(result.optionsPrice).toBe(seoOption.price + blogOption.price)
      expect(result.totalPrice).toBe(
        starterPack.basePrice + seoOption.price + blogOption.price
      )
    })

    it('should handle invalid option IDs gracefully', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: ['invalid-option-id'],
        maintenance: '',
      })

      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack.basePrice)
    })

    it('should combine all available options correctly', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!
      const allOptionIds = PRICING_OPTIONS.map((o) => o.id)
      const totalOptionsPrice = PRICING_OPTIONS.reduce(
        (sum, o) => sum + o.price,
        0
      )

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: allOptionIds,
        maintenance: '',
      })

      expect(result.optionsPrice).toBe(totalOptionsPrice)
      expect(result.totalPrice).toBe(starterPack.basePrice + totalOptionsPrice)
    })
  })

  describe('Maintenance pricing', () => {
    it('should calculate basic maintenance price', () => {
      const basicPlan = MAINTENANCE_PLANS.find((p) => p.id === 'basic')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: 'basic',
      })

      expect(result.maintenancePrice).toBe(basicPlan.pricePerMonth)
    })

    it('should calculate premium maintenance price', () => {
      const premiumPlan = MAINTENANCE_PLANS.find((p) => p.id === 'premium')!

      const result = calculateQuotePrice({
        packId: 'essentiel',
        pages: 4,
        optionIds: [],
        maintenance: 'premium',
      })

      expect(result.maintenancePrice).toBe(premiumPlan.pricePerMonth)
    })

    it('should return 0 for no maintenance', () => {
      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: '',
      })

      expect(result.maintenancePrice).toBe(0)
    })

    it('should not include maintenance in total price', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!
      const basicPlan = MAINTENANCE_PLANS.find((p) => p.id === 'basic')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: 'basic',
      })

      // Maintenance is separate from total price
      expect(result.totalPrice).toBe(starterPack.basePrice)
      expect(result.maintenancePrice).toBe(basicPlan.pricePerMonth)
    })
  })

  describe('Complex scenarios', () => {
    it('should calculate complete quote with all components', () => {
      const essentielPack = PRICING_PACKS.find((p) => p.id === 'essentiel')!
      const seoOption = PRICING_OPTIONS.find((o) => o.id === 'seo')!
      const blogOption = PRICING_OPTIONS.find((o) => o.id === 'blog')!
      const premiumPlan = MAINTENANCE_PLANS.find((p) => p.id === 'premium')!

      const extraPages = 3
      const totalPages = essentielPack.pagesIncluded + extraPages

      const result = calculateQuotePrice({
        packId: 'essentiel',
        pages: totalPages,
        optionIds: ['seo', 'blog'],
        maintenance: 'premium',
      })

      expect(result.basePrice).toBe(essentielPack.basePrice)
      expect(result.extraPagesPrice).toBe(extraPages * PRICE_PER_EXTRA_PAGE)
      expect(result.optionsPrice).toBe(seoOption.price + blogOption.price)
      expect(result.maintenancePrice).toBe(premiumPlan.pricePerMonth)
      expect(result.totalPrice).toBe(
        essentielPack.basePrice +
          extraPages * PRICE_PER_EXTRA_PAGE +
          seoOption.price +
          blogOption.price
      )
    })

    it('should handle maximum configuration', () => {
      const completPack = PRICING_PACKS.find((p) => p.id === 'complet')!
      const allOptionIds = PRICING_OPTIONS.map((o) => o.id)
      const totalOptionsPrice = PRICING_OPTIONS.reduce(
        (sum, o) => sum + o.price,
        0
      )
      const premiumPlan = MAINTENANCE_PLANS.find((p) => p.id === 'premium')!

      const extraPages = 20
      const totalPages = completPack.pagesIncluded + extraPages

      const result = calculateQuotePrice({
        packId: 'complet',
        pages: totalPages,
        optionIds: allOptionIds,
        maintenance: 'premium',
      })

      expect(result.basePrice).toBe(completPack.basePrice)
      expect(result.extraPagesPrice).toBe(extraPages * PRICE_PER_EXTRA_PAGE)
      expect(result.optionsPrice).toBe(totalOptionsPrice)
      expect(result.maintenancePrice).toBe(premiumPlan.pricePerMonth)
      expect(result.totalPrice).toBe(
        completPack.basePrice +
          extraPages * PRICE_PER_EXTRA_PAGE +
          totalOptionsPrice
      )
    })

    it('should handle minimum configuration', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: '',
      })

      expect(result.basePrice).toBe(starterPack.basePrice)
      expect(result.extraPagesPrice).toBe(0)
      expect(result.optionsPrice).toBe(0)
      expect(result.maintenancePrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack.basePrice)
    })
  })

  describe('Edge cases', () => {
    it('should return zero prices for invalid pack ID', () => {
      const result = calculateQuotePrice({
        packId: 'invalid-pack',
        pages: 5,
        optionIds: ['seo'],
        maintenance: 'pro',
      })

      expect(result.basePrice).toBe(0)
      expect(result.extraPagesPrice).toBe(0)
      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(0)
      expect(result.maintenancePrice).toBe(0)
    })

    it('should handle negative pages gracefully', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: -5,
        optionIds: [],
        maintenance: '',
      })

      // Should not charge for negative extra pages
      expect(result.extraPagesPrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack.basePrice)
    })

    it('should handle empty options array', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: '',
      })

      expect(result.optionsPrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack.basePrice)
    })

    it('should handle invalid maintenance ID', () => {
      const starterPack = PRICING_PACKS.find((p) => p.id === 'starter')!

      const result = calculateQuotePrice({
        packId: 'starter',
        pages: 1,
        optionIds: [],
        maintenance: 'invalid-maintenance' as any,
      })

      expect(result.maintenancePrice).toBe(0)
      expect(result.totalPrice).toBe(starterPack.basePrice)
    })
  })
})

describe('getMaintenancePlanDetails', () => {
  it('should return correct plan for valid ID', () => {
    const plan = getMaintenancePlanDetails('basic')
    expect(plan).toBeDefined()
    expect(plan?.id).toBe('basic')
  })

  it('should return undefined for invalid ID', () => {
    const plan = getMaintenancePlanDetails('invalid-id')
    expect(plan).toBeUndefined()
  })

  it('should return all plan properties', () => {
    const plan = getMaintenancePlanDetails('premium')
    expect(plan).toBeDefined()
    expect(plan).toHaveProperty('id')
    expect(plan).toHaveProperty('name')
    expect(plan).toHaveProperty('pricePerMonth')
    expect(plan).toHaveProperty('features')
  })
})

describe('getPackDetails', () => {
  it('should return correct pack for valid ID', () => {
    const pack = getPackDetails('essentiel')
    expect(pack).toBeDefined()
    expect(pack?.id).toBe('essentiel')
  })

  it('should return undefined for invalid ID', () => {
    const pack = getPackDetails('invalid-id')
    expect(pack).toBeUndefined()
  })

  it('should return all pack properties', () => {
    const pack = getPackDetails('starter')
    expect(pack).toBeDefined()
    expect(pack).toHaveProperty('id')
    expect(pack).toHaveProperty('name')
    expect(pack).toHaveProperty('basePrice')
    expect(pack).toHaveProperty('pagesIncluded')
    expect(pack).toHaveProperty('features')
  })
})

describe('getOptionDetails', () => {
  it('should return correct option for valid ID', () => {
    const option = getOptionDetails('seo')
    expect(option).toBeDefined()
    expect(option?.id).toBe('seo')
  })

  it('should return undefined for invalid ID', () => {
    const option = getOptionDetails('invalid-id')
    expect(option).toBeUndefined()
  })

  it('should return all option properties', () => {
    const option = getOptionDetails('blog')
    expect(option).toBeDefined()
    expect(option).toHaveProperty('id')
    expect(option).toHaveProperty('name')
    expect(option).toHaveProperty('price')
    expect(option).toHaveProperty('description')
  })
})
