const BASE_URL = 'https://trustmrr.com/api/v1';

export interface TrustMRRStartup {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  foundedDate: string | null;
  category: string | null;
  paymentProvider: string;
  targetAudience: string | null;
  revenue: {
    last30Days: number;
    mrr: number;
    total: number;
  };
  customers: number;
  activeSubscriptions: number;
  askingPrice: number | null;
  profitMarginLast30Days: number | null;
  growth30d: number | null;
  growthMRR30d: number | null;
  multiple: number | null;
  rank: number | null;
  visitorsLast30Days: number | null;
  googleSearchImpressionsLast30Days: number | null;
  revenuePerVisitor: number | null;
  onSale: boolean;
  firstListedForSaleAt: string | null;
  xHandle: string | null;
}

export interface TrustMRRListResponse {
  data: TrustMRRStartup[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface TrustMRRDetailResponse {
  data: TrustMRRStartup;
}

function getApiKey(): string {
  const key = process.env.TRUSTMRR_API_KEY;
  if (!key) {
    throw new Error('TRUSTMRR_API_KEY is not set');
  }
  return key;
}

export async function searchStartups(
  query: string,
  limit = 20,
): Promise<TrustMRRStartup[]> {
  const res = await fetch(
    `${BASE_URL}/startups?limit=${limit}&sort=revenue-desc`,
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`TrustMRR API error: ${res.status}`);
  }

  const json: TrustMRRListResponse = await res.json();
  const q = query.toLowerCase().trim();
  if (!q) return json.data;

  return json.data.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q)),
  );
}

export async function getStartup(
  slug: string,
): Promise<TrustMRRStartup | null> {
  const res = await fetch(`${BASE_URL}/startups/${slug}`, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`TrustMRR API error: ${res.status}`);
  }

  const json: TrustMRRDetailResponse = await res.json();
  return json.data;
}
