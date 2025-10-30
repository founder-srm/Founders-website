import type { SchemaTypeDefinition } from 'sanity';
import {
  aboutUsCtaType,
  aboutUsHeroType,
  aboutValuesType,
} from './aboutUsHeroType';
import { authorType } from './authorType';
import { bannerHeaderType } from './bannerHeaderType';
import { blockContentType } from './blockContentType';
import { blogPostType } from './blogPostType';
import { categoryType } from './categoryType';
import { contactUsType } from './contactUsType';
import { ctaType } from './ctaType';
import { eventType } from './eventType';
import { faqType } from './faqType';
import { featureType } from './featureType';
import { heroComponentType } from './heroComponentType';
import { jobCategoryType } from './jobCategoryType';
import { linkTreeType } from './linkTreeType';
import { ourStoryType } from './ourStoryType';
import { ourTeamType } from './ourTeamType';
import { postType } from './postType';
import { testimonialType } from './testimonialType';
import { timelineType } from './timelineType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    blogPostType,
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
    timelineType,
    bannerHeaderType,
    contactUsType,
    ourTeamType,
    linkTreeType,
  ],
};
