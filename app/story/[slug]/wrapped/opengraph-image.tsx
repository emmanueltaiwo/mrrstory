import { ImageResponse } from 'next/og';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { formatCurrency } from '@/lib/formatCurrency';

export const alt = 'MRRStory — Shareable startup stories with verified MRR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

function DefaultImage() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#08080a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50%',
          height: '60%',
          background:
            'radial-gradient(ellipse, rgba(0, 255, 200, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '45%',
          height: '50%',
          background:
            'radial-gradient(ellipse, rgba(255, 51, 102, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#00ffc8',
            letterSpacing: '-0.02em',
          }}
        >
          MRRStory
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#9a9aa8',
            textAlign: 'center',
          }}
        >
          Shareable startup stories with verified MRR
        </div>
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return new ImageResponse(<DefaultImage />, { ...size });
  }

  const story = await fetchQuery(api.stories.getBySlug, { slug });

  if (!story || !story.slides?.length) {
    return new ImageResponse(<DefaultImage />, { ...size });
  }

  const revenueSlide = story.slides.find(
    (s: { type?: string }) => s.type === 'revenue',
  );
  const revenueData = revenueSlide?.data as
    | { mrr?: number; last30Days?: number }
    | undefined;
  const mrr = revenueData?.mrr ?? revenueData?.last30Days ?? 0;
  const mrrFormatted = formatCurrency(mrr);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#08080a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50%',
          height: '60%',
          background:
            'radial-gradient(ellipse, rgba(0, 255, 200, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '45%',
          height: '50%',
          background:
            'radial-gradient(ellipse, rgba(255, 51, 102, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 48,
          zIndex: 1,
        }}
      >
        {story.startupIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.startupIcon}
            alt=''
            width={80}
            height={80}
            style={{
              borderRadius: 16,
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'rgba(0, 255, 200, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: '#00ffc8',
            }}
          >
            {story.startupName?.[0] ?? '?'}
          </div>
        )}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#f5f5f0',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {story.startupName}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#00ffc8',
            letterSpacing: '-0.02em',
          }}
        >
          {mrrFormatted} MRR
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#9a9aa8',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>MRRStory</span>
          <span style={{ color: '#6b6b7a' }}>·</span>
          <span>Verified by TrustMRR</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
