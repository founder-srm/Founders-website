import groq from 'groq';

export const eventsQuery = groq`*[_type == "event"]{
    _id,
    _createdAt,
    id,
    title,
    summary,
    image,
    label,
    author,
    published,
    href
}`;
