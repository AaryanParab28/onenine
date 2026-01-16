'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Configuration
const FRAME_COUNT = 288;
const FRAME_PATH = '/sequence/ezgif-frame-';

// Text overlay content with scroll positions
interface TextOverlayData {
    position: number;
    text: string[];
    align: 'left' | 'center' | 'right';
    range: [number, number];
    isCta?: boolean;
}

const TEXT_OVERLAYS: TextOverlayData[] = [
    {
        position: 0,
        text: ['Ideas are not discovered.', 'They are broken open.'],
        align: 'center',
        range: [0, 0.15],
    },
    {
        position: 0.25,
        text: ['Pressure reveals structure.'],
        align: 'left',
        range: [0.18, 0.35],
    },
    {
        position: 0.5,
        text: ['Complexity is intentional.'],
        align: 'right',
        range: [0.43, 0.58],
    },
    {
        position: 0.75,
        text: ['Innovation lives in the fracture.'],
        align: 'center',
        range: [0.68, 0.82],
    },
    {
        position: 0.9,
        text: ['Enter the system.'],
        align: 'center',
        range: [0.85, 0.98],
        isCta: true,
    },
];

interface StoneScrollProps {
    onScrollComplete?: () => void;
}

export default function StoneScroll({ onScrollComplete }: StoneScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // Scroll tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Track scroll completion
    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (latest >= 0.99 && onScrollComplete) {
            onScrollComplete();
        }
    });

    // Canvas fade out at end
    const canvasOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

    // Set canvas dimensions to window size
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Preload all frames
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            const loadImage = (index: number): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    const frameNumber = String(index + 1).padStart(3, '0');
                    img.src = `${FRAME_PATH}${frameNumber}.jpg`;
                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(img);
                    };
                    img.onerror = reject;
                });
            };

            // Load all images
            const promises = Array.from({ length: FRAME_COUNT }, (_, i) => loadImage(i));

            try {
                const results = await Promise.all(promises);
                loadedImages.push(...results);
                imagesRef.current = loadedImages;

                // Store original image dimensions
                if (loadedImages[0]) {
                    setImageSize({
                        width: loadedImages[0].naturalWidth,
                        height: loadedImages[0].naturalHeight,
                    });
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        loadImages();
    }, []);

    // Draw frame to canvas with cover behavior
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const images = imagesRef.current;

        if (!canvas || !ctx || images.length === 0 || imageSize.width === 0) return;

        const clampedIndex = Math.max(0, Math.min(frameIndex, FRAME_COUNT - 1));
        const img = images[clampedIndex];

        if (img) {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            // Calculate cover dimensions
            const imgAspect = imgWidth / imgHeight;
            const canvasAspect = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, drawX, drawY;

            if (canvasAspect > imgAspect) {
                // Canvas is wider than image
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgAspect;
                drawX = 0;
                drawY = (canvasHeight - drawHeight) / 2;
            } else {
                // Canvas is taller than image
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgAspect;
                drawX = (canvasWidth - drawWidth) / 2;
                drawY = 0;
            }

            // Clear and draw with cover behavior
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
    }, [imageSize]);

    // Update frame on scroll
    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (!isLoading) {
            const frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
            requestAnimationFrame(() => drawFrame(frameIndex));
        }
    });

    // Draw initial frame when loading completes or dimensions change
    useEffect(() => {
        if (!isLoading && dimensions.width > 0) {
            drawFrame(0);
        }
    }, [isLoading, dimensions, drawFrame]);

    // Calculate text opacity based on scroll position
    const getTextOpacity = (range: [number, number], progress: number) => {
        const [start, end] = range;
        const fadeInEnd = start + 0.05;
        const fadeOutStart = end - 0.05;

        if (progress < start) return 0;
        if (progress > end) return 0;
        if (progress < fadeInEnd) return (progress - start) / 0.05;
        if (progress > fadeOutStart) return (end - progress) / 0.05;
        return 1;
    };

    return (
        <div
            ref={containerRef}
            className="relative h-[400vh]"
            style={{ background: '#1a1a1a' }}
        >
            {/* Sticky canvas container - covers full screen */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Loading state */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <div className="loader mb-4"></div>
                        <p className="text-white/60 text-sm tracking-wide">
                            Loading experience... {loadProgress}%
                        </p>
                    </div>
                )}

                {/* Canvas - Full screen cover */}
                <motion.canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        opacity: canvasOpacity,
                        display: isLoading ? 'none' : 'block',
                    }}
                />

                {/* Text overlays */}
                {!isLoading && TEXT_OVERLAYS.map((overlay, index) => (
                    <TextOverlay
                        key={index}
                        overlay={overlay}
                        scrollProgress={scrollYProgress}
                        getTextOpacity={getTextOpacity}
                    />
                ))}
            </div>
        </div>
    );
}

// Separate component for text overlays to use motion values
interface TextOverlayProps {
    overlay: TextOverlayData;
    scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
    getTextOpacity: (range: [number, number], progress: number) => number;
}

function TextOverlay({ overlay, scrollProgress, getTextOpacity }: TextOverlayProps) {
    const [opacity, setOpacity] = useState(0);

    useMotionValueEvent(scrollProgress, 'change', (latest) => {
        setOpacity(getTextOpacity(overlay.range, latest));
    });

    const alignmentClasses = {
        left: 'items-start text-left pl-8 md:pl-16 lg:pl-24',
        center: 'items-center text-center',
        right: 'items-end text-right pr-8 md:pr-16 lg:pr-24',
    };

    return (
        <motion.div
            className={`absolute inset-0 flex flex-col justify-center text-overlay ${alignmentClasses[overlay.align]}`}
            style={{ opacity }}
        >
            {overlay.text.map((line, lineIndex) => (
                <h2
                    key={lineIndex}
                    className={`text-white/90 drop-shadow-lg ${overlay.isCta ? 'cta-text cursor-pointer hover:text-white' : ''}`}
                >
                    {line}
                </h2>
            ))}
        </motion.div>
    );
}
