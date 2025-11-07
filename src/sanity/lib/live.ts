// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { client } from './client';
import { token } from '../env';
import { defineLive } from 'next-sanity';

export const { sanityFetch, SanityLive } = defineLive({
  client: client,
  serverToken: token,
  browserToken: token,
});
