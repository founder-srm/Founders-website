import { LinkIcon } from 'lucide-react';
import { defineType } from 'sanity';

export const linkTreeType = defineType({
  name: 'linktree',
  title: 'Club Link Tree',
  type: 'document',
  icon: LinkIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
    { name: 'meta', title: 'Meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Founders Club Links',
      validation: r => r.required(),
      group: 'content',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Keep as "club" unless you have a special routing need.',
      options: {
        source: 'title',
        maxLength: 64,
        slugify: input =>
          (input || 'club')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'club',
      },
      initialValue: { current: 'club' },
      validation: r => r.required(),
      group: 'meta',
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'content',
    },
    {
      name: 'avatar',
      title: 'Primary Logo / Artwork',
      type: 'image',
      options: { hotspot: true },
      group: 'display',
    },
    {
      name: 'themeColor',
      title: 'Theme Accent Color',
      type: 'string',
      description: 'CSS color (e.g. #0ea5e9 or hsl(var(--primary))).',
      initialValue: '#1d1f29',
      group: 'display',
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'content',
      of: [
        {
          name: 'linkItem',
          title: 'Link Item',
          type: 'object',
          preview: {
            select: { title: 'label', subtitle: 'platform' },
            prepare: ({ title, subtitle }) => ({
              title,
              subtitle: subtitle ? subtitle.toUpperCase() : 'CUSTOM',
            }),
          },
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: r => r.required(),
            },
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Dribbble', value: 'dribbble' },
                  { title: 'DeviantArt', value: 'deviantart' },
                  { title: 'Figma', value: 'figma' },
                  { title: 'BeeFree', value: 'beefree' },
                  { title: 'Custom', value: 'custom' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: r =>
                r.required().uri({ allowRelative: false, scheme: ['http', 'https'] }),
            },
            {
              name: 'iconOverride',
              title: 'Override Icon (optional)',
              type: 'string',
              description:
                'Name of a lucide-react icon (PascalCase) if you want to override platform icon.',
            },
            {
              name: 'highlight',
              title: 'Highlight',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'pinned',
              title: 'Pinned (Top)',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Lower numbers appear first (after pinned).',
            },
            {
              name: 'active',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
      validation: r => r.min(1),
    },
    {
      name: 'draftNote',
      title: 'Internal Notes',
      type: 'text',
      group: 'meta',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'avatar',
      subtitle: 'slug.current',
    },
    prepare: ({ title, media, subtitle }) => ({
      title: title || 'Club Link Tree',
      media,
      subtitle: subtitle ? `/${subtitle}` : '/club',
    }),
  },
  // Optional: enforce only one document via initialValue or using structure (see below).
});