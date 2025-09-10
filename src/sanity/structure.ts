import { contextDocumentTypeName } from '@sanity/assist';
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = S =>
  S.list()
    .title('FC Website Content')
    .showIcons(true)
    .items([
      S.divider(),
      S.listItem()
        .title('Home Page')
        .child(
          S.list()
            .title('Home Page Components')
            .showIcons(false)
            .items([
              S.listItem()
                .title('Banner')
                .child(
                  S.list()
                    .title('Banner')
                    .items([
                      S.documentTypeListItem('bannerHeader').title('Banner'),
                    ])
                ),
              S.listItem()
                .title('Hero Section')
                .child(
                  S.list()
                    .title('Hero Section')
                    .items([
                      S.documentTypeListItem('heroComponent').title(
                        'Hero Component'
                      ),
                    ])
                ),
              S.listItem()
                .title('Features Section')
                .child(
                  S.list()
                    .title('Features')
                    .items([
                      S.documentTypeListItem('feature').title('Features'),
                    ])
                ),
              S.listItem()
                .title('Testimonials Section')
                .child(
                  S.list()
                    .title('Testimonials')
                    .items([
                      S.documentTypeListItem('testimonial').title(
                        'Testimonial'
                      ),
                    ])
                ),
              S.listItem()
                .title('Help Section')
                .child(
                  S.list()
                    .title('Frequency Asked Questions')
                    .items([S.documentTypeListItem('faq').title('FAQs')])
                ),
              S.listItem()
                .title('Call to Action Section')
                .child(
                  S.list()
                    .title('Call to Action')
                    .items([
                      S.documentTypeListItem('cta').title('Call to Actions'),
                    ])
                ),
            ])
        ),
      S.listItem()
        .title('About Us Page')
        .child(
          S.list()
            .title('About Us Components')
            .showIcons(false)
            .items([
              S.listItem()
                .title('About Us Components')
                .child(
                  S.list()
                    .title('About Us Hero Section')
                    .items([
                      S.documentTypeListItem('aboutUsHero').title(
                        'About Us Hero'
                      ),
                    ])
                ),
              S.listItem()
                .title('Our Story Section')
                .child(
                  S.list()
                    .title('Our Story')
                    .items([
                      S.documentTypeListItem('ourStory').title('Our Story'),
                    ])
                ),
              S.listItem()
                .title('Timeline Section')
                .child(
                  S.list()
                    .title('Timeline')
                    .items([
                      S.documentTypeListItem('timeline').title('Timeline'),
                    ])
                ),
              S.listItem()
                .title('Careers Section')
                .child(
                  S.list()
                    .title('Careers Section')
                    .items([
                      S.documentTypeListItem('jobCategory').title(
                        'Job Categories'
                      ),
                    ])
                ),
            ])
        ),
      S.listItem()
        .title('Teams Page')
        .child(
          S.list()
            .title('Teams Page')
            .items([S.documentTypeListItem('ourTeam').title('Team Members')])
        ),
      S.listItem()
        .title('Events Page')
        .child(
          S.list()
            .title('Events Page')
            .items([S.documentTypeListItem('event').title('Event Writeups')])
        ),
      S.listItem()
        .title('Contact Us Page')
        .child(
          S.list()
            .title('Contact Us Page')
            .items([
              S.listItem()
                .title('Contact Us Page')
                .child(
                  S.list()
                    .title('Contact Us Page')
                    .items([
                      S.documentTypeListItem('contactUs').title(
                        'Contact Us Content'
                      ),
                    ])
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Club Link Hub')
        .child(
          S.list()
            .title('Link Tree')
            .items([S.documentTypeListItem('linktree').title('Club Link Tree')])
        ),
      S.divider(),
      S.listItem()
        .title('Authors')
        .child(
          S.list()
            .title('Author Details')
            .items([S.documentTypeListItem('author').title('Authors')])
        ),
      S.divider(),
      S.documentTypeListItem(contextDocumentTypeName),
    ]);
