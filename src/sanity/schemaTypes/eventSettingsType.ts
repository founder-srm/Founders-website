import { RiSettings3Line } from 'react-icons/ri';
import { defineField, defineType } from 'sanity';

export const eventSettingsType = defineType({
  name: 'eventSettings',
  type: 'document',
  title: 'Writeup Settings',
  icon: RiSettings3Line,
  fields: [
    defineField({
      name: 'featuredEvent',
      type: 'reference',
      title: 'Featured Event',
      description: 'Select which event should be featured on the events page',
      to: [{ type: 'event' }],
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Event Writeup Settings',
        subtitle: 'Configure featured event',
      };
    },
  },
});
