import { CircleArrowRight, Files, Settings } from 'lucide-react';
import Image from 'next/image';

const About1 = () => {
  return (
    <section className=" container">
      <div className="container flex flex-col gap-28 py-32">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-7xl">
            Bringing the power of software to everyone
          </h1>
          <p className="max-w-xl text-lg">
            Stacker makes it easy to build customer portals, CRMs, internal
            tools, and other business applications for your team. In minutes,
            not months.
          </p>
        </div>
        <Image
          src="https://shadcnblocks.com/images/block/placeholder-1.svg"
          alt="placeholder"
          width={800}
          height={600}
          className="size-full max-h-96 rounded-2xl object-cover"
        />
        <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
          <p className="text-sm text-muted-foreground">OUR MISSION</p>
          <p className="text-lg font-medium">
            We believe that building software should be insanely easy. That
            everyone should have the freedom to create the tools they need,
            without any developers, designers or drama.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-20">
        <div className="max-w-xl">
          <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
            We make creating software ridiculously easy
          </h2>
          <p className="text-muted-foreground">
            We aim to help empower 1,000,000 teams to create their own software.
            Here is how we plan on doing it.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
              <Files className="size-5" />
            </div>
            <h3 className="mb-3 mt-2 text-lg font-semibold">
              Being radically open
            </h3>
            <p className="text-muted-foreground">
              We believe there’s no room for big egos and there’s always time to
              help each other. We strive to give and receive feedback, ideas,
              perspectives
            </p>
          </div>
          <div className="flex flex-col">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
              <CircleArrowRight className="size-5" />
            </div>
            <h3 className="mb-3 mt-2 text-lg font-semibold">
              Moving the needle
            </h3>
            <p className="text-muted-foreground">
              Boldly, bravely and with clear aims. We seek out the big
              opportunities and double down on the most important things to work
              on.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
              <Settings className="size-5" />
            </div>
            <h3 className="mb-3 mt-2 text-lg font-semibold">
              Optimizing for empowerment
            </h3>
            <p className="text-muted-foreground">
              We believe that everyone should be empowered to do whatever they
              think is in the company&apos;s best interests.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-10 text-sm font-medium text-muted-foreground">
            JOIN OUR TEAM
          </p>
          <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
            We&apos;re changing how software is made
          </h2>
          <Image
            src="https://shadcnblocks.com/images/block/placeholder.svg"
            alt="placeholder"
            width={800}
            height={200}
            className="mb-6 max-h-36 w-full rounded-xl object-cover"
          />
          <p className="text-muted-foreground">
            And we&apos;re looking for the right people to help us do it. If
            you&apos;re passionate about making change in the world, this might
            be the place for you
          </p>
        </div>
      </div>
    </section>
  );
};

export default About1;
