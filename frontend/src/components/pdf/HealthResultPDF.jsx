// src/components/pdf/HealthResultPDF.jsx
import React from "react";

const COLORS = {
  primary: "#003266",
  accent: "#E1942D",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#d1d5db",
};

const money = (v) =>
  Number(v || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 });

// Helper: Convert decimal years to "X year(s) and Y month(s)"
const formatYearsAndMonths = (totalYears) => {
  if (totalYears <= 0) return "0 years";

  const years = Math.floor(totalYears);
  let months = Math.round((totalYears - years) * 12);

  // Handle rounding edge case (e.g., 1.99 → 2 years)
  if (months >= 12) {
    return `${years + 1} year${years + 1 === 1 ? "" : "s"}`;
  }

  const parts = [];
  if (years > 0) {
    parts.push(`${years} year${years === 1 ? "" : "s"}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months === 1 ? "" : "s"}`);
  }

  return parts.length > 0 ? parts.join(" and ") : "less than a month";
};

const HealthResultPDF = React.forwardRef(
  ({ healthFundNeeded, monthlyContribution, yearsToGoal }, ref) => {
    const yearsAndMonths = formatYearsAndMonths(yearsToGoal);

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
          padding: "22mm",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "11.5pt",
          backgroundColor: "#ffffff",
          color: COLORS.text,
          boxSizing: "border-box",
        }}
      >
        {/* ===== HEADER ===== */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `4px solid ${COLORS.primary}`,
              paddingBottom: 12,
            }}
          >
            {/* LEFT: TEXT */}
            <div>
              <h1 style={{ margin: 0, fontSize: 20, color: COLORS.primary }}>
                FINANCIAL NEEDS ANALYSIS
              </h1>
              <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 11 }}>
                Client Summary Report
              </p>
            </div>

            {/* RIGHT: LOGO */}
            <img
              src="../../../cfb.png"
              alt="Caelum Financial Solutions"
              style={{
                height: "100px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* ===== SECTION TITLE ===== */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            HEALTH
          </div>
        </div>

        {/* ===== OBJECTIVE ===== */}
        <div
          style={{
            borderLeft: `5px solid ${COLORS.accent}`,
            paddingLeft: 14,
            marginBottom: 22,
            fontStyle: "italic",
            color: COLORS.muted,
          }}
        >
          To build a health fund for serious illness or medical emergencies.
        </div>

        {/* ===== INPUTS SECTION ===== */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: COLORS.primary }}>A.</strong> How much do you need for your health fund?
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            ₱ {money(healthFundNeeded)}
          </p>

          <p style={{ margin: "16px 0 12px" }}>
            <strong style={{ color: COLORS.primary }}>B.</strong> How much are you willing to set aside monthly?
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            ₱ {money(monthlyContribution)}
          </p>
        </div>

        {/* ===== RESULT BOX ===== */}
        <div
          style={{
            border: `2px solid ${COLORS.primary}`,
            padding: 18,
            marginBottom: 26,
            backgroundColor: "#f9fbfd",
          }}
        >
          <p style={{ margin: 0, color: COLORS.muted }}>
            Estimated Time to Reach Your Health Fund Goal
          </p>

          <p
            style={{
              margin: "10px 0",
              fontSize: 26,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            {yearsToGoal} year{parseFloat(yearsToGoal) !== 1 ? "s" : ""}
          </p>

          {/* NEW: Years and Months */}
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              color: COLORS.muted,
              fontStyle: "italic",
            }}
          >
            or {yearsAndMonths}
          </p>

          <div
            style={{
              marginTop: 12,
              fontSize: 10.5,
              color: COLORS.muted,
            }}
          >
            <strong>Calculation:</strong>
            <br />
            Health Fund Needed ÷ (12 × Monthly Contribution)
            <br />
            {money(healthFundNeeded)} ÷ (12 × {money(monthlyContribution)}) ={" "}
            <strong>{yearsToGoal}</strong>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            position: "absolute",
            bottom: "18mm",
            left: "22mm",
            right: "22mm",
            fontSize: 9,
            color: COLORS.muted,
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 8,
          }}
        >
          <p style={{ margin: "4px 0" }}>
            *Assumes consistent monthly contributions with no investment growth.
            Actual time may vary if returns are earned.
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Note:</strong> The results of this FNA are for reference only
            and should not be interpreted as financial advice, recommendation, or
            offer.
          </p>
          <p
            style={{
              marginTop: 6,
              textAlign: "right",
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            © Caelum Financial Solutions
          </p>
        </div>
      </div>
    );
  }
);

export default HealthResultPDF;