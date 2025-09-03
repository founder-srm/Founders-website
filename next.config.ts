// import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const withMDX = createMDX({
  // Match both .md and .mdx
  extension: /\.mdx?$/,
  // Add markdown plugins here, as desired
  // options: {
  //   remarkPlugins: [remarkGfm],
  //   rehypePlugins: [],
  // },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'eedplvopkhwuhhquagfw.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'shadcnblocks.com' },
    ],
  },
  transpilePackages: ['next-mdx-remote'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  }
};

export default withMDX(nextConfig);