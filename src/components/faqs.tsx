import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { sanityFetch } from '@/sanity/lib/live';
import { FAQS_QUERY } from '@/sanity/lib/queries';
import type { FAQ } from '@/sanity/lib/sanity.types';
import { PortableText } from 'next-sanity';

const Faq1 = async () => {
  const { data: faqs } = await sanityFetch({ query: FAQS_QUERY });

  return (
    <section className="py-32">
      <div className="container">
        <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-5xl">
          Frequently asked questions
        </h1>
        {faqs?.map((faq: FAQ) => (
          <Accordion key={faq._id} type="single" collapsible>
            <AccordionItem value={`item-${faq._id}`} className="mb-4">
              <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <PortableText value={faq.answer} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default Faq1;
