// Central export for Stripe configuration and utilities
export { stripe } from './client'

export type { PaymentProduct, CreateCheckoutSessionParams } from './client'

export {
  createCheckoutSession,
  getCheckoutSession,
  createBalancePaymentLink,
  getPaymentStatus
} from './client'

// Export products utilities
export * from './products'
