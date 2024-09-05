import Navbar from './components/navbar';
import Sidebar from './components/sidebar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Sidebar />

      {/* write the home page code here */}
      <section className="pl-[60px] pt-[60px]"></section>
    </main>
  );
}
