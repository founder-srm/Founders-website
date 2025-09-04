/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image';
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import { CodeBlock } from '@/components/mdx/code-block';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from './lib/utils';

function ShadcnTable({
  data,
}: {
  data: { headers: string[]; rows: string[][] };
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {data.headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters except for -
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

function LinkHeading({
  Tag,
  slug,
  children,
  ...props
}: {
  Tag: keyof JSX.IntrinsicElements;
  slug: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Tag
      id={slug}
      className={cn('group flex items-center gap-2', props.className)}
      {...props}
    >
      {children}
      <a
        href={`#${slug}`}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
        aria-label={`Link to ${children}`}
      >
        #
      </a>
    </Tag>
  );
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizes = {
    1: 'text-4xl font-extrabold lg:text-5xl',
    2: 'text-3xl font-semibold lg:text-4xl',
    3: 'text-2xl font-semibold lg:text-3xl',
    4: 'text-xl font-semibold lg:text-2xl',
    5: 'text-lg font-semibold lg:text-xl',
    6: 'text-base font-semibold lg:text-lg',
  };

  return function Heading({ children, ...props }: any) {
    const slug = slugify(children as string);
    return (
      <LinkHeading
        Tag={Tag}
        slug={slug}
        className={cn(
          'scroll-m-20 tracking-tight text-secondary-foreground',
          sizes[level as keyof typeof sizes],
          'first:mt-0 mb-4'
        )}
        {...props}
      >
        {children}
      </LinkHeading>
    );
  };
}

function ShadcnParagraph({ children }: any) {
  return (
    <p className="leading-7 [&:not(:first-child)]:my-6 text-muted-foreground">
      {children}
    </p>
  );
}

function ShadcnLink({ href, children, ...props }: any) {
  return (
    <a
      className="font-medium underline underline-offset-4 hover:text-primary text-accent"
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}

function ShadcnInlineCode({ children }: any) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

function ShadcnImage({ src, alt, ...props }: any) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted">
      <Image
        className="aspect-video object-cover object-center"
        src={src}
        alt={alt}
        width={720}
        height={405}
        {...props}
      />
    </div>
  );
}

function ShadcnBlockquote({ children }: any) {
  return (
    <blockquote className="my-6 text-base font-extralight border-l-4 border-accent rounded-lg pl-4">
      <p className="text-muted-foreground bg-slate-800 ">{children}</p>
    </blockquote>
  );
}

// Lists styling
const Lists = {
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: (props: any) => (
    <li
      className="text-muted-foreground pl-6 ml-6"
      style={{ marginLeft: '1rem' }}
      {...props}
    />
  ),
};

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  hr: () => <hr className="my-6 border-t border-muted" />,
  p: ShadcnParagraph,
  a: ShadcnLink,
  table: ShadcnTable,
  pre: ({ children }: { children: any }) => {
    if (!children?.props?.children) {
      return <pre>{children}</pre>;
    }

    const code = children.props.children;
    const language = children.props.className?.replace('language-', '');

    return (
      <div className="my-6 overflow-hidden rounded-lg">
        <CodeBlock
          code={code}
          language={language}
          className={children.props.className}
        />
      </div>
    );
  },
  code: ShadcnInlineCode,
  img: ShadcnImage,
  ...Lists,
  blockquote: ShadcnBlockquote,
};

// CustomMDX component:
type CustomMDXProps = MDXRemoteProps & { components?: typeof components };

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      // @ts-expect-error components prop is not in the MDXRemoteProps type
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
