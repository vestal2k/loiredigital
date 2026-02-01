const QUOTE_STORAGE_KEY = 'loire-digital-quote-data'

export interface StoredQuoteData {
  packId: string
  packName: string
  pages: number
  optionIds: string[]
  optionNames: string[]
  maintenance: string
  maintenanceName: string
  totalPrice: number
  maintenancePrice: number
  timestamp: number
}

export function saveQuoteData(data: StoredQuoteData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(data))
}

export function getQuoteData(): StoredQuoteData | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(QUOTE_STORAGE_KEY)
  if (!stored) return null

  try {
    const data = JSON.parse(stored) as StoredQuoteData

    const oneHour = 60 * 60 * 1000
    if (Date.now() - data.timestamp > oneHour) {
      clearQuoteData()
      return null
    }

    return data
  } catch {
    clearQuoteData()
    return null
  }
}

export function clearQuoteData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(QUOTE_STORAGE_KEY)
}
