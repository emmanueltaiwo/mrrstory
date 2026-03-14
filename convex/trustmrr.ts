export interface TrustMRRStartup {
  name: string;
  slug: string;
  icon: string | null;
  revenue: { last30Days: number; mrr: number; total: number };
  customers: number;
  activeSubscriptions: number;
  askingPrice: number | null;
  profitMarginLast30Days: number | null;
  growth30d: number | null;
  growthMRR30d: number | null;
  multiple: number | null;
  visitorsLast30Days: number | null;
  googleSearchImpressionsLast30Days: number | null;
  revenuePerVisitor: number | null;
  paymentProvider: string;
  onSale: boolean;
  xHandle: string | null;
  category: string | null;
  country: string | null;
  foundedDate: string | null;
}

function omitNull<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: T[K] } {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null),
  ) as { [K in keyof T]: T[K] };
}

function hasAny(...vals: unknown[]): boolean {
  return vals.some((v) => v != null);
}

export function generateSlides(startup: TrustMRRStartup): unknown[] {
  const slides: unknown[] = [];
  let idx = 0;

  if (
    hasAny(startup.name, startup.category, startup.country, startup.foundedDate)
  ) {
    slides.push({
      id: `s${idx++}`,
      type: 'intro',
      title: 'Intro',
      data: omitNull({
        name: startup.name,
        category: startup.category,
        country: startup.country,
        foundedDate: startup.foundedDate,
      }),
    });
  }

  if (
    hasAny(
      startup.revenue.mrr,
      startup.revenue.last30Days,
      startup.revenue.total,
      startup.customers,
    )
  ) {
    slides.push({
      id: `s${idx++}`,
      type: 'revenue',
      title: 'Revenue',
      data: omitNull({
        mrr: startup.revenue.mrr,
        last30Days: startup.revenue.last30Days,
        total: startup.revenue.total,
        customers: startup.customers,
      }),
    });
  }

  if (hasAny(startup.growth30d, startup.growthMRR30d)) {
    slides.push({
      id: `s${idx++}`,
      type: 'growth',
      title: 'Growth',
      data: omitNull({
        growth30d: startup.growth30d,
        growthMRR30d: startup.growthMRR30d,
      }),
    });
  }

  if (
    hasAny(
      startup.visitorsLast30Days,
      startup.googleSearchImpressionsLast30Days,
    )
  ) {
    slides.push({
      id: `s${idx++}`,
      type: 'traffic',
      title: 'Traffic',
      data: omitNull({
        visitorsLast30Days: startup.visitorsLast30Days,
        googleSearchImpressionsLast30Days:
          startup.googleSearchImpressionsLast30Days,
      }),
    });
  }

  if (hasAny(startup.revenuePerVisitor, startup.profitMarginLast30Days)) {
    slides.push({
      id: `s${idx++}`,
      type: 'efficiency',
      title: 'Efficiency',
      data: omitNull({
        revenuePerVisitor: startup.revenuePerVisitor,
        profitMarginLast30Days: startup.profitMarginLast30Days,
      }),
    });
  }

  if (hasAny(startup.activeSubscriptions, startup.paymentProvider)) {
    slides.push({
      id: `s${idx++}`,
      type: 'subscriptions',
      title: 'Subscriptions',
      data: omitNull({
        activeSubscriptions: startup.activeSubscriptions,
        paymentProvider: startup.paymentProvider,
      }),
    });
  }

  if (startup.onSale && hasAny(startup.askingPrice, startup.multiple)) {
    slides.push({
      id: `s${idx++}`,
      type: 'sale',
      title: 'For Sale',
      data: omitNull({
        askingPrice: startup.askingPrice,
        multiple: startup.multiple,
      }),
    });
  }

  if (hasAny(startup.name, startup.xHandle)) {
    slides.push({
      id: `s${idx++}`,
      type: 'outro',
      title: 'Outro',
      data: omitNull({
        xHandle: startup.xHandle,
        name: startup.name,
      }),
    });
  }

  return slides;
}
