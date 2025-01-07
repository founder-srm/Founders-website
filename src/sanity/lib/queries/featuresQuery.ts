import groq from 'groq';

export const featuresQuery = groq`*[_type == "feature"]{
    _id,
    _createdAt,
    title,
    description,
    icon
}`;
