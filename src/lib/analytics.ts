declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}

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

export function trackEvent(eventName: EventName, properties?: EventProperties) {
  try {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(eventName, properties)
    }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

export function trackCTAClick(ctaLabel: string, location: string) {
  trackEvent('cta_click', {
    label: ctaLabel,
    location: location,
  })
}

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

export function trackContactFormSubmit(formType: 'contact' | 'quote') {
  trackEvent('contact_form_submitted', {
    form_type: formType,
  })
}

export function trackPackSelection(packId: string, packName: string) {
  trackEvent('pack_selected', {
    pack_id: packId,
    pack_name: packName,
  })
}

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

export function trackMaintenanceSelection(
  maintenanceId: string,
  maintenanceName: string
) {
  trackEvent('maintenance_selected', {
    maintenance_id: maintenanceId,
    maintenance_name: maintenanceName,
  })
}

export function trackPaymentInitiated(amount: number, projectId: string) {
  trackEvent('payment_initiated', {
    amount: amount,
    project_id: projectId,
  })
}

export function trackSectionView(sectionId: string, sectionName: string) {
  trackEvent('section_viewed', {
    section_id: sectionId,
    section_name: sectionName,
  })
}

export function trackCrispOpened() {
  trackEvent('crisp_opened', {
    timestamp: Date.now(),
  })
}

export function trackPDFDownload(documentType: 'quote' | 'invoice') {
  trackEvent('pdf_downloaded', {
    document_type: documentType,
  })
}
