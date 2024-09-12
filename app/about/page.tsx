import React from 'react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';

const page = () => {
  return (
    <main>
      <Navbar />
      <Sidebar />

      {/* write the about page code here */}
      <section className="pl-[60px] pt-[60px]"></section>
    </main>
  );
};

export default page;
