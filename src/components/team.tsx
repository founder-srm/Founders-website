'use client';
import { Github, Globe, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';
import type { OurTeam, TEAM_QUERYResult } from '../../sanity.types';

type SocialLink = {
  platform: 'github' | 'linkedin' | 'website';
  url: string;
  icon: JSX.Element;
};

type TeamMember = OurTeam;

type TeamSectionProps = {
  teamMembers: TEAM_QUERYResult;
};

const domainLabels = {
  operations_marketing: 'Operations & Marketing',
  operations: 'Operations & Marketing', // For backward compatibility [why tf do we merge them as one, this why the club is ass]
  marketing: 'Operations & Marketing', // For backward compatibility
  technical: 'Technical',
  creatives: 'Creatives',
  outreach: 'Outreach',
  sponsorship: 'Sponsorship',
  leadership: 'Leadership',
};

const domains = [
  'operations_marketing',
  'technical',
  'creatives',
  'outreach',
  'sponsorship',
  'leadership',
] as const;

const TeamSection = ({ teamMembers }: TeamSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>(domains[0]);

  // Filter different types of team members
  const leadershipTeam = teamMembers.filter(
    member => member.isPresident || member.isVicePresident
  );
  const advisoryTeam = teamMembers.filter(member => member.isAdvisor);
  const regularTeam = teamMembers.filter(
    member => !member.isPresident && !member.isVicePresident && !member.isAdvisor
  );

  const getSocialLinks = (member: TeamMember): SocialLink[] => {
    const links: SocialLink[] = [];

    if (member.github) {
      links.push({
        platform: 'github',
        url: member.github,
        icon: <Github className="size-5 text-muted-foreground" />,
      });
    }

    if (member.linkedin) {
      links.push({
        platform: 'linkedin',
        url: member.linkedin,
        icon: <Linkedin className="size-5 text-muted-foreground" />,
      });
    }

    if (member.website) {
      links.push({
        platform: 'website',
        url: member.website,
        icon: <Globe className="size-5 text-muted-foreground" />,
      });
    }

    return links;
  };

  const renderTeamMember = (member: TeamMember) => {
    const socialLinks = getSocialLinks(member);

    return (
      <div key={member._id} className="flex flex-col items-start">
        <Avatar className="mb-4 size-28 md:mb-5 lg:size-32 rounded-md">
          {member.avatar ? (
            <AvatarImage
              src={urlFor(member.avatar).url()}
              alt={member.name || ''}
              className="object-cover"
            />
          ) : (
            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <p className="font-medium">{member.name}</p>
        <p className="text-muted-foreground">{member.role}</p>
        {member.description && (
          <p className="py-3 text-sm text-muted-foreground">
            {member.description}
          </p>
        )}
        {socialLinks.length > 0 && (
          <div className="mt-2 flex gap-4">
            {socialLinks.map(link => (
              <Button
                key={`${member._id}-${link.platform}`}
                variant="ghost"
                size="icon"
                onClick={() => window.open(link.url, '_blank')}
                aria-label={`${member.name}'s ${link.platform}`}
              >
                {link.icon}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper function to get the normalized domain
  const getNormalizedDomain = (domain: string): string => {
    if (domain === 'operations' || domain === 'marketing') {
      return 'operations_marketing';
    }
    return domain;
  };

  return (
    <section className="py-16 px-4 md:py-24 lg:py-32">
      <div className="container flex flex-col items-start text-left">
        <p className="font-semibold">Our Team</p>
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          Meet The Team
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          Our dedicated team of professionals working together to create amazing
          experiences.
        </p>
      </div>

      {/* Leadership Team (President & Vice President) */}
      {leadershipTeam.length > 0 && (
        <div className="container my-8">
          <h3 className="mb-8 text-xl font-bold">Leadership</h3>
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {leadershipTeam.map(member =>
              renderTeamMember(member as TeamMember)
            )}
          </div>
        </div>
      )}

      {/* Advisory Team */}
      {advisoryTeam.length > 0 && (
        <div className="container my-8">
          <h3 className="mb-8 text-xl font-bold">Advisors</h3>
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {advisoryTeam.map(member => {
              // For advisors, use advisorRole if available, otherwise fallback to role
              const advisorMember = {
                ...member,
                role: member.advisorRole || member.role,
              };
              return renderTeamMember(advisorMember as TeamMember);
            })}
          </div>
        </div>
      )}

      {/* Team Members by Domain */}
      <div className="container mt-16">
        <Tabs
          defaultValue={domains[0]}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8 h-auto flex-wrap justify-start">
            {domains.map(domain => {
              const domainMembers = regularTeam.filter(
                member =>
                  // biome-ignore lint/style/noNonNullAssertion: gae as shit error
                  getNormalizedDomain(member.domain!) === domain
              );
              if (domainMembers.length === 0) return null;

              return (
                <TabsTrigger
                  key={domain}
                  value={domain}
                  className="data-[state=active]:after:bg-primary relative rounded-md px-4 py-2 text-sm 
                            after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 
                            data-[state=active]:bg-accent data-[state=active]:shadow-sm"
                >
                  {domainLabels[domain]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {domains.map(domain => {
            const domainMembers = regularTeam.filter(
              member =>
                // biome-ignore lint/style/noNonNullAssertion: same as b4
                getNormalizedDomain(member.domain!) === domain
            );
            if (domainMembers.length === 0) return null;

            return (
              <TabsContent key={domain} value={domain} className="pt-4">
                <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
                  {/* //@ts-expect-error - TS doesn't know that domainMembers is not empty */}
                  {domainMembers.map(member =>
                    renderTeamMember(member as TeamMember)
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default TeamSection;
