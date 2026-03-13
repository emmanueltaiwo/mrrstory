'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';
import type { TrustMRRStartup } from './trustmrr';
import { generateSlides } from './trustmrr';

export const ensureStory = action({
  args: { slug: v.string() },
  handler: async (ctx, { slug }): Promise<unknown> => {
    const existing = await ctx.runQuery(api.stories.getBySlug, { slug });
    if (existing) return existing;

    const apiKey = process.env.TRUSTMRR_API_KEY;
    if (!apiKey) throw new Error('TRUSTMRR_API_KEY not configured');

    const res = await fetch(`https://trustmrr.com/api/v1/startups/${slug}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`TrustMRR API error: ${res.status}`);

    const { data } = (await res.json()) as { data: TrustMRRStartup };
    const slides = generateSlides(data);

    const id = await ctx.runMutation(api.stories.createOrUpdate, {
      startupSlug: data.slug,
      startupName: data.name,
      startupIcon: data.icon ?? undefined,
      slides,
    });

    return await ctx.runQuery(api.stories.getById, { id });
  },
});
