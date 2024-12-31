import Hero from "@/components/hero";
import RelatedPosts from "@/components/related-posts";



export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full md:px-16">
      <Hero />
      <RelatedPosts />
    </main>
  );
}
