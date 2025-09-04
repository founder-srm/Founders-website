import { MdOutlineCampaign } from 'react-icons/md';
import { defineField, defineType } from 'sanity';

export const bannerHeaderType = defineType({
  name: 'bannerHeader',
  type: 'document',
  title: 'Banner Header',
  icon: MdOutlineCampaign,
  fields: [
    defineField({
      name: 'isVisible',
      type: 'boolean',
      title: 'Show Banner',
      description: 'Toggle to show/hide the banner',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required().max(50),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: Rule => Rule.required().max(100),
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
    }),
    defineField({
      name: 'buttonLink',
      type: 'string',
      title: 'Button Link',
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
      title: 'Updated At',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
      title: 'Event End Date',
      description: 'When should the countdown end?',
      validation: Rule => Rule.required(),
    }),
  ],
});
