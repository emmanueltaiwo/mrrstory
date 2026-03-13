'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const story = useQuery(api.stories.getBySlug, slug ? { slug } : 'skip');
  const ensureStory = useAction(api.ensureStory.ensureStory);

  useEffect(() => {
    if (!slug) return;
    if (story === undefined) return;
    if (story !== null) {
      router.replace(`/story/${slug}/wrapped`);
      return;
    }

    ensureStory({ slug })
      .then((result) => {
        if (result) {
          router.replace(`/story/${slug}/wrapped`);
        }
      })
      .catch(() => {});
  }, [slug, story, ensureStory, router]);

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
