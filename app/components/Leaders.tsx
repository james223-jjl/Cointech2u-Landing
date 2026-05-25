import { fetchLeaders } from "../lib/leaders";
import LeadersSection from "./LeadersSection";
import { ACCENT } from "./theme";

export default async function Leaders() {
  const [today, monthly, allTime] = await Promise.all([
    fetchLeaders("today", 10),
    fetchLeaders("monthly", 10),
    fetchLeaders("alltime", 10),
  ]);

  return (
    <LeadersSection
      accent={ACCENT}
      datasets={{
        today,
        monthly,
        alltime: allTime,
      }}
    />
  );
}
