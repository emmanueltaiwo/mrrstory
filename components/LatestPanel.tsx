'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatNumber } from '@/lib/formatNumber';
import { getStoryDisplayData, type StoryForCard } from '@/lib/storyUtils';

export function LatestPanel() {
  const latest = useQuery(api.stories.listLatest, { limit: 16 }) as
    | StoryForCard[]
    | undefined;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className='holo-card hidden w-0 flex-col overflow-hidden md:flex md:h-full md:min-h-0 md:max-h-full md:w-56 md:min-w-[224px] lg:w-64 lg:min-w-[256px] md:rounded-2xl'
    >
      <div className='shrink-0 border-b border-(--glass-border) px-4 py-4'>
        <div className='flex items-center gap-2'>
          <span className='inline-flex size-2 rounded-full bg-(--hot)' />
          <span className='text-xs font-bold uppercase tracking-widest text-(--hot)'>
            ◆ Latest
          </span>
        </div>
        <p className='mt-1 text-[10px] text-(--ink-muted)'>Newest stories</p>
      </div>
      <div
        className='panel-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3'
        style={{ flex: '1 1 0' }}
      >
        {latest === undefined ? (
          <ul className='space-y-0.5'>
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className='flex items-center gap-2.5 rounded-xl px-2.5 py-2.5'
              >
                <span className='skeleton-hot h-7 w-7 shrink-0 rounded-md' />
                <div className='min-w-0 flex-1 space-y-1.5'>
                  <span className='skeleton-hot block h-3.5 w-4/5 rounded' />
                  <span className='skeleton block h-2.5 w-16 rounded' />
                </div>
              </li>
            ))}
          </ul>
        ) : latest?.length ? (
          <ul className='space-y-3'>
            {latest.map((s) => {
              const { mrr } = getStoryDisplayData(s);
              return (
                <li key={s._id}>
                  <Link
                    href={`/story/${s.startupSlug}/wrapped`}
                    className='group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-(--accent-alt-soft)'
                  >
                    {s.startupIcon ? (
                      <Image
                        src={s.startupIcon}
                        alt=''
                        width={28}
                        height={28}
                        className='size-7 shrink-0 rounded-md object-cover'
                      />
                    ) : (
                      <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-(--void-4) text-[10px] font-bold text-(--hot)'>
                        {s.startupName[0]}
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <span className='block truncate text-sm font-medium text-foreground'>
                        {s.startupName}
                      </span>
                      <div className='flex items-center gap-2 text-[10px]'>
                        {mrr != null && (
                          <span className='font-semibold tabular-nums text-(--hot)'>
                            {formatCurrency(mrr)}
                          </span>
                        )}
                        {s.views != null && s.views > 0 && (
                          <span className='text-(--ink-muted)'>
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
            No data yet
          </p>
        )}
      </div>
    </motion.aside>
  );
}
