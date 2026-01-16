'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StoneScroll from '@/components/StoneScroll';

// Navigation items
const NAV_ITEMS = ['Haus', 'Experiments', 'Philosophy', 'Contact'];

export default function Home() {
  const [scrollStarted, setScrollStarted] = useState(false);
  const [scrollComplete, setScrollComplete] = useState(false);

  const { scrollY } = useScroll();

  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Also handle browser history scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Hero content fades out as scroll begins
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  // Detect when scrolling starts
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 50 && !scrollStarted) {
        setScrollStarted(true);
      }
    });
    return () => unsubscribe();
  }, [scrollY, scrollStarted]);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      {/* ========================================
          Scrollytelling Canvas - Full Screen Background
          Starts immediately, visible on homescreen
          ======================================== */}
      <section className="relative z-0">
        <StoneScroll onScrollComplete={() => setScrollComplete(true)} />
      </section>

      {/* ========================================
          Hero Section - Overlaid on Canvas
          ======================================== */}
      <motion.section
        className="fixed inset-0 z-10 flex flex-col pointer-events-none"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY,
        }}
      >
        {/* Navigation */}
        <nav className="flex justify-center pt-10 px-4 pointer-events-auto">
          <div className="glass-pill flex items-center gap-8 md:gap-12 px-8 py-4">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/70 text-base md:text-lg font-medium tracking-wide hover:text-white/90 transition-colors duration-300"
              >
                {item}
                {index < NAV_ITEMS.length - 1 && (
                  <span className="hidden md:inline ml-8 md:ml-12 text-white/20">·</span>
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Main Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            One Nine
          </motion.h1>

          {/* CTA Button */}
          <motion.button
            className="btn-primary pointer-events-auto text-base md:text-lg px-8 py-4 md:px-10 md:py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth',
              });
            }}
          >
            Enter the Innovation Haus
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========================================
          Post-Scroll Section - The Clarity
          ======================================== */}
      <section
        id="haus"
        className="relative z-20 bg-[#1a1a1a] min-h-screen"
      >
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white/90 mb-6">
              Welcome to the Haus
            </h2>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Where ideas are dismantled and rebuilt with intent.
              Every experiment begins with a question worth breaking.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Experiments',
                description: 'Controlled chaos. Each project is a hypothesis tested against reality.',
                icon: '◇',
              },
              {
                title: 'Philosophy',
                description: 'Restraint over excess. Every decision serves the greater architecture.',
                icon: '○',
              },
              {
                title: 'Process',
                description: 'From fragment to form. We build through deliberate destruction.',
                icon: '□',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="glass rounded-2xl p-8 h-full transition-all duration-500 hover:bg-white/[0.08]">
                  <span className="text-2xl text-white/30 mb-6 block group-hover:text-white/50 transition-colors">
                    {feature.icon}
                  </span>
                  <h3 className="text-xl font-medium text-white/90 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-3 text-white/60 hover:text-white/90 transition-colors duration-300 group"
            >
              <span className="text-sm tracking-wide">Begin a conversation</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] py-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/30 text-sm">
              © 2026 OneNine Innovation Haus
            </p>
            <div className="flex gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/30 text-sm hover:text-white/60 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
