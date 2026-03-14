import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.daily(
  'refresh story slides from TrustMRR',
  { hourUTC: 0, minuteUTC: 0 },
  internal.refreshStories.refreshAllStories,
);

export default crons;
