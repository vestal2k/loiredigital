import type { QuoteOptions, QuoteCalculation } from '@/types/quote'
import {
  PRICING_PACKS,
  PRICING_OPTIONS,
  PRICE_PER_EXTRA_PAGE,
  MAINTENANCE_PLANS,
} from '@/config/pricing'

export function calculateQuotePrice(options: QuoteOptions): QuoteCalculation {
  const pack = PRICING_PACKS.find((p) => p.id === options.packId)

  if (!pack) {
    return {
      basePrice: 0,
      extraPagesPrice: 0,
      optionsPrice: 0,
      totalPrice: 0,
      maintenancePrice: 0,
    }
  }

  const basePrice = pack.basePrice

  const extraPages = Math.max(0, options.pages - pack.pagesIncluded)
  const extraPagesPrice = extraPages * PRICE_PER_EXTRA_PAGE

  let optionsPrice = 0
  options.optionIds.forEach((optionId) => {
    const option = PRICING_OPTIONS.find((o) => o.id === optionId)
    if (option) {
      optionsPrice += option.price
    }
  })

  const totalPrice = basePrice + extraPagesPrice + optionsPrice

  const maintenancePlan = MAINTENANCE_PLANS.find((p) => p.id === options.maintenance)
  const maintenancePrice = maintenancePlan ? maintenancePlan.pricePerMonth : 0

  return {
    basePrice,
    extraPagesPrice,
    optionsPrice,
    totalPrice,
    maintenancePrice,
  }
}

export function getMaintenancePlanDetails(maintenanceId: string) {
  return MAINTENANCE_PLANS.find((p) => p.id === maintenanceId)
}

export function getPackDetails(packId: string) {
  return PRICING_PACKS.find((p) => p.id === packId)
}

export function getOptionDetails(optionId: string) {
  return PRICING_OPTIONS.find((o) => o.id === optionId)
}
