'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function MDXImage({ src, alt, className, ...props }: MDXImageProps) {
  return (
    <div className={cn("relative w-full h-[400px] my-8", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        
      />
    </div>
  );
}
