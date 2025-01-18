import { MdOutlineUpcoming } from 'react-icons/md';
import { defineType, defineField } from 'sanity';


export const upcompingEventsHeaderType = defineType({
  name: 'upcomingEventsHeader',
  type: 'document',
  title: 'Upcoming Events Header',
  icon: MdOutlineUpcoming,
  fields: [
    defineField({
      name: 'badge',
      type: 'string',
      title: 'Badge',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: Rule => Rule.required(),
    }),
  ],
});
