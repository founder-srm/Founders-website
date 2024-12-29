'use client';

import type { MDXComponents } from 'mdx/types';
import { MDXAlert } from './alert';
import { MDXCode } from './code';
import { MDXImage } from './image';
import { MDXLink } from './link';
import { MDXPre } from './pre';
import { MDXText } from './text';
import { MDXTable, MDXTableHeader, MDXTableCell } from './table';

const components: Partial<MDXComponents> = {
  Alert: MDXAlert,
  code: MDXCode,
  a: MDXLink,
  img: MDXImage,
  pre: MDXPre,
  table: MDXTable,
  th: MDXTableHeader,
  td: MDXTableCell,
  p: MDXText,
};

export default components;
