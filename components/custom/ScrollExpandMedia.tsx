'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Notepad3D } from '@/components/custom/Notepad3D';
import { ShootingStars } from '@/components/custom/ShootingStars';
import { LiquidDock } from '@/components/custom/LiquidDock';
import { QuasarBackground } from '@/components/custom/QuasarBackground';
import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image' | 'quasar';
  mediaSrc?: string;
  posterSrc?: string;
  title?: string;
  date?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

export const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc = '',
  posterSrc,
  title,
  date,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [prevMediaType, setPrevMediaType] = useState(mediaType);
  if (mediaType !== prevMediaType) {
    setPrevMediaType(mediaType);
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Increase sensitivity for mobile, especially when scrolling back
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Higher sensitivity for scrolling back
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full bg-zinc-950 overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            {/* Stylized Canvas Shooting Stars Background */}
            <ShootingStars />

            {/* Single Gradient Blob (starts at bottom-right of the first 100vh viewport and moves up) */}
            <motion.div
              className="absolute right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
              style={{
                top: '60vh', // Anchored to the first viewport, not the bottom of the whole scrollable page
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0) 65%)'
              }}
              animate={{
                x: [0, -200, 0],
                y: [0, -600, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Hacker Grid (Optimized) */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
              }}
            />
            {/* Top Right Login Button (Liquid Glass) */}
            <div className="absolute top-6 right-6 md:right-8 z-50 pointer-events-auto">
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl group hover:bg-white/10 transition-all duration-300 hover:scale-105
                shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.9),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
                relative overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                <User size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-white font-semibold drop-shadow-md tracking-wide">Login</span>
              </Link>
            </div>

          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative pointer-events-none'>
              
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl flex items-center justify-center overflow-hidden'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc?.includes('youtube.com') ? (
                    <div className='absolute inset-0 w-full h-full pointer-events-none'>
                      <iframe
                        src={`${mediaSrc}?autoplay=1&mute=1&controls=0&loop=1&playlist=${
                          mediaSrc?.split('v=')[1]?.split('&')[0] || ''
                        }&playsinline=1&rel=0&showinfo=0&modestbranding=1`}
                        title={title}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        className='w-full h-full object-cover scale-[1.2]'
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>
                      <motion.div
                        className='absolute inset-0 bg-black/30'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : mediaSrc?.includes('vimeo.com') ? (
                    <div className='absolute inset-0 w-full h-full pointer-events-none'>
                      <iframe
                        src={`https://player.vimeo.com/video/${
                          mediaSrc?.split('vimeo.com/')[1]?.split('?')[0] || ''
                        }?background=1&autoplay=1&loop=1&byline=0&title=0`}
                        title={title}
                        allow='autoplay; fullscreen; picture-in-picture'
                        allowFullScreen
                        className='w-full h-full object-cover scale-[1.2]'
                      />
                      <div className='absolute inset-0 z-10' style={{ pointerEvents: 'none' }}></div>
                      <motion.div
                        className='absolute inset-0 bg-black/30'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='absolute inset-0 w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div className='absolute inset-0 z-10' style={{ pointerEvents: 'none' }}></div>
                      <motion.div
                        className='absolute inset-0 bg-black/30'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : mediaType === 'quasar' ? (
                  <div className='absolute inset-0 w-full h-full'>
                    <QuasarBackground />
                  </div>
                ) : (
                  <div className='absolute inset-0 w-full h-full'>
                    <Image
                      src={mediaSrc || ''}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
                
                {/* 3D Notepad and Description overlay on top of the expanding media */}
                <div className="absolute z-20 inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
                    
                    {/* Notepad Wrapper */}
                    <div 
                      className="absolute pointer-events-auto transition-none"
                      style={{
                        transform: isMobileState 
                          ? `translateY(${scrollProgress * -25}%) scale(${0.55 + scrollProgress * 0.45})`
                          : `translateX(${scrollProgress * 280}px) scale(${0.55 + scrollProgress * 0.45})`
                      }}
                    >
                      <Notepad3D externalOpen={mediaFullyExpanded} />
                    </div>

                    {/* Description Wrapper */}
                    <div 
                      className="absolute flex flex-col text-left space-y-4 md:space-y-6 transition-none"
                      style={{
                        transform: isMobileState 
                          ? `translateY(${55 - scrollProgress * 20}%)`
                          : `translateX(${-100 - scrollProgress * 180}px)`,
                        opacity: scrollProgress,
                        width: isMobileState ? '85%' : '450px',
                        pointerEvents: mediaFullyExpanded ? 'auto' : 'none'
                      }}
                    >
                      <div className="inline-flex items-center self-start gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium">
                        ✨ Interactivo
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                        Tu planner, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">reimaginado</span>.
                      </h3>
                      <p className="text-base md:text-lg text-white/90 drop-shadow-md">
                        Experimenta una nueva forma de organizar tus tareas con una interfaz inmersiva y animaciones fluidas que hacen del trabajo algo placentero.
                      </p>
                      <button className="mt-2 md:mt-4 px-6 md:px-8 py-3 bg-white text-zinc-900 font-bold rounded-full shadow-xl hover:scale-105 transition-transform self-start text-sm md:text-base">
                        Descubrir funciones
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                } pointer-events-none`}
              >
                <div className='flex flex-row justify-between w-full max-w-5xl px-8'>
                  <motion.h2
                    className='text-4xl md:text-6xl lg:text-8xl font-bold text-white transition-none'
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {firstWord}
                  </motion.h2>
                  <motion.h2
                    className='text-4xl md:text-6xl lg:text-8xl font-bold text-center text-white transition-none'
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {restOfTitle}
                  </motion.h2>
                </div>
              </div>

              <div className='absolute bottom-10 flex flex-col items-center text-center z-10 mt-4 transition-none'>
                {date && (
                  <p
                    className='text-xl text-white/70'
                    style={{ transform: `translateY(${scrollProgress * 50}px)`, opacity: 1 - scrollProgress * 2 }}
                  >
                    {date}
                  </p>
                )}
                {/* Liquid Glass Dock with Bouncing Arrows */}
                <div 
                  className="flex items-center gap-8 mt-6"
                  style={{ transform: `translateY(${scrollProgress * 50}px)`, opacity: 1 - scrollProgress * 2 }}
                >
                  <ChevronDown size={24} className="text-white/40 animate-bounce pointer-events-none" />
                  <LiquidDock />
                  <ChevronDown size={24} className="text-white/40 animate-bounce pointer-events-none" />
                </div>
              </div>

            </div>

            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};
