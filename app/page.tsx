'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from '@/components/Search';
import { TrendingPanel } from '@/components/TrendingPanel';
import { LatestPanel } from '@/components/LatestPanel';
import { MobileStoriesPanels } from '@/components/MobileStoriesPanels';
import { AmbientGlow } from '@/components/AmbientGlow';
import type { Startup } from '@/lib/types';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Startup[]>([]);
  const [suggestions, setSuggestions] = useState<Startup[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSuggestionsLoading(true);
    fetch('/api/startups/top')
      .then((res) => res.json())
      .then(({ data }) => setSuggestions(data ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setSuggestionsLoading(false));
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/startups/search?q=${encodeURIComponent(q)}&limit=8`,
      );
      const { data } = await res.json();
      setResults(data ?? []);
      setFocusedIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    if (results.length > 0) setFocusedIndex(0);
  }, [results.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!query || results.length === 0) {
      if (e.key === 'Escape') setQuery('');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (
      e.key === 'Enter' &&
      focusedIndex >= 0 &&
      results[focusedIndex]
    ) {
      e.preventDefault();
      window.location.href = `/story/${results[focusedIndex].slug}`;
    } else if (e.key === 'Escape') {
      setQuery('');
      setFocusedIndex(-1);
    }
  };

  return (
    <div className='relative flex min-h-dvh flex-col overflow-hidden bg-void bg-noise pb-10 md:h-dvh lg:pb-0'>
      <header className='relative z-20 flex shrink-0 items-center justify-between px-4 py-3 md:px-6 md:py-4'>
        <Link
          href='/'
          className='font-display text-lg font-bold tracking-tight text-foreground transition-colors hover:text-(--neon) md:text-xl'
        >
          MRR<span className='text-(--neon)'>Story</span>
        </Link>
        <div className='flex items-center gap-2'>
          <p className='text-xs font-medium text-(--ink-soft)'>Powered by </p>
          <a
            href='https://trustmrr.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs font-medium text-(--ink-soft) transition-colors hover:text-(--neon)'
          >
            TrustMRR →
          </a>
        </div>
      </header>

      <div className='relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto md:min-h-0 md:h-full md:flex-row md:gap-4 md:overflow-hidden md:px-4 md:pb-6'>
        <TrendingPanel />

        <main className='flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 md:py-8'>
          <div className='flex w-full max-w-xl flex-col items-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className='mb-8 text-center md:mb-10'
            >
              <h1 className='font-display text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl md:text-5xl lg:text-6xl'>
                Enter the
                <br />
                <span className='bg-linear-to-r from-(--neon) to-(--hot) bg-clip-text text-transparent'>
                  revenue void
                </span>
              </h1>
              <p className='mt-3 text-sm text-(--ink-soft) md:mt-4'>
                Verified MRR · Wrapped-style stories · One search away
              </p>
            </motion.div>

            <Search
              query={query}
              setQuery={setQuery}
              results={results}
              suggestions={suggestions}
              suggestionsLoading={suggestionsLoading}
              loading={loading}
              focusedIndex={focusedIndex}
              setFocusedIndex={setFocusedIndex}
              inputRef={inputRef}
              onKeyDown={handleKeyDown}
            />
          </div>
        </main>

        <LatestPanel />
        <MobileStoriesPanels />
      </div>

      <AmbientGlow />
    </div>
  );
}
