'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { SanityImageCrop, SanityImageHotspot } from '../../sanity.types';

interface TimelineItemProps {
  title: string | null;
  description: string | null;
  image: {
    asset?: SanityImageSource;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: 'image';
  } | null;
}

export default function TimelineItem({
  title,
  description,
  image,
}: TimelineItemProps) {
  if (!image?.asset) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border p-2"
    >
      <Image
        src={urlFor(image.asset).url()}
        alt={image.alt || title || 'Timeline image'}
        width={600}
        height={400}
        className="aspect-video w-full rounded-xl border border-dashed object-cover"
      />
      <div className="p-6">
        <h3 className="mb-1 text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
