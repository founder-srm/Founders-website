/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponentProps,
  type PortableTextComponents,
} from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

// Header Components
const Header1 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h1 className="text-4xl font-bold text-muted-foreground mb-6">{children}</h1>
);

const Header2 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h2 className="text-3xl font-semibold text-muted-foreground mb-5">
    {children}
  </h2>
);

const Header3 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
    {children}
  </h3>
);

const Header4 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h4 className="text-xl font-medium text-muted-foreground mb-4">{children}</h4>
);

const Header5 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h5 className="text-lg font-medium text-muted-foreground mb-3">{children}</h5>
);

const Header6 = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => (
  <h6 className="text-base font-medium text-muted-foreground mb-3">
    {children}
  </h6>
);

const BlockQuote = ({
  children,
}: PortableTextComponentProps<PortableTextBlock>) => {
  return (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  );
};

// Custom link component
const CustomLink = ({
  value,
  children,
}: {
  value?: { href: string };
  children: React.ReactNode;
}) => {
  if (!value?.href) return null;
  return (
    <Link href={value.href} className="text-blue-600 hover:underline">
      {children}
    </Link>
  );
};

// Custom image component
const CustomImage = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <div className="my-6">
      <Image
        src={urlFor(value).url()}
        alt={value.alt || ' '}
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  );
};

// Default components configuration
const defaultComponents: PortableTextComponents = {
  block: {
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="text-muted-foreground/80 mb-4">{children}</p>
    ),
    h1: Header1,
    h2: Header2,
    h3: Header3,
    h4: Header4,
    h5: Header5,
    h6: Header6,
    blockquote: BlockQuote,
  },
  marks: {
    link: CustomLink,
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-muted-foreground">
        {children}
      </strong>
    ),
  },
  types: {
    image: CustomImage,
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc ml-6 space-y-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal ml-6 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-muted-foreground">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="text-muted-foreground">{children}</li>
    ),
  },
};

interface PortableTextWrapperProps {
  value: any;
  components?: Partial<PortableTextComponents>;
}

export function PortableTextWrapper({
  value,
  components,
}: PortableTextWrapperProps) {
  // Merge custom components with defaults
  const mergedComponents = components
    ? { ...defaultComponents, ...components }
    : defaultComponents;

  return <PortableText value={value} components={mergedComponents} />;
}

// Export components for individual use if needed
export {
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  Header6,
  BlockQuote,
  CustomLink,
  CustomImage,
  defaultComponents as portableTextComponents,
};
