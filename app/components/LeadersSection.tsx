"use client";

import { useRef } from "react";
import LeadersTabs from "./LeadersTabs";
import { useT } from "../lib/i18n";
import { useParallax } from "./useParallax";
import type { LeadersResult } from "../lib/leaders";

export default function LeadersSection({
  accent,
  datasets,
}: {
  accent: string;
  datasets: {
    today: LeadersResult;
    monthly: LeadersResult;
    alltime: LeadersResult;
  };
}) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="user-result"
      className="reveal ct2u-section-y"
      style={{ padding: "84px 0 84px", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
        <div className="ct2u-px-rise-fade" style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              margin: 0,
              marginBottom: 18,
            }}
          >
            {t("leaders.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(38px, 4.6vw, 60px)",
              letterSpacing: "-0.025em",
              marginBottom: 14,
            }}
          >
            {t("leaders.title.line1")}
            <br />
            <span style={{ color: "var(--text-2)", fontStyle: "italic", fontWeight: 400, fontSize: "0.65em" }}>
              {t("leaders.title.line2")}
            </span>
          </h2>
          <p
            style={{
              fontSize: 14.5,
              color: "var(--text-2)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.55,
            }}
          >
            {t("leaders.lede")}
          </p>
        </div>

        <LeadersTabs accent={accent} datasets={datasets} />
      </div>
    </section>
  );
}
