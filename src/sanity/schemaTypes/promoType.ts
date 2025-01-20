
import { defineType, defineField } from 'sanity';

export const promoType = defineType({
  name: 'promo',
  type: 'document',
  title: 'Promo',
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
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
    }),
    defineField({
      name: 'buttonLink',
      type: 'url',
      title: 'Button Link',
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
      title: 'Start Date',
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
      title: 'End Date',
    }),
    defineField({
      name: 'isVisible',
      type: 'boolean',
      title: 'Is Visible',
      initialValue: true,
    }),
  ],
});