import { RiSettings4Line } from 'react-icons/ri';
import { defineField, defineType } from 'sanity';

export const featureType = defineType({
  name: 'feature',
  type: 'document',
  title: 'Feature',
  icon: RiSettings4Line,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon (optional)',
    }),
  ],
});
