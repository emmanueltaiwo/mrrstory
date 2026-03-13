import { ImageResponse } from 'next/og';

export const alt = 'MRRStory — Shareable startup stories with verified MRR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          gap: 16,
          padding: 48,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#00ffc8',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          MRRStory
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#9a9aa8',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Shareable startup stories with verified MRR
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: '#6b6b7a',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            TrustMRR data
          </span>
          <span
            style={{
              fontSize: 16,
              color: '#6b6b7a',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            Wrapped-style stories
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
