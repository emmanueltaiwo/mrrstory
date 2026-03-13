'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StoryViewer } from '@/components/StoryViewer';

export default function WrappedPage() {
  const params = useParams();
  const slug = params.slug as string;
  const viewTracked = useRef(false);
  const ensureStarted = useRef(false);
  const [ensureFailed, setEnsureFailed] = useState(false);

  const story = useQuery(api.stories.getBySlug, slug ? { slug } : 'skip');
  const ensureStory = useAction(api.ensureStory.ensureStory);
  const incrementViews = useMutation(api.stories.incrementViews);

  useEffect(() => {
    if (!slug || story !== null || ensureStarted.current) return;
    ensureStarted.current = true;
    ensureStory({ slug })
      .then((result) => {
        if (result === null) setEnsureFailed(true);
      })
      .catch(() => setEnsureFailed(true));
  }, [slug, story, ensureStory]);

  const onViewTracked = () => {
    if (viewTracked.current || !story?._id) return;
    viewTracked.current = true;
    incrementViews({ storyId: story._id });
  };

  if (!slug) {
    return (
      <div className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-void bg-noise'>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span
            className='font-display text-[clamp(3rem,12vw,8rem)] font-bold tracking-tighter text-(--void-3)'
            style={{ textShadow: '0 0 60px rgba(255,51,102,0.12)' }}
          >
            —
          </span>
          <Link
            href='/'
            className='mt-8 text-sm text-(--ink-muted) underline-offset-4 transition-colors hover:text-(--neon)'
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (story === undefined || (story === null && !ensureFailed)) {
    return (
      <div className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-void bg-noise'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span
            className='font-display text-[clamp(4rem,15vw,10rem)] font-bold tracking-tighter text-(--void-3)'
            style={{ textShadow: '0 0 80px rgba(0,255,200,0.15)' }}
          >
            MRR
          </span>
        </div>
        <div className='absolute bottom-[20vh] left-1/2 h-px w-32 -translate-x-1/2 overflow-hidden rounded-full bg-(--neon)/20'>
          <div className='h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-(--neon)/20' />
        </div>
        <style>{`@keyframes shimmer { 0%, 100% { transform: translateX(-100%); } 50% { transform: translateX(200%); } }`}</style>
      </div>
    );
  }

  if (story === null || ensureFailed) {
    return (
      <div className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-void bg-noise'>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span
            className='font-display text-[clamp(4rem,15vw,10rem)] font-bold tracking-tighter text-(--void-3)'
            style={{ textShadow: '0 0 60px rgba(255,51,102,0.12)' }}
          >
            404
          </span>
          <Link
            href='/'
            className='mt-8 text-sm text-(--ink-muted) underline-offset-4 transition-colors hover:text-(--neon)'
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const slides = story.slides as {
    id: string;
    type: string;
    title: string;
    data: Record<string, unknown>;
  }[];

  if (!slides?.length) {
    return (
      <div className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-void bg-noise'>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span
            className='font-display text-[clamp(3rem,12vw,8rem)] font-bold tracking-tighter text-(--void-3)'
            style={{ textShadow: '0 0 60px rgba(0,255,200,0.12)' }}
          >
            —
          </span>
          <Link
            href='/'
            className='mt-8 text-sm text-(--ink-muted) underline-offset-4 transition-colors hover:text-(--neon)'
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StoryViewer
      slides={slides}
      startupName={story.startupName}
      startupSlug={story.startupSlug}
      onViewTracked={onViewTracked}
    />
  );
}
