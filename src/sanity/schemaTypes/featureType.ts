import { defineType, defineField } from "sanity";

export const featureType = defineType({
  name: "feature",
  type: "document",
  title: "Feature",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "icon",
      type: "string",
      title: "Icon (optional)",
    }),
  ],
});
