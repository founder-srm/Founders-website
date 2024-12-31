import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import Image from 'next/image';




function ShadcnTable({ data }: { data: { headers: string[]; rows: string[][] } }) {
  const headers = data.headers.map((header, index) => (
    <th key={index} className="border px-4 py-2 text-left font-bold">
      {header}
    </th>
  ));

  const rows = data.rows.map((row, index) => (
    <tr key={index} className="even:bg-muted">
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} className="border px-4 py-2">
          {cell}
        </td>
      ))}
    </tr>
  ));

  return (
    <table className="w-full border-collapse border my-6">
      <thead className="bg-muted">
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// Minimal heading generator with Shadcn styling:
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return function Heading({ children, ...props }: any) {
    return (
      <Tag className="scroll-m-20 text-4xl font-bold tracking-tight" {...props}>
        {children}
      </Tag>
    );
  };
}

// Simple paragraph using Shadcn classes:
function ShadcnParagraph({ children }: any) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

// Simple link with default Shadcn link styling:
function ShadcnLink({ href, children, ...props }: any) {
  return (
    <a className="underline underline-offset-4" href={href} {...props}>
      {children}
    </a>
  );
}

// Inline code or code block with Shadcn styling:
function ShadcnInlineCode({ children }: any) {
  return <code className="rounded bg-muted px-1 py-0.5 text-sm">{children}</code>;
}


function ShadcnImage({ src, alt, ...props }: any) {
  return (
    <Image
      className="rounded-md my-4"
      src={src}
      alt={alt}
      fill
      priority
      {...props}
    />
  );
}

// Blockquote with Shadcn styling:
function ShadcnBlockquote({ children }: any) {
  return <blockquote className="mt-6 border-l-4 pl-4 italic opacity-80">
    {children}
  </blockquote>;
}

// Combine all components:
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: ShadcnParagraph,
  a: ShadcnLink,
  table: ShadcnTable,
  code: ShadcnInlineCode,
  img: ShadcnImage,
  ul: (props: any) => <ul className="list-disc pl-8" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-8" {...props} />,
  li: (props: any) => <li className="mt-1" {...props} />,
  blockquote: ShadcnBlockquote,
};

// CustomMDX component:
type CustomMDXProps = MDXRemoteProps & { components?: typeof components };

export function CustomMDX(props: CustomMDXProps) {
  return (
    // @ts-expect-error components prop is not in the MDXRemoteProps type
    <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
  );
}