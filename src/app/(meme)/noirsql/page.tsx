'use client';
import { useEffect, useRef } from 'react';

export default function NoirSQL() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Set viewport dimensions to simulate 2560x1440 resolution
  useEffect(() => {
    const updateIframeScale = () => {
      if (!iframeRef.current) return;

      const iframe = iframeRef.current;
      // This ensures content is rendered as if in 2560x1440
      const meta = 'width=2560, height=1440, initial-scale=1.0';

      // Attempt to set the viewport directly through the iframe if possible
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          let viewportMeta = iframeDoc.querySelector('meta[name="viewport"]');
          if (!viewportMeta) {
            viewportMeta = iframeDoc.createElement('meta');
            //@ts-expect-error i need to pass the viewport dimensions to prevent the iframe from scaling
            viewportMeta.name = 'viewport';
            iframeDoc.head.appendChild(viewportMeta);
          }
          //@ts-expect-error i need to pass the viewport dimensions to prevent the iframe from scaling
          viewportMeta.content = meta;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(
          'Cannot access iframe content due to same-origin policy ',
          e
        );
        // This is expected if the iframe content is from a different origin
      }
    };

    // Try to apply on load
    if (iframeRef.current) {
      iframeRef.current.onload = updateIframeScale;
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.onload = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center p-5">
      <div
        className="w-full max-w-7xl relative"
        style={{ paddingTop: '56.25%' }}
      >
        <iframe
          ref={iframeRef}
          title="NoirSQL"
          src="https://noir-sql-175lz.kinsta.page"
          className="absolute top-0 left-0 w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    </div>
  );
}
