'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const TOTAL_FRAMES = 160;
const FRAME_PATH = '/logo_sequence/ezgif-frame-';

// Generate frame paths
const getFramePath = (index: number): string => {
    const frameNumber = String(index + 1).padStart(3, '0');
    return `${FRAME_PATH}${frameNumber}.jpg`;
};

export default function FinalReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end'],
    });

    // Left content block - appears first after logo is visible
    const leftOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
    const leftY = useTransform(scrollYProgress, [0.7, 0.8], [6, 0]);

    // Right content block - appears slightly after left
    const rightOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
    const rightY = useTransform(scrollYProgress, [0.75, 0.85], [6, 0]);

    // Fade overlay - solid dark background persists longer, then fades out
    // Creates a blank pause before the reveal begins
    const fadeOverlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.55], [1, 1, 0]);

    // Canvas stays hidden longer, then fades in after the blank period
    const canvasOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);

    // Preload all frames
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            };
            loadedImages[i] = img;
        }
    }, []);

    // Draw frame to canvas
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[frameIndex];

        if (!canvas || !ctx || !img || !img.complete) return;

        // Set canvas size to viewport
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Calculate cover dimensions
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, [images]);

    // Update frame based on scroll
    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        if (!isLoaded) return;
        const frameIndex = Math.min(
            Math.floor(progress * TOTAL_FRAMES),
            TOTAL_FRAMES - 1
        );
        if (frameIndex !== currentFrame && frameIndex >= 0) {
            setCurrentFrame(frameIndex);
            drawFrame(frameIndex);
        }
    });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) {
                drawFrame(currentFrame);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded, currentFrame, drawFrame]);

    // Initial draw when loaded
    useEffect(() => {
        if (isLoaded && images.length > 0) {
            drawFrame(0);
        }
    }, [isLoaded, images, drawFrame]);

    return (
        <section
            ref={containerRef}
            className="relative h-[200vh] bg-[#1a1a1a]"
        >
            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1a1a1a]">
                {/* Canvas */}
                <motion.canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ opacity: isLoaded ? canvasOpacity : 0 }}
                />

                {/* Fade overlay - blends section entrance with dark background */}
                <motion.div
                    className="absolute inset-0 bg-[#1a1a1a] pointer-events-none"
                    style={{ opacity: fadeOverlayOpacity }}
                />

                {/* Loading state */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                    </div>
                )}

                {/* CENTER-LEFT — Site Index */}
                <motion.div
                    className="absolute left-8 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ opacity: leftOpacity, y: leftY }}
                >
                    <div className="pointer-events-auto">
                        <p className="text-white/30 text-[13px] tracking-[0.2em] uppercase mb-6">
                            Index
                        </p>
                        <nav className="flex flex-col gap-4">
                            {['Haus', 'Experiments', 'Philosophy', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-white/50 text-[18px] md:text-[20px] font-normal hover:text-white/80 transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* CENTER-RIGHT — Contact + Social */}
                <motion.div
                    className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ opacity: rightOpacity, y: rightY }}
                >
                    <div className="text-right pointer-events-auto">
                        {/* Headline */}
                        <p className="text-white/70 text-[18px] md:text-[20px] font-light leading-relaxed mb-3">
                            Let&apos;s build something that lasts.
                        </p>

                        {/* Email */}
                        <a
                            href="mailto:hello@onenine.xyz"
                            className="text-white/60 text-[16px] md:text-[18px] font-light hover:text-white/80 transition-colors duration-300"
                        >
                            hello@onenine.xyz
                        </a>

                        {/* Social links */}
                        <div className="flex justify-end gap-6 mt-8">
                            {['Instagram', 'LinkedIn', 'X'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-white/50 text-[16px] md:text-[17px] font-light hover:text-white/80 transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
