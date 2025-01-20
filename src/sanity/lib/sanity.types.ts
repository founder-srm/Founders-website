import type { PortableTextBlock } from '@portabletext/types';

export interface aboutValues {
  icon: string;
  title: string;
  description: string;
}
export interface AboutHeroSection {
  _id: string;
  _createdAt: string;
  title: string;
  subTitle: string;
  bannerImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  }
  ourMission: string;
  secondaryHeading: string;
  secondarySubHeading: string;
  ourValues: aboutValues[];
  aboutUsCta: {
    title: string;
    ctaBannerImage: {
      asset: {
        _ref: string;
        _type: string;
      };
    };
    subTitle: string;
  }
}

export interface BannerHeader {
  _id: string;
  _createdAt: string;
  isVisible: boolean;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  endDate: string;
}

export interface CTA {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant: boolean;
  activateSecondaryButton: boolean;
  showCTA: boolean;
}

export interface JobOpening {
  title: string;
  location: string;
  link: string;
}

export interface JobCategory {
  _id: string;
  _createdAt: string;
  category: string;
  openings: JobOpening[];
}

export interface Feature {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  _id: string;
  _createdAt: string;
  question: string;
  answer: string;
}

export interface Event {
  _id: string;
  _createdAt: string;
  id: string;
  title: string;
  summary: string;
  slug: string;
  content: PortableTextBlock[];
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
  label: string;
  author: string;
  published: string;
  href: string;
}

export interface Hero {
  _id: string;
  _createdAt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  showButton: boolean;
  image1: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  image2: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  image3: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  image4: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

// Query response types
export type BannerHeaderResponse = BannerHeader;
export type CTAResponse = CTA[];
export type JobCategoryResponse = JobCategory[];
export type FeatureResponse = Feature[];
export type FAQResponse = FAQ[];
export type EventResponse = Event[];
export type HeroResponse = Hero;
export type AboutHeroSectionResponse = AboutHeroSection;
