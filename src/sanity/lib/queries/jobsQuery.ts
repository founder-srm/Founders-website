export const jobsQuery = `*[_type == "jobCategory"]{
    category,
    openings[]{
      title,
      location,
      link
    }
  }`;