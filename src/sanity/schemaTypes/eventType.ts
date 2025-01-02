import { defineType, defineField } from 'sanity';

export const eventType = defineType({
  name: 'event',
  type: 'document',
  title: 'Event',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Event Type',
      options: {
        list: [
          { title: 'Webinar', value: 'webinar' },
          { title: 'Conference', value: 'conference' },
          { title: 'Workshop', value: 'workshop' },
        ],
      },
    }),
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
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
    defineField({
      name: 'href',
      type: 'url',
      title: 'Registration Link',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{ type: 'block' }],
    }),
  ],
});
