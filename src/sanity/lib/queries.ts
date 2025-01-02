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
  variant
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

export const EVENTS_QUERY = defineQuery(`*[_type == "event"]{
  _id,
  _createdAt,
  id,
  title,
  summary,
  image,
  label,
  author,
  published,
  href
}`);
