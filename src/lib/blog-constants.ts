// Blog post configuration constants
export const BLOG_POST_TAGS = [
  'SuccessStories',
  'StudentEntrepreneurs',
  'TechInnovation',
  'StartupTips',
  'Technical',
  'Projects',
  'Hackathons',
  'Foundathon',
  'Ideathon',
  'OpenHouse',
  'Other'
] as const;

export type BlogPostTag = typeof BLOG_POST_TAGS[number];

// Utility function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Get all available blog post tags
export function getBlogPostTags(): BlogPostTag[] {
  return [...BLOG_POST_TAGS];
}
