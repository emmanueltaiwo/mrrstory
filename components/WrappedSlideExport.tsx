'use client';

/**
 * Static export-only slide component.
 */
import { formatCurrency, formatCurrencyFull } from '@/lib/formatCurrency';
import { formatNumber, formatPercent } from '@/lib/formatNumber';

interface Slide {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
}

const NEON_COLOR = '#00ffc8';
const HOT_COLOR = '#ff3366';

/**
 * Solid color text for export - background-clip:text fails in html-to-image
 * canvas capture (renders as solid block), so we use solid accent colors.
 */
function StaticGradientText({
  children,
  gradient = 'neon',
}: {
  children: React.ReactNode;
  gradient?: 'neon' | 'hot';
}) {
  return (
    <span style={{ color: gradient === 'neon' ? NEON_COLOR : HOT_COLOR }}>
      {children}
    </span>
  );
}

function StaticBlob({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full opacity-40 ${className}`}
      style={{ filter: 'blur(90px)' }}
      aria-hidden
    />
  );
}

function StaticOrb({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full opacity-50 ${className}`}
      aria-hidden
    />
  );
}

export function WrappedSlideExport({
  slide,
  background,
}: {
  slide: Slide;
  background: string;
}) {
  const { type, data } = slide;
  const base =
    'relative flex h-full w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden text-center px-4 py-6';
  const labelClass =
    'text-[10px] font-medium uppercase tracking-[0.35em] text-white/50';
  const heroSize = { fontSize: 'clamp(1.75rem, 8vw, 3.5rem)' };

  const slideContent =
    type === 'intro' ? (
      <div className={base} style={{ background }}>
        <StaticBlob className='-right-24 -top-24 h-48 w-48 bg-(--neon)' />
        <StaticBlob className='-bottom-20 -left-20 h-40 w-40 bg-(--hot)' />
        <StaticOrb className='right-[15%] top-[20%] h-2 w-2 bg-(--neon)' />
        <StaticOrb className='left-[20%] bottom-[25%] h-2 w-2 bg-(--hot)' />
        <div className='mb-4 flex items-center gap-3'>
          <span className='h-px max-w-[40px] flex-1 bg-linear-to-r from-transparent to-(--neon)/50' />
          <span className={labelClass}>Meet your next obsession</span>
          <span className='h-px max-w-[40px] flex-1 bg-linear-to-l from-transparent to-(--neon)/50' />
        </div>
        <h1
          className='w-full max-w-full min-w-0 wrap-break-word px-2 font-display font-extrabold tracking-tight text-white'
          style={{
            textShadow: '0 0 40px rgba(0,255,200,0.15)',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            fontSize: 'clamp(1.5rem, 8vw, 3rem)',
          }}
        >
          {String(data.name ?? '')}
        </h1>
        <div className='mt-6 flex flex-wrap justify-center gap-2'>
          {data.category != null && (
            <span className='rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs'>
              {String(data.category)}
            </span>
          )}
          {data.country != null && (
            <span className='rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs'>
              {String(data.country)}
            </span>
          )}
          {data.foundedDate != null && (
            <span className='rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs'>
              Est. {new Date(String(data.foundedDate)).getFullYear()}
            </span>
          )}
        </div>
      </div>
    ) : type === 'revenue' ? (
      (() => {
        const mrr = data.mrr != null ? (data.mrr as number) : null;
        const last30 =
          data.last30Days != null ? (data.last30Days as number) : null;
        const total = data.total != null ? (data.total as number) : null;
        const customers =
          data.customers != null ? (data.customers as number) : null;
        if (mrr == null && last30 == null && total == null && customers == null)
          return null;
        const cards = [
          mrr != null && {
            label: 'MRR',
            value: formatCurrency(mrr),
            accent: true,
          },
          last30 != null && {
            label: 'Last 30d',
            value: formatCurrency(last30),
            accent: false,
          },
          total != null && {
            label: 'All time',
            value: formatCurrency(total),
            accent: false,
          },
        ].filter(Boolean) as {
          label: string;
          value: string;
          accent: boolean;
        }[];
        const subtitle =
          mrr != null && customers != null
            ? `MRR · ${formatNumber(customers)} customers`
            : mrr != null
              ? 'MRR'
              : customers != null
                ? `${formatNumber(customers)} customers`
                : null;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='-right-24 top-1/3 h-48 w-48 -translate-y-1/2 bg-(--neon)' />
            <StaticBlob className='-left-20 bottom-1/3 h-40 w-40 bg-(--hot)' />
            <StaticOrb className='right-[10%] top-1/4 h-2 w-2 bg-(--neon)' />
            <p className={labelClass}>The number that matters</p>
            {mrr != null && (
              <p
                className='mt-2 font-display font-extrabold break-all'
                style={heroSize}
              >
                <StaticGradientText gradient='neon'>
                  {formatCurrency(mrr)}
                </StaticGradientText>
              </p>
            )}
            {subtitle && (
              <p className='mt-1 text-lg font-semibold text-white/80'>
                {subtitle}
              </p>
            )}
            {cards.length > 0 && (
              <div className='mt-6 flex flex-wrap justify-center gap-3'>
                {cards.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl px-5 py-3 text-center ${
                      item.accent
                        ? 'border border-(--neon)/40 bg-(--neon)/10'
                        : 'border border-white/15 bg-white/5'
                    }`}
                  >
                    <span className='block text-xs uppercase text-white/50'>
                      {item.label}
                    </span>
                    <span
                      className={`font-display text-lg font-bold ${item.accent ? 'text-(--neon)' : 'text-white/90'}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'growth' ? (
      (() => {
        const g30 = data.growth30d != null ? (data.growth30d as number) : null;
        const gMrr =
          data.growthMRR30d != null ? (data.growthMRR30d as number) : null;
        if (g30 == null && gMrr == null) return null;
        const isPositive = g30 != null ? g30 > 0 : false;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='-left-24 top-1/3 h-48 w-48 bg-(--hot)' />
            <StaticBlob className='-right-20 bottom-1/3 h-40 w-40 bg-(--neon)' />
            <p className={labelClass}>
              {isPositive ? 'On the rise ↑' : '30-day snapshot'}
            </p>
            {g30 != null && (
              <>
                <p
                  className='mt-2 font-display font-extrabold break-all'
                  style={heroSize}
                >
                  <StaticGradientText gradient='hot'>
                    {formatPercent(g30)}
                  </StaticGradientText>
                </p>
                <p className='mt-2 text-base text-white/60'>revenue growth</p>
              </>
            )}
            {gMrr != null && (
              <div className='mt-6 rounded-2xl border border-(--hot)/30 bg-(--hot)/5 px-8 py-4'>
                <span className='text-sm text-white/50'>MRR growth </span>
                <span className='font-display font-bold text-(--hot)'>
                  {formatPercent(gMrr)}
                </span>
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'traffic' ? (
      (() => {
        const visitors =
          data.visitorsLast30Days != null
            ? (data.visitorsLast30Days as number)
            : null;
        const impressions =
          data.googleSearchImpressionsLast30Days != null
            ? (data.googleSearchImpressionsLast30Days as number)
            : null;
        if (visitors == null && impressions == null) return null;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='bottom-0 left-1/2 h-40 w-56 -translate-x-1/2 translate-y-1/2 bg-(--neon)' />
            <StaticOrb className='left-1/4 top-1/4 h-2 w-2 bg-(--neon)' />
            <p className={labelClass}>People showing up</p>
            {visitors != null && (
              <>
                <p
                  className='mt-2 font-display font-extrabold break-all'
                  style={heroSize}
                >
                  <StaticGradientText gradient='neon'>
                    {formatNumber(visitors)}
                  </StaticGradientText>
                </p>
                <p className='mt-1 text-base text-white/70'>
                  visitors in 30 days
                </p>
              </>
            )}
            {impressions != null && (
              <div className='mt-6 rounded-2xl border border-(--neon)/25 bg-(--neon)/5 px-6 py-3'>
                <span className='font-bold text-(--neon)'>
                  {formatNumber(impressions)}
                </span>
                <span className='ml-2 text-sm text-white/50'>
                  search impressions
                </span>
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'efficiency' ? (
      (() => {
        const rpv =
          data.revenuePerVisitor != null
            ? (data.revenuePerVisitor as number)
            : null;
        const margin =
          data.profitMarginLast30Days != null
            ? (data.profitMarginLast30Days as number)
            : null;
        if (rpv == null && margin == null) return null;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='-right-24 top-1/3 h-48 w-48 bg-(--neon)' />
            <StaticBlob className='-left-20 bottom-1/3 h-40 w-40 bg-(--hot)' />
            <p className={labelClass}>Conversion power</p>
            {rpv != null && (
              <>
                <p
                  className='mt-2 font-display font-extrabold break-all'
                  style={heroSize}
                >
                  <StaticGradientText gradient='neon'>
                    ${rpv.toFixed(2)}
                  </StaticGradientText>
                </p>
                <p className='mt-1 text-base text-white/70'>per visitor</p>
              </>
            )}
            {margin != null && (
              <div className='mt-8 rounded-2xl border border-(--neon)/30 bg-(--neon)/5 px-8 py-5'>
                <span className='font-display text-2xl font-extrabold text-white'>
                  {margin.toFixed(0)}%
                </span>
                <span className='ml-2 text-base text-white/60'>
                  profit margin
                </span>
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'subscriptions' ? (
      (() => {
        const subs =
          data.activeSubscriptions != null
            ? (data.activeSubscriptions as number)
            : null;
        const provider =
          data.paymentProvider != null
            ? (data.paymentProvider as string)
            : null;
        if (subs == null && provider == null) return null;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='left-1/2 top-1/4 h-40 w-40 -translate-x-1/2 bg-(--hot)' />
            <StaticOrb className='left-1/4 top-1/3 h-2 w-2 bg-(--hot)' />
            <p className={labelClass}>Recurring magic</p>
            {subs != null && (
              <>
                <p
                  className='mt-5 font-display font-extrabold break-all'
                  style={heroSize}
                >
                  <StaticGradientText gradient='hot'>
                    {formatNumber(subs)}
                  </StaticGradientText>
                </p>
                <p className='mt-2 text-base text-white/70'>
                  active subscriptions
                </p>
              </>
            )}
            {provider != null && (
              <div className='mt-6 rounded-2xl border border-(--hot)/20 bg-(--hot)/5 px-6 py-3'>
                powered by {provider}
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'sale' ? (
      (() => {
        const price =
          data.askingPrice != null ? (data.askingPrice as number) : null;
        const multi = data.multiple != null ? (data.multiple as number) : null;
        if (price == null && multi == null) return null;
        return (
          <div className={base} style={{ background }}>
            <StaticBlob className='-right-24 top-1/3 h-48 w-48 bg-(--neon)' />
            <StaticBlob className='-left-20 bottom-1/3 h-40 w-40 bg-(--hot)' />
            <StaticOrb className='right-[10%] top-1/4 h-2 w-2 bg-(--neon)' />
            <StaticOrb className='left-[15%] bottom-1/4 h-2 w-2 bg-(--hot)' />
            <p className={labelClass}>On the market</p>
            {price != null && (
              <>
                <p
                  className='mt-2 font-display font-extrabold break-all'
                  style={heroSize}
                >
                  <StaticGradientText gradient='neon'>
                    {formatCurrencyFull(price)}
                  </StaticGradientText>
                </p>
                <p className='mt-1 text-base text-white/60'>asking price</p>
              </>
            )}
            {multi != null && (
              <div className='mt-8 rounded-2xl border border-(--neon)/30 bg-(--neon)/5 px-8 py-5'>
                <span className='font-display text-2xl font-extrabold text-white'>
                  {multi.toFixed(1)}x
                </span>
                <span className='ml-2 text-base text-white/60'>
                  revenue multiple
                </span>
              </div>
            )}
          </div>
        );
      })()
    ) : type === 'outro' ? (
      <div className={base} style={{ background }}>
        <StaticBlob className='-left-20 top-1/3 h-40 w-40 bg-(--neon)' />
        <StaticBlob className='-right-20 bottom-1/3 h-40 w-40 bg-(--hot)' />
        <p className='max-w-full wrap-break-word px-2 font-display text-2xl font-bold text-white/90'>
          {String(data.name ?? '')} Story
        </p>
        {data.xHandle ? (
          <span className='mt-6 block max-w-full min-w-0 break-all px-2 font-display text-2xl font-bold text-[#00ffc8]'>
            @{String(data.xHandle).replace(/^@+/, '')}
          </span>
        ) : null}
        <div className='mt-14 flex items-center gap-4'>
          <span className='h-px w-8 bg-linear-to-r from-transparent to-white/20' />
          <span className='text-[10px] font-medium uppercase tracking-[0.5em] text-white/25'>
            MRRStory
          </span>
          <span className='h-px w-8 bg-linear-to-l from-transparent to-white/20' />
        </div>
      </div>
    ) : null;

  return (
    <div className='flex h-full w-full flex-col bg-[#08090a]'>
      <div className='flex min-h-0 flex-1 flex-col items-center justify-center'>
        {slideContent}
      </div>
      <div className='shrink-0 pb-6 pt-2 text-center text-[10px] font-medium uppercase tracking-[0.5em] text-white'>
        MRRStory.xyz
      </div>
    </div>
  );
}
