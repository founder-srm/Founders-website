export const eventsQuery = `*[_type == "event"]{
    id,
    title,
    summary,
    image,
    label,
    author,
    published,
    href
  }`;
  