import data from "./summit-data.json";

export const summitData = data as any;

export const personas = summitData.personas as Record<string, { label: string; icon: string; color: string }>;
export const interestTags = summitData.interest_tags as { id: string; label: string; icon: string }[];
export const days = summitData.days as { id: number; date: string; date_short: string; weekday: string; title: string }[];
export const headlineStats = summitData.headline_stats as { value: string; label: string }[];
export const keynoteSpeakers = summitData.keynote_speakers as any[];
export const schedule = summitData.schedule as Record<string, any[]>;
export const companiesGlobal = summitData.companies_global as any[];
export const companiesIndian = summitData.companies_indian as any[];
export const foundationModels = summitData.foundation_models as any[];
export const dealsAndInvestments = summitData.deals_and_investments as any[];
export const governanceSutras = summitData.governance_sutras as any[];
export const mustVisitByPersona = summitData.must_visit_by_persona as Record<string, any[]>;
export const countryPavilions = summitData.country_pavilions as any[];
export const venue = summitData.venue as any;
export const survivalTips = summitData.survival_tips as any[];
export const checklist = summitData.checklist as string[];
export const challengeFinalists = summitData.challenge_finalists as any;
export const hackathons = summitData.hackathons as any[];
export const sevenChakras = summitData.seven_chakras as any[];
export const worldLeaders = summitData.world_leaders as string[];

export const lookingForTags = [
  { id: "cofounder", label: "Co-founder" },
  { id: "investors", label: "Investors" },
  { id: "hiring", label: "Hiring Talent" },
  { id: "beta_testers", label: "Beta Testers" },
  { id: "partnerships", label: "Partnerships" },
  { id: "mentorship", label: "Mentorship" },
  { id: "collaborators", label: "Technical Collaborators" },
] as const;

export function getScheduleForDay(dayNum: number) {
  return schedule[`day_${dayNum}`] || [];
}

export function isForYou(tags: string[], interests: string[]): boolean {
  return tags?.some((t: string) => interests.includes(t)) ?? false;
}

export type RecommendationLevel = "must_attend" | "recommended" | "explore" | null;

export function getTodaysDayId(): number | null {
  const today = new Date().toISOString().slice(0, 10);
  const match = days.find(d => d.date === today);
  return match?.id ?? null;
}

export function getRecommendationLevel(tags: string[], interests: string[]): RecommendationLevel {
  if (!tags?.length || !interests.length) return null;
  const overlap = tags.filter(t => interests.includes(t)).length;
  const ratio = overlap / Math.min(interests.length, tags.length);
  if (ratio >= 0.6) return "must_attend";
  if (ratio >= 0.3) return "recommended";
  if (overlap > 0) return "explore";
  return null;
}
