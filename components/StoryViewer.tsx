'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import Link from 'next/link';
import { WrappedSlide } from './WrappedSlide';
import { WrappedSlideExport } from './WrappedSlideExport';

interface Slide {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
}

interface StoryViewerProps {
  slides: Slide[];
  startupName: string;
  startupSlug: string;
  onViewTracked?: () => void;
}

const EXPORT_WIDTH = 390;
const EXPORT_HEIGHT = 844;

export function StoryViewer({
  slides,
  startupName,
  startupSlug: _startupSlug,
  onViewTracked,
}: StoryViewerProps) {
  const [index, setIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [showExportFrame, setShowExportFrame] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const exportFrameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canGoNext = index < slides.length - 1;
  const canGoPrev = index > 0;

  const goNext = useCallback(() => {
    if (canGoNext) setIndex((i) => i + 1);
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (canGoPrev) setIndex((i) => i - 1);
  }, [canGoPrev]);

  useEffect(() => {
    onViewTracked?.();
  }, [onViewTracked]);

  // Auto-focus container on mount so arrow keys work immediately
  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const audio = new Audio('/music.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    const play = () => {
      audio.play().catch(() => {});
    };
    play();
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const getExportBackground = (slideIndex: number) => {
    if (slideIndex % 3 === 0) {
      return 'radial-gradient(ellipse 180% 150% at 50% 10%, rgba(0,255,200,0.22) 0%, rgba(0,255,200,0.1) 30%, rgba(0,120,100,0.05) 60%, rgba(0,40,35,0.02) 100%), radial-gradient(ellipse 140% 100% at 50% 100%, rgba(255,51,102,0.1) 0%, rgba(255,51,102,0.02) 50% 100%), #08090a';
    }
    if (slideIndex % 3 === 1) {
      return 'radial-gradient(ellipse 180% 150% at 50% 90%, rgba(255,51,102,0.2) 0%, rgba(255,51,102,0.09) 30%, rgba(120,30,50,0.04) 60%, rgba(40,10,18,0.02) 100%), radial-gradient(ellipse 140% 100% at 50% 0%, rgba(0,255,200,0.09) 0%, rgba(0,255,200,0.02) 50% 100%), #08090a';
    }
    return 'radial-gradient(ellipse 160% 120% at 0% 50%, rgba(0,255,200,0.14) 0%, rgba(0,255,200,0.05) 45%, rgba(0,60,50,0.02) 100%), radial-gradient(ellipse 160% 120% at 100% 50%, rgba(255,51,102,0.14) 0%, rgba(255,51,102,0.05) 45%, rgba(60,15,28,0.02) 100%), radial-gradient(ellipse 120% 100% at 50% 50%, rgba(0,255,200,0.03) 0%, rgba(255,51,102,0.02) 100%), #08090a';
  };

  const handleExport = async () => {
    setExporting(true);
    setShowExportFrame(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (!exportFrameRef.current) return;
      const dataUrl = await toPng(exportFrameRef.current, {
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mrrstory-${startupName.replace(/\s+/g, '-')}-${index + 1}.png`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setShowExportFrame(false);
      setExporting(false);
    }
  };

  const handleExportAll = useCallback(async () => {
    setExporting(true);
    const zip = new JSZip();
    const safeName = startupName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '');
    const opts = {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: 2,
      cacheBust: true,
    };
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;left:-9999px;top:0;width:390px;height:844px;overflow:hidden;';
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        root.render(
          <div
            style={{
              width: EXPORT_WIDTH,
              height: EXPORT_HEIGHT,
              overflow: 'hidden',
            }}
          >
            <WrappedSlideExport
              slide={slide}
              background={getExportBackground(i)}
            />
          </div>,
        );
        await new Promise((r) => setTimeout(r, 300));
        const dataUrl = await toPng(container.firstChild as HTMLElement, opts);
        const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, base64, {
          base64: true,
        });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mrrstory-${safeName}-all-slides.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setExporting(false);
    }
  }, [slides, startupName]);

  const slide = slides[index];

  const handleAreaClick = useCallback(
    (side: 'prev' | 'next') => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (side === 'prev') goPrev();
      else goNext();
    },
    [goPrev, goNext],
  );

  return (
    <>
      <div
        ref={containerRef}
        className='fixed inset-0 z-50 flex w-full flex-col overflow-hidden outline-none'
        tabIndex={0}
        role='application'
        aria-label='Story viewer - use arrow keys or click left/right to navigate'
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goNext();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
          }
        }}
      >
        <div
          className='fixed inset-0 -z-10 transition-[background] duration-700 ease-out'
          style={{
            background:
              index % 3 === 0
                ? 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,255,200,0.12) 0%, transparent 60%), var(--void)'
                : index % 3 === 1
                  ? 'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(255,51,102,0.1) 0%, transparent 60%), var(--void)'
                  : 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(0,255,200,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255,51,102,0.06) 0%, transparent 50%), var(--void)',
          }}
        />
        <div className='fixed inset-0 -z-10 bg-noise' aria-hidden />

        <div className='absolute left-0 right-0 top-0 z-40 flex gap-1.5 px-4 pt-4 md:gap-2 md:px-8 md:pt-5'>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className='h-1 flex-1 overflow-hidden rounded-full bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-(--neon)/50 md:h-1.5'
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  i <= index ? 'w-full bg-(--neon)' : 'w-0 bg-transparent'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Glass header */}
        <header className='absolute left-0 right-0 top-12 z-40 flex items-center justify-between px-4 md:top-14 md:px-8 lg:px-12'>
          <Link
            href='/'
            onClick={(e) => e.stopPropagation()}
            className='rounded-full bg-black/30 px-3 py-1.5 text-xs text-white/70 backdrop-blur-xl transition hover:bg-black/50 hover:text-(--neon)'
          >
            ←
          </Link>
          <span className='font-mono text-[10px] text-white/40'>
            {index + 1}/{slides.length}
          </span>
          <div className='flex items-center gap-2'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExportAll();
              }}
              disabled={exporting}
              className='rounded-full bg-black/30 px-3 py-1.5 text-xs text-white/70 backdrop-blur-xl transition hover:bg-black/50 hover:text-(--neon) disabled:opacity-50'
              title='Download all slides as ZIP'
            >
              {exporting ? '…' : 'All'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExport();
              }}
              disabled={exporting}
              className='rounded-full bg-black/30 px-3 py-1.5 text-xs text-white/70 backdrop-blur-xl transition hover:bg-black/50 hover:text-(--neon) disabled:opacity-50'
              title='Export current slide'
            >
              {exporting ? '…' : 'Export'}
            </button>
          </div>
        </header>

        <div className='relative flex flex-1 pt-10'>
          <div
            ref={slideRef}
            className='flex h-full w-full flex-col items-center justify-center'
          >
            <AnimatePresence mode='wait'>
              {slide && (
                <WrappedSlide key={slide.id} slide={slide} index={index} />
              )}
            </AnimatePresence>
          </div>

          {/* Left/right click zones */}
          <div
            className='absolute left-0 top-0 h-full w-1/2 cursor-pointer'
            onClick={handleAreaClick('prev')}
            aria-label='Previous slide'
          />
          <div
            className='absolute right-0 top-0 h-full w-1/2 cursor-pointer'
            onClick={handleAreaClick('next')}
            aria-label='Next slide'
          />

          {/* Download all - show on last slide */}
          {index === slides.length - 1 && slides.length > 1 && (
            <div className='absolute bottom-8 left-1/2 z-40 -translate-x-1/2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportAll();
                }}
                disabled={exporting}
                className='flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:border-(--neon)/50 hover:bg-black/70 hover:text-(--neon) disabled:opacity-50'
                title='Download all slides as ZIP'
              >
                <svg
                  className='size-4 shrink-0'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  aria-hidden
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                  />
                </svg>
                {exporting ? 'Preparing…' : 'Download all slides'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showExportFrame && slide && (
        <div
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4'
          aria-hidden
        >
          <div
            ref={exportFrameRef}
            className='overflow-hidden rounded-2xl shadow-2xl'
            style={{ width: EXPORT_WIDTH, height: EXPORT_HEIGHT }}
          >
            <WrappedSlideExport
              slide={slide}
              background={getExportBackground(index)}
            />
          </div>
        </div>
      )}
    </>
  );
}
