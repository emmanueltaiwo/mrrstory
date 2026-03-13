'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '@/lib/formatCurrency';
import type { Startup } from '@/lib/types';

interface SearchProps {
  query: string;
  setQuery: (q: string) => void;
  results: Startup[];
  suggestions: Startup[];
  suggestionsLoading?: boolean;
  loading: boolean;
  focusedIndex: number;
  setFocusedIndex: (i: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function Search({
  query,
  setQuery,
  results,
  suggestions,
  suggestionsLoading = false,
  loading,
  focusedIndex,
  setFocusedIndex,
  inputRef,
  onKeyDown,
}: SearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className='w-full'
    >
      <div className='group relative overflow-hidden rounded-2xl border border-(--glass-border) bg-(--void-2)/90 transition-all duration-300 focus-within:border-(--neon)/40 focus-within:shadow-[0_0_40px_-12px_rgba(0,255,200,0.25)] focus-within:ring-1 focus-within:ring-(--neon)/15'>
        <div className='flex items-center gap-4 px-5 py-4'>
          <span
            className='flex shrink-0 text-(--ink-muted) transition-colors duration-300 group-focus-within:text-(--neon)'
            aria-hidden
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.75'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </svg>
          </span>
          <input
            ref={inputRef}
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Name a startup to discover...'
            className='min-w-0 flex-1 bg-transparent text-foreground placeholder:text-(--ink-muted) outline-none'
            aria-label='Search for a startup'
          />
          {loading ? (
            <span className='flex shrink-0 items-center gap-2 text-sm text-(--accent)'>
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-(--accent)' />
              Searching
            </span>
          ) : (
            query &&
            results.length > 0 && (
              <span className='shrink-0 text-xs font-medium tabular-nums text-(--ink-muted)'>
                {results.length} found
              </span>
            )
          )}
        </div>
      </div>

      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className='mt-3 overflow-hidden rounded-xl border border-(--glass-border) bg-(--void-3)/95 backdrop-blur-sm'
          >
            {loading && results.length === 0 ? (
              <ul className='divide-y divide-(--glass-border) px-2 py-3'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className='flex items-center gap-4 px-3 py-3.5 md:py-4'
                  >
                    <span className='skeleton-neon h-10 w-10 shrink-0 rounded-lg' />
                    <span className='skeleton-neon h-4 w-32 shrink-0 rounded' />
                    <span className='skeleton ml-auto h-4 w-16 rounded' />
                  </li>
                ))}
              </ul>
            ) : results.length === 0 ? (
              <div className='px-5 py-6 text-sm text-(--ink-muted)'>
                No stories found for &quot;{query}&quot;
              </div>
            ) : (
              <ul className='divide-y divide-(--glass-border) max-h-[60vh] overflow-y-auto panel-scroll'>
                {results.map((s, i) => {
                  const mrr = s.revenue?.mrr ?? s.revenue?.last30Days;
                  const focused = i === focusedIndex;
                  return (
                    <motion.li
                      key={s.slug}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(i * 0.03, 0.15),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={`/story/${s.slug}`}
                        className={`flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 md:py-4 ${
                          focused ? 'bg-(--accent-soft)' : 'hover:bg-(--glass)'
                        }`}
                        onMouseEnter={() => setFocusedIndex(i)}
                      >
                        {s.icon ? (
                          <Image
                            src={s.icon}
                            alt=''
                            width={40}
                            height={40}
                            className='size-10 shrink-0 rounded-lg object-cover ring-1 ring-(--glass-border)'
                          />
                        ) : (
                          <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--void-4) font-semibold text-(--accent) ring-1 ring-(--glass-border)'>
                            {s.name[0]}
                          </div>
                        )}
                        <span className='min-w-0 flex-1 truncate font-medium text-foreground'>
                          {s.name}
                        </span>
                        {mrr != null && (
                          <span className='shrink-0 text-sm font-semibold tabular-nums text-(--accent)'>
                            {formatCurrency(mrr)}
                          </span>
                        )}
                        <span className='shrink-0 text-(--ink-muted)'>→</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className='mt-6'
        >
          <p className='mb-3 text-xs font-medium uppercase tracking-widest text-(--ink-muted)'>
            Jump in
          </p>
          {suggestionsLoading ? (
            <div className='flex flex-wrap justify-center gap-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className='skeleton-neon inline-block h-10 w-24 rounded-xl md:w-28'
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-2'>
              {suggestions.map(({ slug, name }, i) => (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.45 + i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`/story/${slug}`}
                    className='inline-flex items-center gap-2 rounded-xl border border-(--glass-border) bg-(--void-3) px-4 py-2.5 text-sm font-medium text-(--ink-soft) transition-all duration-200 hover:border-(--neon)/40 hover:bg-(--accent-soft) hover:text-(--neon)'
                  >
                    <span className='text-(--neon)/80'>✦</span>
                    {name}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <p className='mt-4 text-center text-[10px] text-(--ink-muted) md:text-xs'>
        Arrow keys · Enter · Escape
      </p>
    </motion.div>
  );
}
