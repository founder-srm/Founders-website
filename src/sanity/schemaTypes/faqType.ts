import { defineType, defineField } from 'sanity';
import { RiQuestionLine } from 'react-icons/ri';

export const faqType = defineType({
  name: 'faq',
  type: 'document',
  title: 'FAQ',
  icon: RiQuestionLine,
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Question',
    }),
    defineField({
      name: 'answer',
      type: 'text',
      title: 'Answer',
    }),
  ],
});
