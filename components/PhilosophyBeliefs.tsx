'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BELIEFS = [
    {
        title: 'Pressure is necessary',
        body: 'Ideas that survive comfort rarely survive reality.',
    },
    {
        title: 'Systems outlast tools',
        body: 'Tools change. Systems endure.',
    },
    {
        title: 'Clarity is earned',
        body: 'Understanding follows friction, not inspiration.',
    },
];

export default function PhilosophyBeliefs() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress based on container position in viewport
            // When container center is at viewport center, progress = 0.5
            const containerCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = viewportCenter - containerCenter;

            // Map distance to index (each belief gets ~200px of scroll)
            const scrollPerBelief = 150;
            const newIndex = Math.floor((distanceFromCenter + scrollPerBelief) / scrollPerBelief);
            const clampedIndex = Math.max(0, Math.min(BELIEFS.length - 1, newIndex));

            if (clampedIndex !== activeIndex) {
                setActiveIndex(clampedIndex);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    return (
        <div ref={containerRef} className="relative h-20 pl-4 border-l border-white/[0.06]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <h3 className="text-white/90 text-[15px] md:text-base font-medium tracking-[-0.01em] mb-1">
                        {BELIEFS[activeIndex].title}
                    </h3>
                    <p className="text-white/30 text-sm md:text-[15px] font-light leading-relaxed">
                        {BELIEFS[activeIndex].body}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
