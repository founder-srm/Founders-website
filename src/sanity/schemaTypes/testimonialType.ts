import { RiSpeakAiLine } from 'react-icons/ri';
import { defineField, defineType } from 'sanity';

export const testimonialType = defineType({
  name: 'testimonial',
  type: 'document',
  title: 'testimonial',
  icon: RiSpeakAiLine,
  fields: [
    defineField({
      name: 'quote',
      type: 'string',
      title: 'Quote',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'published',
      type: 'datetime',
      title: 'Published Date',
    }),
  ],
});
