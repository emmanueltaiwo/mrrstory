import { NextResponse } from 'next/server';

const BASE_URL = 'https://trustmrr.com/api/v1';

export async function GET() {
  const apiKey = process.env.TRUSTMRR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TRUSTMRR_API_KEY not configured' },
      { status: 500 },
    );
  }

  const res = await fetch(`${BASE_URL}/startups?sort=revenue-desc&limit=5`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `TrustMRR API error: ${res.status}` },
      { status: res.status },
    );
  }

  const json = await res.json();
  const startups = json.data ?? [];

  return NextResponse.json({ data: startups });
}
