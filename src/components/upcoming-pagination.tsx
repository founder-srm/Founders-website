import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Pagination() {
  return (
    <div className="mt-8 border-t border-border py-2 md:mt-10 lg:mt-12">
      <nav
        aria-label="pagination"
        className="mx-auto flex w-full justify-center"
      >
        <ul className="flex flex-row items-center gap-1 w-full justify-between">
          <li>
            <Link
              href="#"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Link>
          </li>
          <div className="hidden items-center gap-1 md:flex">
            <li>
              <Link
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                1
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                2
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                3
              </Link>
            </li>
          </div>
          <li>
            <Link
              href="#"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5"
              aria-label="Go to next page"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
