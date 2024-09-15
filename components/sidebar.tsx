'use client';

import useClickOutside from '@/lib/hooks/use-click-outside';
import { Navlinks } from '@/lib/types/core';
import { motion, AnimatePresence, useCycle } from 'framer-motion';
import Link from 'next/link';
import React, { useRef } from 'react';
import MenuToggle from '@/components/custom/MenuToggle';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const NavLinks: Navlinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
];

const Sidebar: React.FC = () => {
  // will change the fonts later on
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    toggleOpen(0);
  });

  return (
    <motion.nav
      initial={false}
      className="fixed left-0 z-[120] col-span-1 min-h-screen w-[60px] border-r-[3.5px] border-black"
      ref={containerRef}
    >
      <AnimatePresence>
        {isOpen && (
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
        <MenuToggle menuOpen={isOpen} toggleOpen={() => toggleOpen()} />
        <div className="flex flex-col gap-4">
          <motion.svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            initial="hidden"
            animate="visible"
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          >
            <motion.g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              variants={draw}
              custom={0.1}
            >
              <motion.rect
                width={20}
                height={20}
                x={2}
                y={2}
                rx={5}
                ry={5}
                strokeLinecap="round"
                strokeWidth="1.5"
                variants={draw}
                custom={0.1}
              />
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                variants={draw}
                custom={0.1}
                d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01"
              />
            </motion.g>
          </motion.svg>
          <motion.svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            initial="hidden"
            animate="visible"
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          >
            <motion.g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              variants={draw}
              custom={0.1}
            >
              <motion.path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"
                stroke-width="2"
                variants={draw}
                custom={0.1}
              />
              <motion.circle
                cx="4"
                cy="4"
                r="2"
                stroke-linecap="round"
                stroke-width="2"
                variants={draw}
                custom={0.1}
              />
            </motion.g>
          </motion.svg>
          <motion.svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            initial="hidden"
            animate="visible"
            className="size-12 cursor-pointer rounded-lg border-[3px] border-black p-1 transition-all duration-150 ease-in-out hover:bg-yellow-200"
          >
            <motion.g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <motion.rect
                width="20"
                height="16"
                x="2"
                y="4"
                rx="2"
                stroke-linecap="round"
                stroke-width="2"
                variants={draw}
                custom={0.1}
              />
              <motion.path
                d="m22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                stroke-width="2"
                variants={draw}
                custom={0.1}
              />
            </motion.g>
          </motion.svg>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
