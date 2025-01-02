import { defineQuery } from 'next-sanity';

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

export const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(published desc)[0...3]{
  _id,
  _createdAt,
  id,
  title,
  summary,
  image,
  label,
  author,
  published,
  href,
  "slug": slug.current
}`);

export const ALL_EVENTS_QUERY = defineQuery(`*[_type == "event"] {
  _id,
  _createdAt,
  title,
  summary,
  "slug": slug.current,
  image,
  label,
  author,
  published,
  href
}`);

export const EVENT_BY_SLUG_QUERY = defineQuery(`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  summary,
  content,
  "slug": slug.current,
  image,
  label,
  author,
  published,
  href
}`);
