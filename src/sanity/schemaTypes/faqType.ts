import { defineType, defineField } from "sanity";

export const faqType = defineType({
  name: "faq",
  type: "document",
  title: "FAQ",
  fields: [
    defineField({
      name: "question",
      type: "string",
      title: "Question",
    }),
    defineField({
      name: "answer",
      type: "text",
      title: "Answer",
    }),
  ],
});
