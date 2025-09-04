import { MdWorkOutline } from 'react-icons/md';
import { defineField, defineType } from 'sanity';

export const jobCategoryType = defineType({
  name: 'jobCategory',
  type: 'document',
  title: 'Job Category',
  icon: MdWorkOutline,
  fields: [
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
    }),
    defineField({
      name: 'openings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Job Title' },
            { name: 'location', type: 'string', title: 'Location' },
            { name: 'link', type: 'url', title: 'Link' },
          ],
        },
      ],
    }),
  ],
});
