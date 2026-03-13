import { NextRequest, NextResponse } from 'next/server';

const SEARCH_URL = 'https://trustmrr.com/api/startup/search';

interface TrustMRRSearchStartup {
  _id: string;
  name: string;
  slug: string;
  icon: string | null;
  currentTotalRevenue?: number;
  currentLast30DaysRevenue?: number;
  [key: string]: unknown;
}

interface TrustMRRSearchResponse {
  startups: TrustMRRSearchStartup[];
}

function mapToStartup(s: TrustMRRSearchStartup) {
  const last30 = s.currentLast30DaysRevenue ?? 0;
  return {
    name: s.name,
    slug: s.slug,
    icon: s.icon ?? null,
    category: null as string | null,
    country: null as string | null,
    revenue: {
      mrr: last30,
      last30Days: last30,
      total: s.currentTotalRevenue ?? 0,
    },
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10) || 20,
    50,
  );

  if (!q.trim()) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(q.trim())}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: `TrustMRR search error: ${res.status}` },
        { status: res.status },
      );
    }

    const json: TrustMRRSearchResponse = await res.json();
    const startups = (json.startups ?? []).slice(0, limit).map(mapToStartup);

    return NextResponse.json({ data: startups });
  } catch (err) {
    console.error('TrustMRR search error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
