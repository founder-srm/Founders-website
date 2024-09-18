import { Button } from '../ui/button';

export default function HeroSection() {
  return (
    <section className="~sm/6xl:px-8/24 mx-8 mb-12 mt-24 flex h-fit flex-col items-center justify-center rounded-2xl border-none bg-highlight-blue ~py-24/28 ~sm/6xl:~w-[664px]/[1792px]">
      <h1 className="text-center font-hanson font-bold text-black ~text-[38px]/[95px]">
        Founders Club
      </h1>
      <h1 className="text-center font-hanson font-bold text-black ~text-[38px]/[95px]">
        Raising Startups
      </h1>
      <h1 className="text-center font-hanson font-bold text-black ~text-[38px]/[95px]">
        For Startups
      </h1>
      <p className="max-w-5xl font-uncut-sans text-2xl font-normal text-black">
        We&apos;re a dynamic duo helping startups and businesses stand out in a world of short
        attention spans. Reach more customers with high-performing, easy to manage Webflow websites,
        beautiful branding and powerful marketing. Ready to power-up your business?
      </p>
      <Button className="mt-8">Get Started</Button>
    </section>
  );
}
