'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TimelineItemProps {
  title: string;
  description: string;
  image: string;
}

export default function TimelineItem({
  title,
  description,
  image,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border p-2"
    >
      <Image
        src={image}
        alt={title}
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
