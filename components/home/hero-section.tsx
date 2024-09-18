import { Button } from "../ui/button";

export default function HeroSection(){
    return(
        <section className=" mx-8 mt-24 mb-12 bg-highlight-blue ~sm/6xl:~w-[664px]/[1792px] h-fit ~py-24/28 ~sm/6xl:px-8/24 flex flex-col justify-center items-center border-none rounded-2xl" >
            <h1 className="font-hanson font-bold text-center ~text-[38px]/[95px] text-black">Founders Club</h1>
            <h1 className="font-hanson font-bold text-center ~text-[38px]/[95px] text-black">Raising Startups</h1>
            <h1 className="font-hanson font-bold text-center ~text-[38px]/[95px] text-black">For Startups</h1>
            <p className="font-uncut-sans font-normal text-2xl text-black max-w-5xl">
                We&apos;re a dynamic duo helping startups and businesses stand out in a world of short attention
                spans. Reach more customers with high-performing, easy to manage Webflow websites,
                beautiful branding and powerful marketing. Ready to power-up your business?
            </p>
            <Button className="mt-8">Get Started</Button>
        </section>
    )
}