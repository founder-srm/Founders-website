import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  link: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLAnchorElement,
  InteractiveHoverButtonProps
>(({ text = 'Button', link, className }, ref) => {
  return (
    <Link
      href={link}
      ref={ref}
      className={cn(
        'flex bg-red-400 justify-center gap-2 items-center shadow-xl text-sm bg-background backdrop-blur-md lg:font-semibold isolation-auto border-border before:absolute before:w-full before:transition-all before:duration-500 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-lg before:bg-secondary text-secondary-foreground before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-500 relative z-10 pr-1 py-1 overflow-hidden border-2 rounded-lg group',
        className
      )}
    >
      <span className="ml-4">{text}</span>
      <svg
        className="w-8 h-8 justify-end group-hover:rotate-45 group-hover:bg-secondary-foreground group-hover:rounded-full text-foreground transition-all duration-300 rounded-sm p-2 rotate-90"
        viewBox="0 0 16 19"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="arrow image"
        role="img"
      >
        <path
          d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
          className="fill-primary group-hover:fill-secondary"
        />
      </svg>
    </Link>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export default InteractiveHoverButton;
