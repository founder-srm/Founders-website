import { defineType, defineField } from 'sanity';
import { FaBookOpen } from 'react-icons/fa';

export const ourStoryType = defineType({
  name: 'ourStory',
  type: 'document',
  title: 'Our Story',
  icon: FaBookOpen,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainContent',
      type: 'text',
      title: 'Main Content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'secondaryContent',
      type: 'text',
      title: 'Secondary Content',
    }),
    defineField({
      name: 'workplaceTitle',
      type: 'string',
      title: 'Workplace Title',
    }),
    defineField({
      name: 'workplaceContent',
      type: 'text',
      title: 'Workplace Content',
    }),
    defineField({
      name: 'workplaceSecondaryContent',
      type: 'text',
      title: 'Workplace Secondary Content',
    }),
    defineField({
      name: 'images',
      type: 'object',
      fields: [
        {
          name: 'image1',
          type: 'image',
          title: 'Image 1',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
        {
          name: 'image2',
          type: 'image',
          title: 'Image 2',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
        {
          name: 'image3',
          type: 'image',
          title: 'Image 3',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
        {
          name: 'image4',
          type: 'image',
          title: 'Image 4',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
        {
          name: 'image5',
          type: 'image',
          title: 'Image 5',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
        {
          name: 'image6',
          type: 'image',
          title: 'Image 6',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'altText',
            },
          },
        },
      ],
    }),
  ],
});
