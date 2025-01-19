import { defineQuery } from 'next-sanity';

export const ABOUT_HERO_QUERY = defineQuery(`*[_type == "aboutUsHero"][0]{
  _id,
  _createdAt,
  title,
  subTitle,
  bannerImage,
  ourMission,
  secondaryHeading,
  secondarySubHeading,
  ourValues,
  aboutUsCtaComponent
}`);

export const UPCOMING_HEADER_QUERY =
  defineQuery(`*[_type == "upcomingEventsHeader"][0]{
  _id,
  _createdAt,
  badge,
  title,
  description
}`);

export const CTA_QUERY = defineQuery(`*[_type == "cta"]{
  _id,
  _createdAt,
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  variant,
  activateSecondaryButton,
  showCTA
}`);

export const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial"]{
  _id,
  _createdAt,
  quote,
  author->{
    name,
    title,
    slug,
    image,
    bio
  },
  published
}`);

export const JOBS_QUERY = defineQuery(`*[_type == "jobCategory"]{
  _id,
  _createdAt,
  category,
  openings[]{
    title,
    location,
    link
  }
}`);

export const FEATURES_QUERY = defineQuery(`*[_type == "feature"]{
  _id,
  _createdAt,
  title,
  description,
  icon
}`);

export const FAQS_QUERY = defineQuery(`*[_type == "faq"]{
  _id,
  _createdAt,
  question,
  answer
}`);

export const EVENTS_QUERY =
  defineQuery(`*[_type == "event"] | order(published desc)[0...3]{
  _id,
  _createdAt,
  title,
  summary,
  image,
  label,
  author->{
    name,
    title,
    slug,
    image,
    bio
  },
  published,
  href,
  "slug": slug.current
}`);

export const ALL_EVENTS_QUERY = defineQuery(`*[_type == "event"] {
  _id,
  _createdAt,
  title,
  summary,
  image,
  type,
  label,
  author->{
    name,
    title,
    slug,
    image,
    bio
  },
  published,
  href,
  "slug": slug.current
}`);

export const EVENT_BY_SLUG_QUERY =
  defineQuery(`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  summary,
  content,
  image,
  type,
  label,
  author->{
    name,
    title,
    image
  },
  published,
  href,
  "slug": slug.current
}`);

export const HERO_QUERY = defineQuery(`*[_type == "heroComponent"][0]{
    _id,
    _createdAt,
    title,
    subtitle,
    buttonText,
    buttonLink,
    showButton,
    image1,
    image2,
    image3,
    image4
}`);

export const OUR_STORY_QUERY = defineQuery(`*[_type == "ourStory"][0]{
  _id,
  _createdAt,
  title,
  mainContent,
  secondaryContent,
  workplaceTitle,
  workplaceContent,
  workplaceSecondaryContent,
  images
}`);

export const TIMELINE_QUERY = defineQuery(`*[_type == "timeline"][0]{
  _id,
  _createdAt,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  showSecondaryButton,
  items[]{
    title,
    description,
    image
  }
}`);
