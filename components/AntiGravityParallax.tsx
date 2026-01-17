'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AntiGravityParallaxProps {
    onScrollStart: () => void;
    isActive: boolean;
}

export default function AntiGravityParallax({ onScrollStart, isActive }: AntiGravityParallaxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [imagesReady, setImagesReady] = useState(false);

    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring configuration for smooth, slightly faster motion
    const springConfig = { damping: 35, stiffness: 150, mass: 0.8 };

    // Background parallax (increased: ±10px)
    const bgX = useSpring(useTransform(mouseX, [-1, 1], [10, -10]), springConfig);
    const bgY = useSpring(useTransform(mouseY, [-1, 1], [10, -10]), springConfig);

    // Stone parallax (more pronounced: ±30px)
    const stoneX = useSpring(useTransform(mouseX, [-1, 1], [30, -30]), springConfig);
    const stoneY = useSpring(useTransform(mouseY, [-1, 1], [30, -30]), springConfig);

    // Continuous vertical float for stone
    const [floatY, setFloatY] = useState(0);

    // Handle mouse movement
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (hasScrolled || !isActive) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalize to -1 to 1 range
        const normalizedX = (clientX / innerWidth) * 2 - 1;
        const normalizedY = (clientY / innerHeight) * 2 - 1;

        mouseX.set(normalizedX);
        mouseY.set(normalizedY);
    }, [hasScrolled, isActive, mouseX, mouseY]);

    // Handle scroll to disable parallax - only when scrolled down significantly
    const handleScroll = useCallback(() => {
        if (!hasScrolled && window.scrollY > 50) {
            setHasScrolled(true);
            onScrollStart();
        }
    }, [hasScrolled, onScrollStart]);

    // Handle wheel event for immediate response - only on downward scroll
    const handleWheel = useCallback((e: WheelEvent) => {
        // Only trigger on downward scroll (positive deltaY) and when not at top
        if (!hasScrolled && e.deltaY > 10 && window.scrollY >= 0) {
            setHasScrolled(true);
            onScrollStart();
        }
    }, [hasScrolled, onScrollStart]);

    // Reset hasScrolled when parallax becomes active again
    useEffect(() => {
        if (isActive) {
            setHasScrolled(false);
        }
    }, [isActive]);

    // Set up event listeners
    useEffect(() => {
        if (!isActive) return;

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isActive, handleMouseMove, handleScroll, handleWheel]);

    // Continuous vertical float animation
    useEffect(() => {
        if (!isActive || hasScrolled) return;

        let animationId: number;
        let startTime: number | null = null;
        const amplitude = 10; // ±10px
        const duration = 4000; // 4 seconds per cycle (faster)

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Sinusoidal motion
            const progress = (elapsed % duration) / duration;
            const y = Math.sin(progress * Math.PI * 2) * amplitude;
            setFloatY(y);

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [isActive, hasScrolled]);

    // Check if custom parallax images exist
    useEffect(() => {
        const checkImages = async () => {
            try {
                const bgResponse = await fetch('/parallax/background.png', { method: 'HEAD' });
                const stoneResponse = await fetch('/parallax/stone.png', { method: 'HEAD' });
                if (bgResponse.ok && stoneResponse.ok) {
                    setImagesReady(true);
                }
            } catch {
                // Images don't exist, parallax will be hidden
                setImagesReady(false);
            }
        };
        checkImages();
    }, []);

    // Don't render if not active or images aren't ready
    if (!isActive || !imagesReady) return null;

    return (
        <AnimatePresence>
            {!hasScrolled && (
                <motion.div
                    ref={containerRef}
                    className="fixed inset-0 z-5 overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Background Layer - subtle movement */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            x: bgX,
                            y: bgY,
                        }}
                    >
                        <Image
                            src="/parallax/background.png"
                            alt=""
                            fill
                            priority
                            className="object-cover"
                            style={{
                                transform: 'scale(1.02)', // Slight overscale to hide edges during movement
                            }}
                        />
                    </motion.div>

                    {/* Stone Layer - positioned to match frame 1 of sequence */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            x: stoneX,
                            y: stoneY,
                            // Offset to match stone position in sequence frame 1
                            // Stone is slightly above center and slightly left
                            marginTop: '-3vh',
                            marginLeft: '-1vw',
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.92,
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <motion.div
                            style={{ y: floatY }}
                            className="relative"
                        >
                            {/* Soft shadow underneath - matches shadow in sequence */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-black/30 rounded-full blur-2xl"
                                style={{
                                    bottom: '-15%',
                                    width: '80%',
                                    height: '20%',
                                    transform: `translateX(-50%) scale(${1 - floatY * 0.008})`,
                                }}
                            />

                            {/* Stone image - sized to match sequence frame */}
                            <Image
                                src="/parallax/stone.png"
                                alt=""
                                width={1200}
                                height={1000}
                                priority
                                className="relative z-10"
                                style={{
                                    // Size to match the stone in the canvas sequence
                                    // Increased to 55vw to match the large stone in scroll view
                                    width: '100vw',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
