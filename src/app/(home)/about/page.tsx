import About1 from '@/components/about-us';
import Careers4 from '@/components/hiring';
import OurStory from '@/components/our-story';
import Timeline from '@/components/timeline';
// import Team1 from '@/components/team';

export default function About() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center">
      <About1 />
      <OurStory />
      <Timeline />
      <Careers4 />
      {/* <Team1 /> */}
    </main>
  );
}
