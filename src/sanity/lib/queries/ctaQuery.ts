import groq from 'groq';

export const ctaQuery = groq`*[_type == "cta"]{
    _id,
    _createdAt,
    title,
    description,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    variant,
    activateSecondaryButton,
    showCTA
}`;
