import type { ComponentType } from "react";

export interface MDXComponents {
  code: ComponentType<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>>;
  a: ComponentType<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>;
  img: ComponentType<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>>;
  pre: ComponentType<React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>>;
  table: ComponentType<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>;
  th: ComponentType<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>;
  td: ComponentType<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>;
  p: ComponentType<{ children: React.ReactNode }>;
  Alert: ComponentType<{
    children: React.ReactNode;
    variant: "default" | "destructive";
  }>;
}