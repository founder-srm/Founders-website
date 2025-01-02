import { createClient } from '@sanity/client';

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-10-31',
  useCdn: false,
});
