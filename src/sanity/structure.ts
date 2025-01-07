import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = S =>
  S.list()
    .title('FC Website Content')
    .items([
      S.divider(),
      // Hero Section
      S.listItem()
        .title('Hero Section')
        .child(
          S.list()
            .title('Hero Section')
            .items([
              S.documentTypeListItem('heroComponent').title('Hero Component'),
            ])
        ),

      S.divider(),

      // Career section
      S.listItem()
        .title('Careers')
        .child(
          S.list()
            .title('Careers')
            .items([
              S.documentTypeListItem('jobCategory').title('Job Categories'),
            ])
        ),

      // Features section
      S.listItem()
        .title('Features')
        .child(
          S.list()
            .title('Features')
            .items([S.documentTypeListItem('feature').title('Features')])
        ),

      // Help section
      S.listItem()
        .title('Help')
        .child(
          S.list()
            .title('Help')
            .items([S.documentTypeListItem('faq').title('FAQs')])
        ),

      S.divider(),

      // Marketing section
      S.listItem()
        .title('Marketing')
        .child(
          S.list()
            .title('Marketing')
            .items([
              S.documentTypeListItem('cta').title('Call to Actions'),
              S.documentTypeListItem('event').title('Events & Webinars'),
            ])
        ),

      // Show remaining document types
      S.divider(),
      ...S.documentTypeListItems().filter(
        item =>
          item.getId() &&
          ![
            'post',
            'category',
            'author',
            'jobCategory',
            'feature',
            'faq',
            'cta',
            'event',
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
          ].includes(item.getId()!)
      ),
    ]);
