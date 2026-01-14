import type { Key } from 'react';
import { AvatarGroup, BookDemoForm } from '@/components/contact-form';
import { sanityFetch } from '@/sanity/lib/live';
import { CONTACT_US_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600; // revalidate every hour

export default async function ContactUs() {
  const { data } = await sanityFetch({ query: CONTACT_US_QUERY });

  return (
    data && (
      <main className="w-full min-h-screen flex flex-col items-center">
        <section className="relative py-32">
          {/* Background gradients and patterns */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,hsl(var(--accent))_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,hsl(var(--accent))_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,hsl(var(--accent))_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,hsl(var(--accent))_0%,transparent_80%)]" />
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(hsl(var(--accent-foreground)/0.1)_1px,transparent_1px)] [background-size:8px_8px] [mask-image:radial-gradient(ellipse_60%_60%_at_65%_50%,#000_0%,transparent_80%)]" />

          <div className="container grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2">
            <div className="w-full pb-10 md:space-y-10 md:pb-0">
              <div className="space-y-4 md:max-w-[40rem]">
                <h1 className="text-4xl font-medium lg:text-5xl heading-gradient">
                  {data.title}
                </h1>
                <div className="text-muted-foreground md:text-base lg:text-lg lg:leading-7">
                  {data.subtitle}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="space-y-16 pb-20 lg:pb-0">
                  <div className="space-y-6">
                    <AvatarGroup teamMembers={data.teamMembers} />
                    <div className="space-y-4">
                      <p className="text-sm font-semibold">
                        {data.expectationsTitle}
                      </p>
                      {data.expectations?.map(
                        (expectation: string, i: Key | null | undefined) => (
                          <ExpectationItem key={i} text={expectation} />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center lg:mt-2.5">
              <div className="relative flex w-full min-w-[20rem] max-w-[30rem] flex-col items-center overflow-visible md:min-w-[24rem]">
                <BookDemoForm
                  title={data.formTitle}
                  subtitle={data.formSubtitle}
                  submitButtonText={data.submitButtonText}
                  thankYouMessage={data.thankYouMessage}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  );
}

function ExpectationItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-check size-5 shrink-0 text-muted-foreground"
        aria-label="Checkmark icon"
        role="img"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <p className="text-sm">{text}</p>
    </div>
  );
}
