'use client';

import { motion } from 'motion/react';
import { formatCurrency, formatCurrencyFull } from '@/lib/formatCurrency';
import { formatNumber, formatPercent } from '@/lib/formatNumber';

interface SlideProps {
  slide: {
    id: string;
    type: string;
    title: string;
    data: Record<string, unknown>;
  };
  index: number;
  compact?: boolean;
}

function GradientText({
  children,
  gradient = 'neon',
  shimmer = false,
}: {
  children: React.ReactNode;
  gradient?: 'neon' | 'hot';
  shimmer?: boolean;
}) {
  const base =
    gradient === 'neon'
      ? 'linear-gradient(90deg, #00a080 0%, #00ffc8 20%, #00e5aa 40%, #00ffc8 60%, #00e5aa 80%, #00a080 100%)'
      : 'linear-gradient(90deg, #cc2244 0%, #ff3366 20%, #ff5c82 40%, #ff3366 60%, #ff5c82 80%, #cc2244 100%)';
  const style: React.CSSProperties = {
    background: base,
    backgroundSize: shimmer ? '200% auto' : '100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    animation: shimmer ? 'shimmer 5s linear infinite' : undefined,
  };
  return <span style={style}>{children}</span>;
}

function Blob({
  className = '',
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-full opacity-40 ${animate ? 'blob-animate' : ''} ${className}`}
      style={{ filter: 'blur(90px)' }}
      aria-hidden
    />
  );
}

function Orb({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full orb-drift opacity-50 ${className}`}
      aria-hidden
    />
  );
}

function StatPill({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block max-w-full truncate rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs backdrop-blur-xl md:rounded-2xl md:px-4 md:py-2 md:text-sm ${className}`}
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}
    >
      {children}
    </span>
  );
}

export function WrappedSlide({ slide, index, compact = false }: SlideProps) {
  const { type, data } = slide;
  const t = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };
  const c = compact;

  // Typography: bigger heroes, still responsive
  const labelClass = c
    ? 'text-[10px] tracking-[0.35em] md:text-xs'
    : 'text-xs tracking-[0.5em] md:text-sm';
  const heroSize = c
    ? { fontSize: 'clamp(2rem, 8vw, 4rem)' }
    : { fontSize: 'clamp(3rem, 14vw, 7.5rem)' };
  const subClass = c
    ? 'text-base md:text-lg'
    : 'text-xl md:text-2xl lg:text-3xl';
  const spacing = c ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4';
  const pySlide = c ? 'py-6 md:py-8' : 'py-8 md:py-10 lg:py-12';
  const pxSlide = c ? 'px-4 md:px-6' : 'px-5 md:px-8 lg:px-10';

  if (type === 'intro') {
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-right-32 -top-32 h-72 w-72 bg-(--neon) md:h-96 md:w-96' />
        <Blob className='-bottom-24 -left-24 h-64 w-64 bg-(--hot) md:h-80 md:w-80' />
        <Orb className='right-[15%] top-[20%] h-2 w-2 bg-(--neon) md:h-3 md:w-3' />
        <Orb className='left-[20%] bottom-[25%] h-2 w-2 bg-(--hot) md:h-3 md:w-3' />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: 0.1 }}
          className='mb-4 flex items-center gap-3'
        >
          <span className='h-px flex-1 max-w-[60px] bg-linear-to-r from-transparent to-(--neon)/50' />
          <span
            className={`font-medium uppercase tracking-[0.5em] text-white/50 ${labelClass}`}
          >
            Meet your next obsession
          </span>
          <span className='h-px flex-1 max-w-[60px] bg-linear-to-l from-transparent to-(--neon)/50' />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 32, scale: 0.92, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ ...t, delay: 0.2, duration: 0.8 }}
          className='float-subtle w-full max-w-full min-w-0 wrap-break-word px-2 font-display font-extrabold tracking-tight text-white'
          style={{
            textShadow:
              '0 0 60px rgba(0,255,200,0.2), 0 0 120px rgba(0,255,200,0.08)',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            fontSize: c
              ? 'clamp(1.75rem, 6vw, 4rem)'
              : 'clamp(2.5rem, 10vw, 6.5rem)',
          }}
        >
          {String(data.name ?? '')}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: 0.5 }}
          className={`mt-8 flex min-w-0 max-w-full flex-wrap justify-center ${spacing}`}
        >
          {data.category != null && (
            <StatPill>{String(data.category)}</StatPill>
          )}
          {data.country != null && <StatPill>{String(data.country)}</StatPill>}
          {data.foundedDate != null && (
            <StatPill>
              Est. {new Date(String(data.foundedDate)).getFullYear()}
            </StatPill>
          )}
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'revenue') {
    const mrr = (data.mrr as number) ?? 0;
    const last30 = (data.last30Days as number) ?? 0;
    const total = (data.total as number) ?? 0;
    const customers = (data.customers as number) ?? 0;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-right-32 top-1/3 h-72 w-72 bg-(--neon) md:h-96 md:w-96' />
        <Blob className='-left-24 bottom-1/3 h-56 w-56 bg-(--hot) md:h-72 md:w-72' />
        <Orb className='right-[10%] top-1/4 h-2 w-2 bg-(--neon)' />
        <Orb className='left-[15%] bottom-1/4 h-2 w-2 bg-(--hot)' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          The number that matters
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...t, delay: 0.2, duration: 0.7 }}
          className='hero-glow-neon float-subtle mt-3 min-w-0 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='neon' shimmer>
            {formatCurrency(mrr)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-2 font-semibold text-white/80 ${subClass}`}
        >
          MRR · {formatNumber(customers)} customers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: 0.5 }}
          className={`mt-10 flex flex-wrap justify-center gap-4 ${spacing}`}
        >
          {[
            { label: 'MRR', value: formatCurrency(mrr), accent: true },
            {
              label: 'Last 30d',
              value: formatCurrency(last30),
              accent: false,
            },
            {
              label: 'All time',
              value: formatCurrency(total),
              accent: false,
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...t, delay: 0.55 + i * 0.08 }}
              className={`card-glow-neon relative overflow-hidden rounded-2xl border px-6 py-4 text-center backdrop-blur-md md:rounded-3xl md:px-8 md:py-5 ${
                item.accent
                  ? 'border-(--neon)/40 bg-(--neon)/10'
                  : 'border-white/15 bg-white/5'
              }`}
            >
              <span className='block text-xs uppercase tracking-wider text-white/50'>
                {item.label}
              </span>
              <span
                className={`font-display text-xl font-bold md:text-2xl ${item.accent ? 'text-(--neon)' : 'text-white/90'}`}
              >
                {item.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'growth') {
    const g30 = (data.growth30d as number) ?? 0;
    const gMrr = (data.growthMRR30d as number) ?? 0;
    const isPositive = g30 > 0;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-left-32 top-1/3 h-72 w-72 bg-(--hot) md:h-96 md:w-96' />
        <Blob className='-right-24 bottom-1/3 h-56 w-56 bg-(--neon) md:h-72 md:w-72' />
        <Orb className='left-[12%] top-1/4 h-3 w-3 bg-(--hot)' />
        <Orb className='right-[15%] bottom-1/3 h-2 w-2 bg-(--neon)' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          {isPositive ? 'On the rise ↑' : '30-day snapshot'}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...t, delay: 0.2, duration: 0.7 }}
          className='hero-glow-hot float-subtle mt-3 min-w-0 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='hot' shimmer>
            {formatPercent(g30)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-3 text-white/60 ${subClass}`}
        >
          revenue growth
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...t, delay: 0.5 }}
          className='mt-8 rounded-2xl border border-(--hot)/30 bg-(--hot)/5 px-10 py-4 backdrop-blur-md md:rounded-3xl md:px-12 md:py-5'
        >
          <span className='text-sm text-white/50'>MRR growth </span>
          <span className='font-display text-2xl font-bold text-(--hot) md:text-3xl'>
            {formatPercent(gMrr)}
          </span>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'traffic') {
    const visitors = (data.visitorsLast30Days as number) ?? 0;
    const impressions = (data.googleSearchImpressionsLast30Days as number) ?? 0;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='bottom-0 left-1/2 h-64 w-80 -translate-x-1/2 translate-y-1/2 bg-(--neon) md:h-80 md:w-96' />
        <Orb className='left-1/4 top-1/4 h-2 w-2 bg-(--neon)' />
        <Orb className='right-1/4 top-1/3 h-2 w-2 bg-white/30' />
        <Orb className='left-1/3 bottom-1/4 h-2 w-2 bg-(--neon)/60' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          People showing up
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...t, delay: 0.2, duration: 0.7 }}
          className='hero-glow-neon float-subtle mt-3 min-w-0 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='neon' shimmer>
            {formatNumber(visitors)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-2 text-white/70 ${subClass}`}
        >
          visitors in 30 days
        </motion.p>
        {impressions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...t, delay: 0.5 }}
            className='mt-8 rounded-2xl border border-(--neon)/25 bg-(--neon)/5 px-8 py-4 backdrop-blur-md md:rounded-3xl'
          >
            <span className='text-lg font-bold text-(--neon)'>
              {formatNumber(impressions)}
            </span>
            <span className='ml-2 text-sm text-white/50'>
              search impressions
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (type === 'efficiency') {
    const rpv = (data.revenuePerVisitor as number) ?? 0;
    const margin = (data.profitMarginLast30Days as number) ?? 0;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-right-32 top-1/3 h-64 w-64 bg-(--neon) md:h-80 md:w-80' />
        <Blob className='-left-24 bottom-1/3 h-56 w-56 bg-(--hot) md:h-72 md:w-72' />
        <Orb className='right-1/4 top-1/4 h-2 w-2 bg-(--neon)' />
        <Orb className='left-1/4 bottom-1/3 h-2 w-2 bg-(--hot)' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          Conversion power
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...t, delay: 0.2 }}
          className='hero-glow-neon float-subtle mt-3 min-w-0 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='neon' shimmer>
            ${rpv.toFixed(2)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-1 text-white/70 ${subClass}`}
        >
          per visitor
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...t, delay: 0.5 }}
          className='mt-10 rounded-2xl border border-(--neon)/30 bg-(--neon)/5 px-10 py-5 backdrop-blur-md md:rounded-3xl md:px-12 md:py-6'
        >
          <span className='font-display text-3xl font-extrabold text-white md:text-4xl'>
            {margin.toFixed(0)}%
          </span>
          <span className='ml-3 text-lg text-white/60 md:text-xl'>
            profit margin
          </span>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'subscriptions') {
    const subs = (data.activeSubscriptions as number) ?? 0;
    const provider = (data.paymentProvider as string) ?? '';
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='left-1/2 top-1/4 h-56 w-56 -translate-x-1/2 bg-(--hot) md:h-80 md:w-80' />
        <Orb className='left-1/4 top-1/3 h-2 w-2 bg-(--hot)' />
        <Orb className='right-1/4 top-1/3 h-2 w-2 bg-(--neon)' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          Recurring magic
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...t, delay: 0.2 }}
          className='hero-glow-hot float-subtle mt-5 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='hot' shimmer>
            {formatNumber(subs)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-2 text-white/70 ${subClass}`}
        >
          active subscriptions
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: 0.5 }}
          className='mt-8'
        >
          <StatPill className='max-w-full truncate border-(--hot)/20 bg-(--hot)/5 px-6 py-3 md:px-8 md:py-4'>
            powered by {provider}
          </StatPill>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'sale') {
    const price = (data.askingPrice as number) ?? 0;
    const multi = (data.multiple as number) ?? 0;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-right-32 top-1/3 h-72 w-72 bg-(--neon) md:h-96 md:w-96' />
        <Blob className='-left-24 bottom-1/3 h-56 w-56 bg-(--hot) md:h-72 md:w-72' />
        <Orb className='right-[10%] top-1/4 h-2 w-2 bg-(--neon)' />
        <Orb className='left-[15%] bottom-1/4 h-2 w-2 bg-(--hot)' />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.1 }}
          className={`font-medium uppercase tracking-widest text-white/50 ${labelClass}`}
        >
          On the market
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...t, delay: 0.2, duration: 0.7 }}
          className='hero-glow-neon float-subtle mt-3 min-w-0 max-w-full break-all font-display font-extrabold'
          style={heroSize}
        >
          <GradientText gradient='neon' shimmer>
            {formatCurrencyFull(price)}
          </GradientText>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.35 }}
          className={`mt-2 text-white/60 ${subClass}`}
        >
          asking price
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...t, delay: 0.5 }}
          className='mt-10 rounded-2xl border border-(--neon)/30 bg-(--neon)/5 px-10 py-5 backdrop-blur-md md:rounded-3xl md:px-12 md:py-6'
        >
          <span className='font-display text-3xl font-extrabold text-white md:text-4xl'>
            {multi.toFixed(1)}x
          </span>
          <span className='ml-3 text-lg text-white/60 md:text-xl'>
            revenue multiple
          </span>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'outro') {
    const handle = data.xHandle as string | null;
    const name = data.name as string;
    return (
      <motion.div
        key={slide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t}
        className={`relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center ${pxSlide} ${pySlide}`}
      >
        <Blob className='-left-24 top-1/3 h-56 w-56 bg-(--neon) md:h-72 md:w-72' />
        <Blob className='-right-24 bottom-1/3 h-56 w-56 bg-(--hot) md:h-72 md:w-72' />
        <Orb className='left-1/4 top-1/4 h-2 w-2 bg-(--neon)' />
        <Orb className='right-1/4 bottom-1/4 h-2 w-2 bg-(--hot)' />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: 0.2 }}
          className='max-w-full wrap-break-word px-2 font-display text-3xl font-bold text-white/90 md:text-4xl lg:text-5xl'
        >
          {name} Story
        </motion.p>
        {handle && (
          <motion.a
            href={`https://x.com/${handle}`}
            target='_blank'
            rel='noopener noreferrer'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...t, delay: 0.35 }}
            className='float-subtle mt-8 max-w-full break-all font-display text-3xl font-bold text-(--neon) transition hover:text-(--neon)/80 md:text-4xl lg:text-5xl'
          >
            @{handle}
          </motion.a>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...t, delay: 0.55 }}
          className='mt-16 flex items-center gap-4'
        >
          <span className='h-px w-12 bg-linear-to-r from-transparent to-white/20' />
          <span className='text-[10px] font-medium uppercase tracking-[0.6em] text-white/30 md:text-xs md:tracking-[0.8em]'>
            MRRStory
          </span>
          <span className='h-px w-12 bg-linear-to-l from-transparent to-white/20' />
        </motion.div>
      </motion.div>
    );
  }

  return null;
}
