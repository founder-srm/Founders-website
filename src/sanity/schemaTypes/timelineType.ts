import { defineType, defineField } from 'sanity';
import { FaStream } from 'react-icons/fa';

export const timelineType = defineType({
  name: 'timeline',
  type: 'document',
  title: 'Timeline',
  icon: FaStream,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Main Title',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Primary Button Text',
    }),
    defineField({
      name: 'buttonLink',
      type: 'string',
      title: 'Primary Button Link',
    }),
    defineField({
      name: 'secondaryButtonText',
      type: 'string',
      title: 'Secondary Button Text',
    }),
    defineField({
      name: 'secondaryButtonLink',
      type: 'string',
      title: 'Secondary Button Link',
    }),
    defineField({
      name: 'showSecondaryButton',
      type: 'boolean',
      title: 'Show Secondary Button',
      initialValue: true,
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Timeline Items',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                }
              ]
            },
          ],
        },
      ],
    }),
  ],
});
