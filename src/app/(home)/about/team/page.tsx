import TeamSection from '@/components/team';
import { sanityFetch } from '@/sanity/lib/live';
import { TEAM_QUERY } from '@/sanity/lib/queries';


export default async function Team() {
  const { data: teamMembers } = await sanityFetch({ query: TEAM_QUERY, tag: 'ourTeam' });

  return (
    <main className="w-full min-h-screen flex flex-col items-center">
      <TeamSection teamMembers={teamMembers} />
    </main>
  );
}
