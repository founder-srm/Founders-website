import { createClient } from '@/utils/supabase/client';

export interface RecruitmentApplicationData {
  job_category: string;
  job_title: string;
  details: Record<string, any>;
  name?: string;
  email?: string;
  phone?: number;
}

export async function sendRecruitmentApplication(applicationData: RecruitmentApplicationData) {
  const supabase = createClient();

  // Extract basic contact info from details if available
  const { details } = applicationData;
  const name = details.name || details.full_name || details.firstName || 'Unknown';
  const email = details.email || details.email_address || '';
  const phone = details.phone || details.phone_number || details.mobile || null;

  // Prepare the contact entry data
  const contactData = {
    name: typeof name === 'string' ? name : 'Unknown',
    email: typeof email === 'string' ? email : '',
    phone: typeof phone === 'number' ? phone : (typeof phone === 'string' ? parseInt(phone) : null),
    subject: `Recruitment Application - ${applicationData.job_title}`,
    description: `Application for ${applicationData.job_title} in ${applicationData.job_category}`,
    company: applicationData.job_category, // Using company field to store job category
    // Store all form details in a structured way
    ...details
  };

  // Insert into contactentries table (reusing existing table)
  const { data, error } = await supabase
    .from('contactentries')
    .insert(contactData)
    .select()
    .single();

  if (error) {
    console.error('Recruitment application submission error:', error);
    throw new Error(error.message);
  }

  return data;
}