'use client';

import useClickOutside from '@/lib/hooks/use-click-outside';
import { Navlinks } from '@/lib/types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

const menuVariants = {
  open: { d: 'M3 12h18M3 6h18M3 18h18' }, // Path for the "X" icon
  closed: { d: 'M3 12h18M3 6h18M3 18h18' }, // Path for the "Menu" icon
};

const NavLinks: Navlinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
];

const Sidebar: React.FC = () => {
  // will change the fonts later on
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    setMenuOpen(false);
  });
  return (
    <nav
      className="fixed left-0 z-[120] min-h-screen w-[60px] border-r-[3.5px] border-black"
      ref={containerRef}
    >
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0.5, zIndex: 50 }}
            animate={{ x: 0, opacity: 1, zIndex: 50 }}
            exit={{ x: -300, opacity: 0, zIndex: 50 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.25, velocity: 50 }}
            className="absolute left-[60px] top-[60px] z-50 flex h-full w-96 flex-col gap-12 border-r-[3px] border-black bg-[#FFB2EF] pl-12 pt-12"
          >
            <motion.ul
              initial={{ x: -300, opacity: 0.5, zIndex: 50 }}
              animate={{ x: 0, opacity: 1, zIndex: 50 }}
              exit={{ x: -300, opacity: 0, zIndex: 50 }}
              transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut', staggerChildren: 0.1 }}
              className="space-y-6"
            >
              {NavLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ y: -100, opacity: 0, scale: 0.3, filter: 'blur(20px)' }}
                  animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.2, delay: 0.2 * (index + 1) }}
                  whileHover={{ scale: 1, x: 10, transition: { duration: 0.1 } }}
                  className="text-4xl font-bold"
                >
                  <Link href={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute z-[120] flex h-screen flex-col items-center justify-between border border-black bg-white px-1 py-6">
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          transition={{ duration: 1 }}
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {menuOpen ? (
            <motion.svg strokeWidth={1} className="size-10 cursor-pointer">
              <X />
            </motion.svg>
          ) : (
            <motion.svg strokeWidth={1} className="size-10 cursor-pointer">
              <Menu />
            </motion.svg>
          )}
        </motion.button>
        <div className="flex flex-col gap-4">
          <Instagram
            strokeWidth={1.5}
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          />
          <Linkedin
            strokeWidth={1.5}
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          />
          <Mail
            strokeWidth={1.5}
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
