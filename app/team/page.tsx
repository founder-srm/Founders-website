'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Team member data
const teamMembers = [
  {
    id: 1,
    name: 'Ishan Roy',
    role: 'President',
    color: 'bg-blue-200',
    image: '/images/ishan roy.jpeg',
    domain: 'Leadership',
    linkedin: 'https://linkedin.com/in/ishanroy',
    instagram: 'https://instagram.com/ishanroy',
  },
  {
    id: 2,
    name: 'Suvan Gowri Shanker',
    role: 'Technical Lead',
    color: 'bg-red-200',
    image: '/images/suvan.jpeg',
    domain: 'Technical',
  },
  {
    id: 3,
    name: 'Saransh Bangar',
    role: 'Technical Associate Lead',
    color: 'bg-green-200',
    image: '/images/saransh.jpeg',
    domain: 'Technical',
  },
  {
    id: 4,
    name: 'Vijay Makkad',
    role: 'Technical Associate Lead',
    color: 'bg-yellow-200',
    image: '/images/vijay.jpeg',
    domain: 'Technical',
  },
  {
    id: 5,
    name: 'Jane Smith',
    role: 'Lead Designer',
    color: 'bg-yellow-200',
    image: '/images/jane-smith.jpg',
    domain: 'Creatives',
  },
  {
    id: 6,
    name: 'Mike Johnson',
    role: 'Marketing Specialist',
    color: 'bg-green-200',
    image: '/images/mike-johnson.jpg',
    domain: 'Marketing',
  },
  {
    id: 7,
    name: 'Alex Lee',
    role: 'Operations Manager',
    color: 'bg-purple-200',
    image: '/images/alex-lee.jpg',
    domain: 'Operations',
  },
  {
    id: 8,
    name: 'Sarah Wilson',
    role: 'Outreach Coordinator',
    color: 'bg-indigo-200',
    image: '/images/sarah-wilson.jpg',
    domain: 'Outreach',
  },
  {
    id: 9,
    name: 'John Doe',
    role: 'Software Engineer',
    color: 'bg-pink-200',
    image: '/images/john-doe.jpg',
    domain: 'Technical',
  },
  {
    id: 10,
    name: 'Emma Watson',
    role: 'UI/UX Designer',
    color: 'bg-orange-200',
    image: '/images/emma-watson.jpg',
    domain: 'Creatives',
  },
  {
    id: 11,
    name: 'Chris Evans',
    role: 'Sponsorship Manager',
    color: 'bg-teal-200',
    image: '/images/chris-evans.jpg',
    domain: 'Sponsorship',
  },
  {
    id: 12,
    name: 'Natalie Portman',
    role: 'Event Coordinator',
    color: 'bg-cyan-200',
    image: '/images/natalie-portman.jpg',
    domain: 'Outreach',
  },
  {
    id: 13,
    name: 'Tom Holland',
    role: 'Backend Developer',
    color: 'bg-lime-200',
    image: '/images/tom-holland.jpg',
    domain: 'Technical',
  },
  {
    id: 14,
    name: 'Scarlett Johansson',
    role: 'Graphic Designer',
    color: 'bg-amber-200',
    image: '/images/scarlett-johansson.jpg',
    domain: 'Creatives',
  },
];

const domains = ['ALL', 'Technical', 'Creatives', 'Operations', 'Sponsorship', 'Outreach'];

const TeamPage = () => {
  const [selectedDomain, setSelectedDomain] = React.useState('ALL');
  const [activeMember, setActiveMember] = useState<number | null>(null);

  const filteredMembers =
    selectedDomain === 'ALL'
      ? teamMembers
      : teamMembers.filter((member) => member.domain === selectedDomain);

  const handleMemberInteraction = (memberId: number) => {
    setActiveMember(activeMember === memberId ? null : memberId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-12 mt-16 text-center text-4xl font-bold font-hanson">Our Team</h1>

      <Tabs
        defaultValue="ALL"
        className="mb-12 w-full"
        value={selectedDomain}
        onValueChange={setSelectedDomain}
      >
        <ScrollArea className="h-28 w-full whitespace-nowrap">
          <div className="flex justify-center">
            <TabsList className="mt-8 inline-flex w-max space-x-4 bg-transparent p-1">
              {domains.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <TabsTrigger
                    value={domain}
                    className={`rounded-lg px-6 py-4 ${selectedDomain === domain ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    style={{
                      transform: 'perspective(1000px) rotateY(-5deg)',
                      transformStyle: 'preserve-3d',
                      borderLeft: '2px solid black',
                      borderTop: '2px solid black',
                      borderRight: '8px solid black',
                      borderBottom: '8px solid black',
                      backgroundColor: selectedDomain === domain ? '#3B82F6' : 'white',
                    }}
                  >
                    <span className="text-lg font-bold">{domain}</span>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {domains.map((domain) => (
          <TabsContent key={domain} value={domain} className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className={`relative overflow-hidden rounded-lg shadow-lg ${member.color} cursor-pointer`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    zIndex: 1,
                  }}
                  onHoverStart={() => handleMemberInteraction(member.id)}
                  onHoverEnd={() => handleMemberInteraction(member.id)}
                  onClick={() => handleMemberInteraction(member.id)}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transformStyle: 'preserve-3d',
                    borderLeft: '2px solid black',
                    borderTop: '2px solid black',
                    borderRight: '8px solid black',
                    borderBottom: '8px solid black',
                    ...(member.id === 1
                      ? {
                          boxShadow: '0 0 12px #ffd700, 0 0 16px #ffd700',
                          background: 'linear-gradient(45deg, #ffd700, #ffec8b, #fffacd)',
                          backgroundSize: '200% 200%',
                          backgroundPosition: '0% 50%',
                        }
                      : {}),
                  }}
                >
                  <div className="relative h-80 w-full">
                    <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
                    <AnimatePresence>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 backdrop-blur-sm"
                        initial={{ y: '100%' }}
                        animate={{ y: activeMember === member.id ? '0%' : '40%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <motion.h2
                          className="text-xl font-bold text-gray-800"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          {member.name}
                        </motion.h2>
                        {(member.id === 1 || activeMember === member.id) && (
                          <motion.h3
                            className="text-lg font-semibold text-gray-700"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            {member.role}
                          </motion.h3>
                        )}
                        <motion.div
                          className="mt-2 flex space-x-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        >
                          <motion.a
                            href={member.linkedin || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl text-gray-800 transition-colors duration-300 hover:text-blue-600"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaLinkedin />
                          </motion.a>
                          <motion.a
                            href={member.instagram || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl text-gray-800 transition-colors duration-300 hover:text-pink-600"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaInstagram />
                          </motion.a>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TeamPage;
