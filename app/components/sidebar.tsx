"use client";

import { Instagram, Linkedin, Mail, Menu, X } from 'lucide-react';
import React, { useState } from 'react';

const Sidebar: React.FC = () => {

  // will change the fonts later on

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className='w-[60px] min-h-screen border-r-[3.5px] border-black fixed left-0 z-[20]'>
      <div className='flex flex-col justify-between items-center py-6 h-screen'>
        <div>
          {menuOpen
            ?
              <X
                strokeWidth={1}
                className='size-8 cursor-pointer'
                onClick={() => setMenuOpen(!menuOpen)}
              />
            :
              <Menu
                strokeWidth={1}
                className='size-8 cursor-pointer'
                onClick={() => setMenuOpen(!menuOpen)}
              />
          }
        </div>
        <div className='flex flex-col gap-4'>
          <Instagram
            strokeWidth={1.5}
            className='size-12 border-[3px] p-1 border-black rounded-lg cursor-pointer transition-all duration-150 ease-in-out hover:bg-yellow-200'
          />
          <Linkedin
            strokeWidth={1.5}
            className='size-12 border-[3px] p-1 border-black rounded-lg cursor-pointer transition-all duration-150 ease-in-out hover:bg-yellow-200'
          />
          <Mail
            strokeWidth={1.5}
            className='size-12 border-[3px] p-1 border-black rounded-lg cursor-pointer transition-all duration-150 ease-in-out hover:bg-yellow-200'
          />
        </div>
      </div>

      {menuOpen && (
        <div className='absolute left-[60px] top-[60px] z-[100] bg-[#FFB2EF] w-96 h-full flex flex-col pl-12 pt-12 gap-12 border-r-[3px] border-black'>
          <a href="/" className='text-4xl font-bold'>Home</a>
          <a href="/about" className='text-4xl font-bold'>About Us</a>
          <a href="" className='text-4xl font-bold'>Events</a>
          <a href="" className='text-4xl font-bold'>Contact Us</a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
