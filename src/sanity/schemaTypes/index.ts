import type { SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { categoryType } from './categoryType';
import { postType } from './postType';
import { authorType } from './authorType';
import { jobCategoryType } from './jobCategoryType';
import { featureType } from './featureType';
import { faqType } from './faqType';
import { ctaType } from './ctaType';
import { eventType } from './eventType';
import { heroComponentType } from './heroComponentType';
import {
  aboutUsCtaType,
  aboutUsHeroType,
  aboutValuesType,
} from './aboutUsHeroType';
import { testimonialType } from './testimonialType';
import { ourStoryType } from './ourStoryType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    jobCategoryType,
    featureType,
    faqType,
    ctaType,
    heroComponentType,
    eventType,
    testimonialType,
    aboutUsHeroType,
    aboutValuesType,
    aboutUsCtaType,
    ourStoryType,
  ],
};
