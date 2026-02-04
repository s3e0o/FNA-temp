// src/components/pdf/RetirementResultPDF.jsx
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

const RetirementResultPDF = React.forwardRef(
  (
    {
      currentAge,
      retirementAge,
      monthlyIncome,
      yearsAfterRetirement,
      yearsUntilRetirement,
      totalRetirementFundNeeded,
      multiplier,
      monthlySavings,
    },
    ref
  ) => {
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
                justifyContent: "space-between", // pushes logo to right
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
            RETIREMENT
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
          To maintain your lifestyle after retirement.
        </div>

        {/* ===== INPUTS SECTION ===== */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: "0 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>A.</strong> Current age:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {currentAge} years old
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>B.</strong> Planned retirement age:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {retirementAge} years old
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>C.</strong> Desired monthly income in retirement:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            ₱ {money(monthlyIncome)}
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>D.</strong> Years of income needed after retirement:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {yearsAfterRetirement} years
          </p>
        </div>

        {/* ===== RESULTS BOX ===== */}
        <div
          style={{
            border: `2px solid ${COLORS.primary}`,
            padding: 18,
            marginBottom: 26,
            backgroundColor: "#f9fbfd",
          }}
        >
          <p style={{ margin: "0 0 12px", color: COLORS.muted, fontWeight: "bold" }}>
            Retirement Funding Plan Summary
          </p>

          <table width="100%" style={{ borderCollapse: "collapse", fontSize: "11pt" }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Years until retirement:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  {yearsUntilRetirement} year{yearsUntilRetirement !== 1 ? "s" : ""}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Total retirement fund needed:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  ₱ {money(totalRetirementFundNeeded)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Inflation & longevity multiplier:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  {multiplier.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Recommended monthly savings*:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  ₱ {money(monthlySavings)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 12, fontSize: 10.5, color: COLORS.muted }}>
            <strong>Calculation:</strong>
            <br />
            (12 × Monthly Income) × Years After Retirement × Multiplier
            <br />
            (12 × {money(monthlyIncome)}) × {yearsAfterRetirement} × {multiplier.toFixed(4)} ={" "}
            <strong>₱{money(totalRetirementFundNeeded)}</strong>
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
            *Assumes a 6% annual return on investment. Actual savings may vary based on market performance.
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Note:</strong> The results of this FNA are for reference only and should not be interpreted as financial advice, recommendation, or offer. Computation assumes an average inflation rate of 4%.
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

export default RetirementResultPDF;