export interface Startup {
  name: string;
  slug: string;
  icon: string | null;
  category: string | null;
  country: string | null;
  revenue?: { mrr: number; last30Days?: number };
}
