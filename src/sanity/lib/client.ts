import { createClient } from '@sanity/client';

import { apiVersion, dataset, projectId, token } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
});
