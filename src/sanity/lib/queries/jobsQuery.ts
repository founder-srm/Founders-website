import groq from 'groq';

export const jobsQuery = groq`*[_type == "jobCategory"]{
    _id,
    _createdAt,
    category,
    openings[]{
      title,
      location,
      link
    }
}`;
