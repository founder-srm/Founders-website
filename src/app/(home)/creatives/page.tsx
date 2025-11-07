import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LinkTreeCard } from '@/components/linktree/linktree-card';
import { urlFor } from '@/sanity/lib/image';
import { SanityLive, sanityFetch } from '@/sanity/lib/live';
import {
  FIRST_LINKTREE_QUERY,
  LINKTREE_BY_SLUG_QUERY,
} from '@/sanity/lib/queries';

export const revalidate = 3600;

async function getLinkTree() {
  const slug = process.env.NEXT_PUBLIC_CLUB_LINKTREE_SLUG || 'club';
  const { data } = await sanityFetch({
    query: LINKTREE_BY_SLUG_QUERY,
    params: { slug },
  });
  if (data) return data;
  const fallback = await sanityFetch({ query: FIRST_LINKTREE_QUERY });
  return fallback.data;
}

export default async function CreativesPage() {
  const data = await getLinkTree();

  if (!data) return notFound();

  const {
    title,
    description,
    themeColor,
    links,
    avatar,
    logo,
    pageBackgroundImage,
  } = data;

  const safeTitle = title || 'Link Hub';
  const safeDescription = description || undefined;
  const safeTheme = themeColor || undefined;
  const normalizedLinks = Array.isArray(links)
    ? links
        .filter(l => l?.label && l?.url)
        .map(l => ({
          _key: l._key,
          label: l.label || '',
          platform: l.platform || undefined,
          url: l.url || '',
          iconOverride: l.iconOverride || undefined,
          highlight: l.highlight ?? undefined,
          pinned: l.pinned ?? undefined,
          order: l.order ?? undefined,
          active: l.active ?? undefined,
        }))
    : [];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center px-4 py-10 gap-10 overflow-hidden">
      {pageBackgroundImage && (
        <div className="absolute inset-0 -z-10">
          {pageBackgroundImage && (
            <Image
              src={urlFor(pageBackgroundImage).url()}
              alt="Background"
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <LinkTreeCard
          title={safeTitle}
          description={safeDescription}
          themeColor={safeTheme}
          avatarValue={avatar}
          logoValue={logo}
          links={normalizedLinks}
        />
      </div>
      
    </main>
  );
}
