import { defineType, defineField } from 'sanity';

export const ctaType = defineType({
  name: 'cta',
  type: 'document',
  title: 'Call to Action',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonText',
      type: 'string',
      title: 'Primary Button Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonLink',
      type: 'url',
      title: 'Primary Button Link',
    }),
    defineField({
      name: 'secondaryButtonText',
      type: 'string',
      title: 'Secondary Button Text',
    }),
    defineField({
      name: 'secondaryButtonLink',
      type: 'url',
      title: 'Secondary Button Link',
    }),
    defineField({
      name: 'variant',
      type: 'boolean',
      title: 'Variant',
      initialValue: false,
    }),
    defineField({
      name: 'activateSecondaryButton',
      type: 'boolean',
      title: 'Activate Secondary Button',
      initialValue: true,
    }),
    defineField({
      name: 'showCTA',
      type: 'boolean',
      title: 'Show CTA',
      initialValue: true,
    }),
  ],
});
