import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

export async function serializeMDX(
  content: string
): Promise<MDXRemoteSerializeResult> {
  return await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      development: process.env.NODE_ENV === 'development',
    },
  });
}
