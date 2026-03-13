export interface StoryForCard {
  _id: string;
  startupSlug: string;
  startupName: string;
  startupIcon?: string | null;
  slides: { type: string; data: Record<string, unknown> }[];
  views: number;
}

export function getStoryDisplayData(story: {
  slides: { type: string; data: Record<string, unknown> }[];
}) {
  const intro = story.slides.find((s) => s.type === 'intro')?.data ?? {};
  const revenue = story.slides.find((s) => s.type === 'revenue')?.data ?? {};
  const growth = story.slides.find((s) => s.type === 'growth')?.data ?? {};

  return {
    country: (intro.country as string) ?? null,
    mrr: revenue.mrr as number | undefined,
    growth30d: (growth.growth30d ?? growth.growthMRR30d) as
      | number
      | null
      | undefined,
  };
}
