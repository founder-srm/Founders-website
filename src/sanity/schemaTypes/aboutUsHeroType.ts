// export interface aboutValues {
//     icon: string;
//     title: string;
//     description: string;
//   }
//   export interface AboutHeroSection {
//     _id: string;
//     _createdAt: string;
//     title: string;
//     subTitle: string;
//     bannerImage: {
//       asset: {
//         _ref: string;
//         _type: string;
//       };
//     }
//     ourMission: string;
//     secondaryHeading: string;
//     secondarySubHeading: string;
//     ourValues: aboutValues[];
//     aboutUsCta: {
//       title: string;
//       ctaBannerImage: {
//         asset: {
//           _ref: string;
//           _type: string;
//         };
//       };
//       subTitle: string;
//     }
//   }

import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutUsHeroType = defineType({
    name: 'aboutUsHero',
    title: 'About Us Hero Component Content',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        type: 'string',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'subTitle',
        type: 'string',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'bannerImage',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'ourMission',
        type: 'string',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'secondaryHeading',
        type: 'string',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'secondarySubHeading',
        type: 'string',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'ourValues',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'aboutValues',
          }),
        ],
        validation: Rule => Rule.required().info('3 only! Not more, not less').min(3).max(3),
      }),
      defineField({
        name: 'aboutUsCtaComponent',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'aboutUsCta',
          }),
        ],
        validation: Rule => Rule.required(),
      }),
    ],
});

export const aboutUsCtaType = defineType({
    name: 'aboutUsCta',
    title: 'About Us CTA',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'ctaBannerImage',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'subTitle',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
    ],
});

export const aboutValuesType = defineType({
    name: 'aboutValues',
    title: 'About Us Values',
    type: 'object',
    fields: [
        defineField({
            name: 'icon',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'title',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            type: 'text',
            validation: Rule => Rule.required(),
        }),
    ],
});