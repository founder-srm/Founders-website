import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getRegistrationById } from '@/actions/admin/registrations';
import RegistrationDetails from '@/components/admin-pages/registration';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/server';

export default async function AdminRegistrations({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  const supabase = await createClient();
  await prefetchQuery<Registration>(
    queryClient,
    getRegistrationById(supabase, slug)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RegistrationDetails slug={slug} />
    </HydrationBoundary>
  );
}
