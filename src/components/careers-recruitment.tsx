'use client';
import { ArrowRight, MapPin, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecruitmentMultiStepForm, type RecruitmentFormField } from './recruitment-multistep-form';

// Default recruitment form fields
const DEFAULT_RECRUITMENT_FIELDS: RecruitmentFormField[] = [
  {
    fieldType: 'text',
    label: 'What is your full name?',
    name: 'full_name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    fieldType: 'text',
    label: 'What is your email address?',
    name: 'email',
    required: true,
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
  },
  {
    fieldType: 'text',
    label: 'What is your phone number?',
    name: 'phone',
    required: true,
    validation: {
      pattern: '^[+]?[0-9]{10,15}$',
    },
  },
  {
    fieldType: 'select',
    label: 'What is your current year of study?',
    name: 'year_of_study',
    required: true,
    options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Other'],
  },
  {
    fieldType: 'text',
    label: 'What is your branch/department?',
    name: 'branch',
    required: true,
  },
  {
    fieldType: 'textarea',
    label: 'Why are you interested in this position?',
    name: 'interest_reason',
    required: true,
    validation: {
      minLength: 50,
      maxLength: 500,
    },
    description: 'Tell us what motivates you to apply for this role (minimum 50 characters)',
  },
  {
    fieldType: 'textarea',
    label: 'What relevant experience or skills do you have?',
    name: 'experience',
    required: true,
    validation: {
      minLength: 30,
      maxLength: 500,
    },
    description: 'Share any projects, internships, or skills relevant to this position',
  },
  {
    fieldType: 'checkbox',
    label: 'Which of these skills do you have? (Select all that apply)',
    name: 'skills',
    checkboxType: 'multiple',
    options: [
      'Leadership',
      'Event Management',
      'Marketing & Social Media',
      'Content Creation',
      'Web Development',
      'Mobile App Development',
      'UI/UX Design',
      'Data Analysis',
      'Project Management',
      'Public Speaking',
      'Financial Planning',
      'Other',
    ],
  },
  {
    fieldType: 'slider',
    label: 'How many hours per week can you commit to this role?',
    name: 'weekly_commitment',
    required: true,
    min: 1,
    max: 20,
    description: 'Please be realistic about your time availability',
  },
  {
    fieldType: 'date',
    label: 'When are you available to start?',
    name: 'start_date',
    required: true,
  },
  {
    fieldType: 'textarea',
    label: 'Is there anything else you would like us to know?',
    name: 'additional_info',
    required: false,
    validation: {
      maxLength: 300,
    },
    description: 'Optional: Share any additional information that might be relevant',
  },
];

type JobCategory = {
  _id: string;
  _createdAt: string;
  category: string | null;
  openings: Array<{
    title: string | null;
    location: string | null;
    link: string | null;
  }> | null;
};

export default function CareersRecruitment({ jobCategories }: { jobCategories: JobCategory[] }) {
  const [selectedJob, setSelectedJob] = useState<{
    category: string;
    title: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleApply = (category: string, title: string) => {
    setSelectedJob({ category, title });
    setShowForm(true);
  };

  const handleBackToJobs = () => {
    setShowForm(false);
    setSelectedJob(null);
  };

  if (showForm && selectedJob) {
    return (
      <section className="w-full py-8 flex flex-col items-center min-h-screen">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBackToJobs}
              className="mb-4"
            >
              ← Back to Job Listings
            </Button>
            <h1 className="text-3xl font-bold mb-2">
              Application Form
            </h1>
            <p className="text-muted-foreground">
              Complete this form to apply for {selectedJob.title} in {selectedJob.category}
            </p>
          </div>
          <RecruitmentMultiStepForm
            fields={DEFAULT_RECRUITMENT_FIELDS}
            jobCategory={selectedJob.category}
            jobTitle={selectedJob.title}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-32 flex flex-col items-center">
      <div className="container px-1">
        <div className="border-x border-dashed">
          <div className="relative flex flex-col gap-6 border-b border-dashed px-4 pb-10 pt-10 sm:items-center md:pb-20">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,transparent_60%,#000_100%)]" />
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground w-fit">
              Our Recruitments
            </div>
            <h1 className="text-2xl font-bold md:text-4xl">
              Openings at Founders Club
            </h1>
            <p className="text-muted-foreground">
              Don&apos;t see a role for you?
              <Link href="/contact-us" className="ml-1 underline">
                Reach out anyways.
              </Link>
            </p>
          </div>
          <div>
            {jobCategories && jobCategories.length > 0 ? (
              jobCategories.map(jobCategory => (
                <div key={jobCategory.category}>
                  <h2 className="px-6 pt-6 text-xl font-bold">
                    {jobCategory.category}
                  </h2>
                  {jobCategory.openings?.map(job => (
                    <div
                      key={job.title}
                      className="grid items-center gap-6 border-b border-dashed px-6 py-10 lg:grid-cols-4"
                    >
                      <h3 className="text-lg">{job.title}</h3>
                      <div className="col-span-2 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8 lg:justify-center">
                        <div className="flex gap-2">
                          <MapPin className="h-auto w-4" />
                          {job.location}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleApply(jobCategory.category || 'General', job.title || 'Position')}
                        className="w-fit gap-1 lg:ml-auto"
                      >
                        Apply
                        <ArrowRight className="h-auto w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <XCircle className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">
                  We are currently not recruiting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}