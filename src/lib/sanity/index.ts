// Central export for Sanity configuration and utilities
export {
  sanityClient,
  sanityWriteClient,
  urlForImage,
  imageBuilder,
  getBlogPosts,
  getBlogPost,
  getProjects,
  getProject
} from './client'

export type {
  SanityBlogPost,
  SanityProject
} from './client'

// Export queries
export * from './queries'
