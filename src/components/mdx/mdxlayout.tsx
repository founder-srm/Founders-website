export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl py-8 px-4 md:px-0 text-primary-foreground leading-relaxed">
      {children}
    </div>
  );
}
