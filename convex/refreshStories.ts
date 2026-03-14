'use node';

import type { Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';
import { api, internal } from './_generated/api';
import type { TrustMRRStartup } from './trustmrr';
import { generateSlides } from './trustmrr';

export const refreshAllStories = internalAction({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ updated: number; failed: number; total: number }> => {
    const apiKey = process.env.TRUSTMRR_API_KEY;
    if (!apiKey) {
      throw new Error('TRUSTMRR_API_KEY not configured');
    }

    const stories: { id: Id<'stories'>; startupSlug: string }[] =
      await ctx.runQuery(internal.stories.listAllForRefresh, {});

    let updated = 0;
    let failed = 0;

    for (const { startupSlug } of stories) {
      try {
        const res = await fetch(
          `https://trustmrr.com/api/v1/startups/${startupSlug}`,
          { headers: { Authorization: `Bearer ${apiKey}` } },
        );

        if (res.status === 404) {
          continue;
        }
        if (!res.ok) {
          failed++;
          continue;
        }

        const { data } = (await res.json()) as { data: TrustMRRStartup };
        const slides = generateSlides(data);

        await ctx.runMutation(api.stories.createOrUpdate, {
          startupSlug: data.slug,
          startupName: data.name,
          startupIcon: data.icon ?? undefined,
          slides,
        });
        updated++;
      } catch {
        failed++;
      }
    }

    return { updated, failed, total: stories.length };
  },
});
