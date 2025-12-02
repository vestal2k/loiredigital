/**
 * Analytics utilities for tracking user events
 * Uses Vercel Analytics for tracking
 */

import { track } from '@vercel/analytics'

export type EventName =
  | 'cta_click'
  | 'quote_requested'
  | 'contact_form_submitted'
  | 'pack_selected'
  | 'option_selected'
  | 'maintenance_selected'
  | 'payment_initiated'
  | 'section_viewed'
  | 'crisp_opened'
  | 'pdf_downloaded'

interface EventProperties {
  [key: string]: string | number | boolean
}

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param properties - Optional properties to attach to the event
 */
export function trackEvent(eventName: EventName, properties?: EventProperties) {
  try {
    if (typeof window !== 'undefined') {
      track(eventName, properties)
    }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(ctaLabel: string, location: string) {
  trackEvent('cta_click', {
    label: ctaLabel,
    location: location,
  })
}

/**
 * Track quote requests
 */
export function trackQuoteRequest(
  packId: string,
  totalPrice: number,
  options: string[]
) {
  trackEvent('quote_requested', {
    pack_id: packId,
    total_price: totalPrice,
    options_count: options.length,
    has_options: options.length > 0,
  })
}

/**
 * Track contact form submissions
 */
export function trackContactFormSubmit(formType: 'contact' | 'quote') {
  trackEvent('contact_form_submitted', {
    form_type: formType,
  })
}

/**
 * Track pack selection in calculator
 */
export function trackPackSelection(packId: string, packName: string) {
  trackEvent('pack_selected', {
    pack_id: packId,
    pack_name: packName,
  })
}

/**
 * Track option selection in calculator
 */
export function trackOptionSelection(
  optionId: string,
  optionName: string,
  selected: boolean
) {
  trackEvent('option_selected', {
    option_id: optionId,
    option_name: optionName,
    selected: selected,
  })
}

/**
 * Track maintenance plan selection
 */
export function trackMaintenanceSelection(
  maintenanceId: string,
  maintenanceName: string
) {
  trackEvent('maintenance_selected', {
    maintenance_id: maintenanceId,
    maintenance_name: maintenanceName,
  })
}

/**
 * Track payment initiation
 */
export function trackPaymentInitiated(amount: number, projectId: string) {
  trackEvent('payment_initiated', {
    amount: amount,
    project_id: projectId,
  })
}

/**
 * Track section views (for scroll depth tracking)
 */
export function trackSectionView(sectionId: string, sectionName: string) {
  trackEvent('section_viewed', {
    section_id: sectionId,
    section_name: sectionName,
  })
}

/**
 * Track Crisp chat opening
 */
export function trackCrispOpened() {
  trackEvent('crisp_opened', {
    timestamp: Date.now(),
  })
}

/**
 * Track PDF downloads
 */
export function trackPDFDownload(documentType: 'quote' | 'invoice') {
  trackEvent('pdf_downloaded', {
    document_type: documentType,
  })
}
