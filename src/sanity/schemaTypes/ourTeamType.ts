import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const ourTeamType = defineType({
  name: 'ourTeam',
  title: 'Team Member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'altText',
        },
      },
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      description:
        'Brief description of the image for accessibility and SEO. This text will be read by screen readers and is important for users with visual impairments.',
      type: 'string',
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'website',
      title: 'Personal Website URL',
      type: 'url',
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      options: {
        list: [
          { title: 'Operations & Marketing', value: 'operations_marketing' },
          { title: 'Technical', value: 'technical' },
          { title: 'Creatives', value: 'creatives' },
          { title: 'Outreach', value: 'outreach' },
          { title: 'Sponsorship', value: 'sponsorship' },
          { title: 'Leadership', value: 'leadership' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isPresident',
      title: 'Is President',
      description: 'Check if this person is the President of the club',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isVicePresident',
      title: 'Is Vice President',
      description: 'Check if this person is the Vice President of the club',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isAdvisor',
      title: 'Is Advisor',
      description: 'Check if this person is an advisor to the club',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'advisorRole',
      title: 'Advisor Role',
      description:
        'Role as an advisor (e.g., Advisory Head, Technical Advisor)',
      type: 'string',
      hidden: ({ document }) => !document?.isAdvisor,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description:
        'Lower numbers appear first. Use this to control the order of team members within their domain. The default value is 100.',
      type: 'number',
      initialValue: 100,
      validation: Rule => Rule.integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
      domain: 'domain',
      isAdvisor: 'isAdvisor',
      advisorRole: 'advisorRole',
    },
    prepare({ title, subtitle, media, domain, isAdvisor, advisorRole }) {
      const displayRole = isAdvisor ? advisorRole || subtitle : subtitle;
      const displayType = isAdvisor ? 'Advisor' : domain;

      return {
        title,
        subtitle: `${displayRole} (${displayType})`,
        media,
      };
    },
  },
});
