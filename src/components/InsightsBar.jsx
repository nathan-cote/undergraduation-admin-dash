import React from "react";
import styles from "./InsightsBar.module.css";

export default function InsightsBar({ students }) {
  // Example summary stats and quick filters
  const total = students.length;
  const essayStage = students.filter(s => s.status === "Applying").length;
  const notContacted = students.filter(s => s.lastActive < "2025-09-25").length;
  const highIntent = students.filter(s => s.status === "Shortlisting" || s.status === "Applying").length;

  return (
    <div className={styles.insightsContainer}>
      <div className={styles.stats}>
        <span><strong>{total}</strong> active students</span>
        <span><strong>{essayStage}</strong> in essay stage</span>
      </div>
      <div className={styles.filters}>
        <button className={styles.filterBtn}>Not contacted in 7 days ({notContacted})</button>
        <button className={styles.filterBtn}>High intent ({highIntent})</button>
        <button className={styles.filterBtn}>Needs essay help ({essayStage})</button>
      </div>
    </div>
  );
}
