'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatNumber, formatPercent } from '@/lib/formatNumber';
import { getStoryDisplayData, type StoryForCard } from '@/lib/storyUtils';

export function MobileStoriesPanels() {
  const trending = useQuery(api.stories.listTrending, { limit: 16 }) as
    | StoryForCard[]
    | undefined;
  const latest = useQuery(api.stories.listLatest, { limit: 16 }) as
    | StoryForCard[]
    | undefined;

  return (
    <div className='mt-6 flex w-full flex-col gap-4 px-4 md:hidden'>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='holo-card rounded-2xl p-4'
      >
        <div className='mb-3 flex items-center gap-2'>
          <span className='inline-flex size-2 rounded-full bg-(--neon)' />
          <span className='text-xs font-bold uppercase tracking-widest text-(--neon)'>
            ↑ Trending
          </span>
        </div>
        <div className='panel-scroll max-h-48 space-y-0.5 overflow-y-auto'>
          {trending === undefined ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2.5 rounded-xl px-2.5 py-2'
                >
                  <span className='skeleton-neon h-3 w-4 shrink-0' />
                  <span className='skeleton h-6 w-6 shrink-0 rounded' />
                  <span className='skeleton-neon h-3.5 w-24 rounded' />
                </div>
              ))}
            </>
          ) : (
            trending?.map((s, i) => {
              const { mrr, growth30d } = getStoryDisplayData(s);
              const rank = i + 1;
              const rankClass =
                rank === 1
                  ? 'rank-gold'
                  : rank === 2
                    ? 'rank-silver'
                    : rank === 3
                      ? 'rank-bronze'
                      : '';
              const RankBadge = () => {
                if (rank === 1)
                  return (
                    <span className='flex shrink-0' title='#1 Champion'>
                      <span className='relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-amber-200 via-amber-500 to-amber-800 shadow-[0_0_20px_rgba(255,200,0,0.4),0_3px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform active:scale-95'>
                        <span className='absolute inset-0 bg-linear-to-t from-amber-900/20 to-transparent' />
                        <svg
                          className='relative size-4 text-amber-950'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          aria-hidden
                        >
                          <path d='M12 2l2.4 6.2L21 8.5l-5.2 3.3L17.5 21h-11l1.7-9.2L3 8.5l6.6-.3L12 2z' />
                        </svg>
                        <span className='absolute -bottom-0.5 right-0 text-[8px] font-black leading-none text-amber-950/90'>
                          1
                        </span>
                      </span>
                    </span>
                  );
                if (rank === 2)
                  return (
                    <span className='flex shrink-0' title='#2 Runner-up'>
                      <span className='relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-slate-100 via-slate-300 to-slate-600 shadow-[0_0_18px_rgba(200,200,220,0.35),0_3px_10px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform active:scale-95'>
                        <span className='absolute inset-0 bg-linear-to-t from-slate-800/15 to-transparent' />
                        <svg
                          className='relative size-3.5 text-slate-800'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          aria-hidden
                        >
                          <circle cx='12' cy='10' r='6' />
                          <path d='M12 16v4M8 20h8' />
                        </svg>
                        <span className='absolute -bottom-0.5 right-0 text-[8px] font-black leading-none text-slate-800/90'>
                          2
                        </span>
                      </span>
                    </span>
                  );
                if (rank === 3)
                  return (
                    <span className='flex shrink-0' title='#3'>
                      <span className='relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-amber-200 via-amber-600 to-amber-900 shadow-[0_0_18px_rgba(205,140,50,0.35),0_3px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,230,180,0.3)] transition-transform active:scale-95'>
                        <span className='absolute inset-0 bg-linear-to-t from-amber-950/25 to-transparent' />
                        <svg
                          className='relative size-3.5 text-amber-100'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          aria-hidden
                        >
                          <path d='M12 2l2.4 6.2L21 8.5l-5.2 3.3L17.5 21h-11l1.7-9.2L3 8.5l6.6-.3L12 2z' />
                        </svg>
                        <span className='absolute -bottom-0.5 right-0 text-[8px] font-black leading-none text-amber-100/95'>
                          3
                        </span>
                      </span>
                    </span>
                  );
                return (
                  <span className='flex size-5 shrink-0 items-center justify-center text-[10px] tabular-nums text-(--ink-muted)'>
                    {String(rank).padStart(2, '0')}
                  </span>
                );
              };
              return (
                <Link
                  key={s._id}
                  href={`/story/${s.startupSlug}/wrapped`}
                  className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors ${
                    rankClass
                      ? 'hover:brightness-110 active:brightness-95'
                      : 'hover:bg-(--accent-soft)'
                  } ${rankClass}`}
                >
                  <RankBadge />
                  {s.startupIcon ? (
                    <Image
                      src={s.startupIcon}
                      alt=''
                      width={24}
                      height={24}
                      className='size-6 rounded object-cover'
                    />
                  ) : (
                    <div className='flex size-6 items-center justify-center rounded bg-(--void-4) text-[10px] font-bold text-(--neon)'>
                      {s.startupName[0]}
                    </div>
                  )}
                  <span className='min-w-0 flex-1 truncate text-sm font-medium text-foreground'>
                    {s.startupName}
                  </span>
                  {mrr != null && (
                    <span className='text-[10px] font-semibold tabular-nums text-(--neon)'>
                      {formatCurrency(mrr)}
                    </span>
                  )}
                  {growth30d != null && (
                    <span className='rounded bg-(--accent-alt-soft) px-1 py-0.5 text-[10px] font-medium text-(--hot)'>
                      +{formatPercent(growth30d)}
                    </span>
                  )}
                  {s.views != null && s.views > 0 && (
                    <span className='text-[10px] text-(--ink-muted)'>
                      {formatNumber(s.views)} views
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='holo-card rounded-2xl p-4'
      >
        <div className='mb-3 flex items-center gap-2'>
          <span className='inline-flex size-2 rounded-full bg-(--hot)' />
          <span className='text-xs font-bold uppercase tracking-widest text-(--hot)'>
            ◆ Latest
          </span>
        </div>
        <div className='panel-scroll max-h-48 space-y-0.5 overflow-y-auto'>
          {latest === undefined ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2.5 rounded-xl px-2.5 py-2'
                >
                  <span className='skeleton-hot h-6 w-6 shrink-0 rounded' />
                  <span className='skeleton-hot h-3.5 w-28 rounded' />
                </div>
              ))}
            </>
          ) : (
            latest?.map((s) => {
              const { mrr } = getStoryDisplayData(s);
              return (
                <Link
                  key={s._id}
                  href={`/story/${s.startupSlug}/wrapped`}
                  className='group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-(--accent-alt-soft)'
                >
                  {s.startupIcon ? (
                    <Image
                      src={s.startupIcon}
                      alt=''
                      width={24}
                      height={24}
                      className='size-6 rounded object-cover'
                    />
                  ) : (
                    <div className='flex size-6 items-center justify-center rounded bg-(--void-4) text-[10px] font-bold text-(--hot)'>
                      {s.startupName[0]}
                    </div>
                  )}
                  <span className='min-w-0 flex-1 truncate text-sm font-medium text-foreground'>
                    {s.startupName}
                  </span>
                  {mrr != null && (
                    <span className='text-[10px] font-semibold tabular-nums text-(--hot)'>
                      {formatCurrency(mrr)}
                    </span>
                  )}
                  {s.views != null && s.views > 0 && (
                    <span className='text-[10px] text-(--ink-muted)'>
                      {formatNumber(s.views)} views
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </motion.section>
    </div>
  );
}
