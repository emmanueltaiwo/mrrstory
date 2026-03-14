import { v } from 'convex/values';
import { internalQuery, mutation, query } from './_generated/server';

export const getById = query({
  args: { id: v.id('stories') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('stories')
      .withIndex('by_startup_slug', (q) => q.eq('startupSlug', slug))
      .first();
  },
});

export const listTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    const stories = await ctx.db
      .query('stories')
      .withIndex('by_views')
      .order('desc')
      .take(limit * 3);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const viewsLast24h = await Promise.all(
      stories.map(async (s) => {
        const views = await ctx.db
          .query('storyViews')
          .withIndex('by_story_id', (q) => q.eq('storyId', s._id))
          .collect();
        const last24h = views.filter(
          (view) => view.viewedAt > now - dayMs,
        ).length;
        return { story: s, last24h, shares: s.shares };
      }),
    );

    const scored = viewsLast24h
      .map(({ story, last24h, shares }) => {
        const recentBoost = story.generatedAt > now - 7 * dayMs ? 5 : 0;
        const score = last24h * 2 + shares * 3 + recentBoost;
        return { story, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map((s) => s.story);
  },
});

export const listLatest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    return await ctx.db
      .query('stories')
      .withIndex('by_generated_at')
      .order('desc')
      .take(limit);
  },
});

export const createOrUpdate = mutation({
  args: {
    startupSlug: v.string(),
    startupName: v.string(),
    startupIcon: v.optional(v.string()),
    slides: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('stories')
      .withIndex('by_startup_slug', (q) =>
        q.eq('startupSlug', args.startupSlug),
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        slides: args.slides,
        startupName: args.startupName,
        startupIcon: args.startupIcon,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('stories', {
      startupSlug: args.startupSlug,
      startupName: args.startupName,
      startupIcon: args.startupIcon,
      slides: args.slides,
      views: 0,
      shares: 0,
      generatedAt: now,
      updatedAt: now,
    });
  },
});

export const listAllForRefresh = internalQuery({
  args: {},
  handler: async (ctx) => {
    const stories = await ctx.db.query('stories').collect();
    return stories.map((s) => ({ id: s._id, startupSlug: s.startupSlug }));
  },
});

export const incrementViews = mutation({
  args: { storyId: v.id('stories') },
  handler: async (ctx, { storyId }) => {
    const story = await ctx.db.get(storyId);
    if (!story) return;
    await ctx.db.patch(storyId, {
      views: story.views + 1,
      updatedAt: Date.now(),
    });
    await ctx.db.insert('storyViews', { storyId, viewedAt: Date.now() });
  },
});
