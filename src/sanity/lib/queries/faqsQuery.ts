import groq from 'groq';

export const faqsQuery = groq`*[_type == "faq"]{
    _id,
    _createdAt,
    question,
    answer
}`;
