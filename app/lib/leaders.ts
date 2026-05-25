export type Leader = {
  name: string;
  user_id: number;
  total_profit: number;
  avatar: string | null;
};

export type LeadersFilter = "today" | "monthly" | "alltime";

const RANKING_KEY: Record<LeadersFilter, "dailyRanking" | "monthlyRanking" | "fullRanking"> = {
  today: "dailyRanking",
  monthly: "monthlyRanking",
  alltime: "fullRanking",
};

export type LeadersResult = {
  rows: Leader[];
  totalProfit: number;
};

const SAME_ORIGIN_BASE = "/api/leaders";
const UPSTREAM_BASE = "https://app.cointech2u.com/api/v2/leaders";

function normalizeRows(json: unknown, filter: LeadersFilter, limit: number): Leader[] {
  const data = (json as { data?: Record<string, { data?: unknown[] }> })?.data;
  const list = data?.[RANKING_KEY[filter]]?.data ?? [];
  return list.slice(0, limit).map((r) => {
    const row = r as Partial<Leader>;
    return {
      name: String(row.name ?? ""),
      user_id: Number(row.user_id ?? 0),
      total_profit: Number(row.total_profit ?? 0),
      avatar: row.avatar ?? null,
    };
  });
}

function readTotalProfit(json: unknown): number {
  const tp = (json as { data?: { totalProfit?: number } })?.data?.totalProfit;
  return Number(tp ?? 0);
}

export async function fetchLeaders(
  filter: LeadersFilter,
  limit = 10,
): Promise<LeadersResult> {
  const url = `${UPSTREAM_BASE}?filter=${filter}&limit=${limit}&page=1`;
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { rows: normalizeRows(json, filter, limit), totalProfit: readTotalProfit(json) };
  } catch {
    return { rows: [], totalProfit: 0 };
  }
}

export async function fetchLeadersClient(
  filter: LeadersFilter,
  limit = 10,
  signal?: AbortSignal,
): Promise<LeadersResult> {
  const url = `${SAME_ORIGIN_BASE}?filter=${filter}&limit=${limit}&page=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return { rows: normalizeRows(json, filter, limit), totalProfit: readTotalProfit(json) };
}
