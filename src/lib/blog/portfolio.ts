export interface UnifiedProject {
  slug: string
  title: string
  category: string
  description: string
  challenge: string
  solution: string
  results: string[]
  features: string[]
  icon: string
  deliveryTime: string
  mainImage?: string
  gallery?: string[]
  order?: number
  _source: 'static'
}

const staticProjects: UnifiedProject[] = []

export async function getAllProjects(): Promise<UnifiedProject[]> {
  return staticProjects.sort((a, b) => {
    const orderA = a.order ?? 999
    const orderB = b.order ?? 999
    return orderA - orderB
  })
}

export async function getProjectBySlug(slug: string): Promise<UnifiedProject | null> {
  return staticProjects.find((p) => p.slug === slug) || null
}
