import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  stories: defineTable({
    startupSlug: v.string(),
    startupName: v.string(),
    startupIcon: v.optional(v.string()),
    slides: v.array(v.any()),
    views: v.number(),
    shares: v.number(),
    generatedAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_startup_slug', ['startupSlug'])
    .index('by_generated_at', ['generatedAt'])
    .index('by_views', ['views']),

  storyViews: defineTable({
    storyId: v.id('stories'),
    viewedAt: v.number(),
  })
    .index('by_story_id', ['storyId'])
    .index('by_viewed_at', ['viewedAt']),
});
