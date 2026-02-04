// src/components/pdf/SavingsResultPDF.jsx
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

const SavingsResultPDF = React.forwardRef(
  (
    {
      dream,
      years,
      currentCost,
      futureAmountNeeded,
      multiplier,
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
            SAVINGS
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
          To achieve your financial dream.
        </div>

        {/* ===== INPUTS SECTION ===== */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: "0 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>A.</strong> What are you saving for?
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {dream}
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>B.</strong> Time horizon:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {years} year{years !== 1 ? "s" : ""}
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>C.</strong> Current estimated cost:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            ₱ {money(currentCost)}
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
            Amount needed today to achieve your goal
          </p>

          <p
            style={{
              margin: "10px 0",
              fontSize: 26,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            ₱ {money(futureAmountNeeded)}
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
            Current Cost × (1.04)<sup>Years</sup> = {money(currentCost)} × {multiplier.toFixed(4)} ={" "}
            <strong>₱{money(futureAmountNeeded)}</strong>
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
            *Assumes a 4% annual inflation rate. Actual future cost may vary.
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Note:</strong> The results of this FNA are for reference only and should not be interpreted as financial advice, recommendation, or offer.
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

export default SavingsResultPDF;