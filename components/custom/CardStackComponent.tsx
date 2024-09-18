import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CardData {
  id: number;
  title: string;
  content: string;
}

const cards: CardData[] = [
  {
    id: 1,
    title: 'Discovery',
    content: "Tell us about yourself! We'll discuss your goals and objectives...",
  },
  {
    id: 2,
    title: 'Details',
    content: "You've accepted the proposal, and now it's time to get into the nitty-gritty...",
  },
  {
    id: 3,
    title: 'Design',
    content: "Let's bring this vision to life! Design mock-ups are on the way...",
  },
  {
    id: 4,
    title: 'Develop',
    content: 'The construction phase begins, where we combine beauty and functionality...',
  },
  {
    id: 5,
    title: 'Delivery',
    content: "We'll conduct rigorous testing to ensure your website functions smoothly...",
  },
];

const StackingCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current && cardsRef.current.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          tl.to(
            card,
            {
              yPercent: -100 * index,
              ease: 'none',
            },
            0,
          );
        }
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-pink-300">
      <div className="mx-auto max-w-4xl px-4 pt-20">
        <h1 className="mb-8 text-4xl font-bold text-white">This is how we do things</h1>
        <p className="mb-12 text-lg text-white">
          Is this a whole new ball game for you? We want it to be an easy and stress-free process.
          We&apos;ll keep you in the loop through every step, but here&apos;s an idea of what&apos;s
          involved.
        </p>
        <div className="relative">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute left-0 top-0 mb-4 w-full rounded-lg bg-white p-6 shadow-lg"
              style={{ zIndex: cards.length - index }}
            >
              <h2 className="mb-2 text-xl font-bold">{card.title}</h2>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackingCards;
