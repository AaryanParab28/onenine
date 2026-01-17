'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StoneScroll from '@/components/StoneScroll';
import AntiGravityParallax from '@/components/AntiGravityParallax';
import PhilosophyBeliefs from '@/components/PhilosophyBeliefs';
import FinalReveal from '@/components/FinalReveal';

// Navigation items
const NAV_ITEMS = ['Haus', 'Experiments', 'Philosophy', 'Contact'];

export default function Home() {
  const [scrollStarted, setScrollStarted] = useState(false);
  const [scrollComplete, setScrollComplete] = useState(false);
  const [parallaxActive, setParallaxActive] = useState(true);

  const { scrollY } = useScroll();

  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Hero content fades out as scroll begins
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  // Detect when scrolling starts/stops and toggle parallax
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 50 && parallaxActive) {
        setScrollStarted(true);
        setParallaxActive(false);
      }
      if (latest <= 5 && !parallaxActive && scrollStarted) {
        setScrollStarted(false);
        setParallaxActive(true);
      }
    });
    return () => unsubscribe();
  }, [scrollY, scrollStarted, parallaxActive]);

  const handleParallaxScrollStart = () => {
    setParallaxActive(false);
    setScrollStarted(true);
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      {/* Anti-Gravity Parallax */}
      <AntiGravityParallax
        isActive={parallaxActive}
        onScrollStart={handleParallaxScrollStart}
      />

      {/* Scrollytelling Canvas */}
      <section className="relative z-0">
        <StoneScroll onScrollComplete={() => setScrollComplete(true)} />
      </section>

      {/* Hero Content Overlay */}
      <motion.section
        className="fixed inset-0 z-10 flex flex-col pointer-events-none"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Navigation */}
        <nav className="pt-8 flex justify-center pointer-events-auto">
          <div className="glass-pill px-6 py-3 md:px-8 md:py-4 flex items-center gap-6 md:gap-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/60 text-sm md:text-base font-light hover:text-white/90 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-wide text-white/90 mb-8 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-vt323)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            One Nine
          </motion.h1>

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

      {/* Philosophy Section */}
      <section id="philosophy" className="relative z-20 bg-[#1a1a1a]">
        <div className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 pb-8">
          {/* Section Label */}
          <motion.p
            className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-12 md:mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
          >
            Philosophy
          </motion.p>

          {/* Primary Statement */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-white/85 text-xl md:text-2xl leading-[1.55] font-light tracking-[-0.01em]">
              Innovation is not a breakthrough moment.
              <br />
              It is a process of pressure, breakdown, and reconstruction.
            </p>
            <p className="text-white/40 text-base md:text-lg leading-[1.65] font-light mt-5">
              At OneNine, ideas are treated as systems — not artifacts.
            </p>
          </motion.div>
        </div>

        {/* Scroll-Driven Belief System */}
        <div className="max-w-2xl mx-auto px-6">
          <PhilosophyBeliefs />
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-8 pb-24 md:pb-32">
          {/* Boundary Statement */}
          <motion.div
            className="mb-10 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/25 text-sm font-light leading-[1.9]">
              We are not driven by trends.
              <br />
              We are not interested in novelty without structure.
              <br />
              We do not begin with solutions.
            </p>
          </motion.div>

          {/* Transition Line */}
          <motion.p
            className="text-white/15 text-[13px] font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            This philosophy informs what follows.
          </motion.p>
        </div>
      </section>

      {/* Experiments Section */}
      <section id="experiments" className="relative z-20 bg-[#1a1a1a] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          {/* Section Label */}
          <motion.p
            className="text-white/30 text-xs tracking-[0.3em] uppercase mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
          >
            Experiments
          </motion.p>

          {/* Section Header */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white/90 mb-6">
              Work in progress
            </h2>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl leading-relaxed">
              Each project begins as a question. What follows is pressure, iteration, and form.
            </p>
          </motion.div>

          {/* Placeholder for experiments */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {[1, 2, 3, 4].map((item, index) => (
              <motion.div
                key={item}
                className="aspect-video bg-white/[0.02] rounded-lg border border-white/[0.05]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final Reveal - Logo & Contact */}
      <FinalReveal />
    </main>
  );
}
