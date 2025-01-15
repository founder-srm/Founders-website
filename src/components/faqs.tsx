import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { sanityFetch } from '@/sanity/lib/live';
import { FAQS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 3600; // revalidate every hour

const Faq1 = async () => {
  const { data: faqs } = await sanityFetch({ query: FAQS_QUERY });
  // console.log(faqs);
  return (
    <section className="py-32 container">
      <div className="container w-full">
        <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-5xl heading-gradient">
          Frequently asked questions
        </h1>
        {faqs?.map(faq => (
          <Accordion key={faq._id} type="single" collapsible>
            <AccordionItem value={`item-${faq._id}`} className="mb-4">
              <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default Faq1;
