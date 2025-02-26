import { defineField, defineType } from 'sanity';
import { MobileDeviceIcon } from '@sanity/icons';

export const contactUsType = defineType({
  name: 'contactUs',
  title: 'Contact Us Page',
  type: 'document',
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'expectationsTitle',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'expectations',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'formTitle',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'formSubtitle',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'submitButtonText',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'thankYouMessage',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members for Avatar Group',
      type: 'array',
      of: [
        defineField({
          name: 'author',
          type: 'reference',
          to: [{ type: 'author' }],
        }),
      ],
      validation: Rule => Rule.max(3).error('You can select up to 3 team members'),
      description: 'Select up to 3 team members to display in the avatar group',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Contact Us',
      };
    },
  },
});
