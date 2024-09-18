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
  { id: 1, title: "Discovery", content: "Tell us about yourself! We'll discuss your goals and objectives..." },
  { id: 2, title: "Details", content: "You've accepted the proposal, and now it's time to get into the nitty-gritty..." },
  { id: 3, title: "Design", content: "Let's bring this vision to life! Design mock-ups are on the way..." },
  { id: 4, title: "Develop", content: "The construction phase begins, where we combine beauty and functionality..." },
  { id: 5, title: "Delivery", content: "We'll conduct rigorous testing to ensure your website functions smoothly..." },
];

const StackingCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current && cardsRef.current.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          tl.to(card, {
            yPercent: -100 * index,
            ease: "none",
          }, 0);
        }
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="h-screen bg-pink-300 overflow-hidden">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">This is how we do things</h1>
        <p className="text-lg text-white mb-12">
          Is this a whole new ball game for you? We want it to be an easy and
          stress-free process. We&apos;ll keep you in the loop through every step,
          but here&apos;s an idea of what&apos;s involved.
        </p>
        <div className="relative">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute top-0 left-0 w-full bg-white p-6 rounded-lg shadow-lg mb-4"
              style={{ zIndex: cards.length - index }}
            >
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackingCards;