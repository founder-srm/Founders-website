'use client';

interface MDXTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function MDXTable(props: MDXTableProps) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  );
}

export function MDXTableHeader(
  props: React.ThHTMLAttributes<HTMLTableCellElement>
) {
  return <th className="border px-4 py-2 text-left" {...props} />;
}

export function MDXTableCell(
  props: React.TdHTMLAttributes<HTMLTableCellElement>
) {
  return <td className="border px-4 py-2" {...props} />;
}
