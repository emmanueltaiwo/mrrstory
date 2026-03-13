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

export function generateSlides(startup: TrustMRRStartup): unknown[] {
  const slides: unknown[] = [];
  let idx = 0;

  slides.push({
    id: `s${idx++}`,
    type: 'intro',
    title: 'Intro',
    data: {
      name: startup.name,
      category: startup.category,
      country: startup.country,
      foundedDate: startup.foundedDate,
    },
  });

  slides.push({
    id: `s${idx++}`,
    type: 'revenue',
    title: 'Revenue',
    data: {
      mrr: startup.revenue.mrr,
      last30Days: startup.revenue.last30Days,
      total: startup.revenue.total,
      customers: startup.customers,
    },
  });

  slides.push({
    id: `s${idx++}`,
    type: 'growth',
    title: 'Growth',
    data: {
      growth30d: startup.growth30d,
      growthMRR30d: startup.growthMRR30d,
    },
  });

  slides.push({
    id: `s${idx++}`,
    type: 'traffic',
    title: 'Traffic',
    data: {
      visitorsLast30Days: startup.visitorsLast30Days,
      googleSearchImpressionsLast30Days:
        startup.googleSearchImpressionsLast30Days,
    },
  });

  slides.push({
    id: `s${idx++}`,
    type: 'efficiency',
    title: 'Efficiency',
    data: {
      revenuePerVisitor: startup.revenuePerVisitor,
      profitMarginLast30Days: startup.profitMarginLast30Days,
    },
  });

  slides.push({
    id: `s${idx++}`,
    type: 'subscriptions',
    title: 'Subscriptions',
    data: {
      activeSubscriptions: startup.activeSubscriptions,
      paymentProvider: startup.paymentProvider,
    },
  });

  if (startup.onSale && startup.askingPrice != null) {
    slides.push({
      id: `s${idx++}`,
      type: 'sale',
      title: 'For Sale',
      data: {
        askingPrice: startup.askingPrice,
        multiple: startup.multiple,
      },
    });
  }

  slides.push({
    id: `s${idx++}`,
    type: 'outro',
    title: 'Outro',
    data: {
      xHandle: startup.xHandle,
      name: startup.name,
    },
  });

  return slides;
}
