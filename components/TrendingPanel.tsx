'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatNumber, formatPercent } from '@/lib/formatNumber';
import { getStoryDisplayData, type StoryForCard } from '@/lib/storyUtils';

export function TrendingPanel() {
  const trending = useQuery(api.stories.listTrending, { limit: 16 }) as
    | StoryForCard[]
    | undefined;

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1)
      return (
        <span className='flex shrink-0' title='#1 Champion'>
          <span className='relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-amber-200 via-amber-500 to-amber-800 shadow-[0_0_24px_rgba(255,200,0,0.4),0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform hover:scale-105'>
            <span className='absolute inset-0 bg-linear-to-t from-amber-900/20 to-transparent' />
            <svg
              className='relative size-4.5 text-amber-950'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden
            >
              <path d='M12 2l2.4 6.2L21 8.5l-5.2 3.3L17.5 21h-11l1.7-9.2L3 8.5l6.6-.3L12 2z' />
            </svg>
            <span className='absolute -bottom-0.5 right-0.5 text-[9px] font-black leading-none text-amber-950/90'>
              1
            </span>
          </span>
        </span>
      );
    if (rank === 2)
      return (
        <span className='flex shrink-0' title='#2 Runner-up'>
          <span className='relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-100 via-slate-300 to-slate-600 shadow-[0_0_20px_rgba(200,200,220,0.35),0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform hover:scale-105'>
            <span className='absolute inset-0 bg-linear-to-t from-slate-800/15 to-transparent' />
            <svg
              className='relative size-4 text-slate-800'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              aria-hidden
            >
              <circle cx='12' cy='10' r='6' />
              <path d='M12 16v4M8 20h8' />
            </svg>
            <span className='absolute -bottom-0.5 right-0.5 text-[9px] font-black leading-none text-slate-800/90'>
              2
            </span>
          </span>
        </span>
      );
    if (rank === 3)
      return (
        <span className='flex shrink-0' title='#3'>
          <span className='relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-amber-200 via-amber-600 to-amber-900 shadow-[0_0_20px_rgba(205,140,50,0.35),0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,230,180,0.3)] transition-transform hover:scale-105'>
            <span className='absolute inset-0 bg-linear-to-t from-amber-950/25 to-transparent' />
            <svg
              className='relative size-4 text-amber-100'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden
            >
              <path d='M12 2l2.4 6.2L21 8.5l-5.2 3.3L17.5 21h-11l1.7-9.2L3 8.5l6.6-.3L12 2z' />
            </svg>
            <span className='absolute -bottom-0.5 right-0.5 text-[9px] font-black leading-none text-amber-100/95'>
              3
            </span>
          </span>
        </span>
      );
    return (
      <span className='flex size-6 shrink-0 items-center justify-center text-[10px] tabular-nums text-(--ink-muted)'>
        {String(rank).padStart(2, '0')}
      </span>
    );
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className='holo-card hidden w-0 flex-col overflow-hidden md:flex md:h-full md:min-h-0 md:max-h-full md:w-56 md:min-w-[224px] lg:w-64 lg:min-w-[256px] md:rounded-2xl'
    >
      <div className='shrink-0 border-b border-(--glass-border) px-4 py-4'>
        <div className='flex items-center gap-2'>
          <span className='inline-flex size-2 rounded-full bg-(--neon)' />
          <span className='text-xs font-bold uppercase tracking-widest text-(--neon)'>
            ↑ Trending
          </span>
        </div>
        <p className='mt-1 text-[10px] text-(--ink-muted)'>
          Stories people are watching
        </p>
      </div>

      <div
        className='panel-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3'
        style={{ flex: '1 1 0' }}
      >
        {trending === undefined ? (
          <ul className='space-y-0.5'>
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className='flex items-center gap-2.5 rounded-xl px-2.5 py-2.5'
              >
                <span className='skeleton-neon h-3 w-4 shrink-0' />
                <span className='skeleton h-7 w-7 shrink-0 rounded-md' />
                <div className='min-w-0 flex-1 space-y-1.5'>
                  <span className='skeleton-neon block h-3.5 w-3/4 rounded' />
                  <div className='flex gap-2'>
                    <span className='skeleton h-2.5 w-12 rounded' />
                    <span className='skeleton h-2.5 w-14 rounded' />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : trending?.length ? (
          <ul className='space-y-3'>
            {trending.map((s, i) => {
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

              return (
                <li key={s._id} className='min-w-0'>
                  <Link
                    href={`/story/${s.startupSlug}/wrapped`}
                    className={`group flex min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                      rankClass
                        ? 'hover:brightness-110'
                        : 'hover:bg-(--accent-soft)'
                    } ${rankClass}`}
                  >
                    <RankBadge rank={rank} />

                    {s.startupIcon ? (
                      <Image
                        src={s.startupIcon}
                        alt=''
                        width={28}
                        height={28}
                        className='size-7 shrink-0 rounded-md object-cover'
                      />
                    ) : (
                      <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-(--void-4) text-[10px] font-bold text-(--neon)'>
                        {s.startupName[0]}
                      </div>
                    )}
                    <div className='min-w-0 flex-1 overflow-hidden'>
                      <span className='block truncate text-sm font-medium text-foreground'>
                        {s.startupName}
                      </span>
                      <div className='mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px]'>
                        {mrr != null && (
                          <span className='shrink-0 font-semibold tabular-nums text-(--neon)'>
                            {formatCurrency(mrr)}
                          </span>
                        )}
                        {growth30d != null && (
                          <span className='shrink-0 rounded bg-(--accent-alt-soft) px-1.5 py-0.5 font-medium text-(--hot)'>
                            {growth30d >= 0 ? '+' : ''}
                            {formatPercent(growth30d)}
                          </span>
                        )}
                        {s.views != null && s.views > 0 && (
                          <span className='shrink-0 text-(--ink-muted)'>
                            {formatNumber(s.views)} views
                          </span>
                        )}
                      </div>
                    </div>
                    <span className='shrink-0 text-(--ink-muted) opacity-0 transition-opacity group-hover:opacity-100'>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='py-8 text-center text-xs text-(--ink-muted)'>
            No stories yet
          </p>
        )}
      </div>
    </motion.aside>
  );
}
