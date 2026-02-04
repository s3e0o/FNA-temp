// src/components/pdf/EducationResultPDF.jsx
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

const EducationResultPDF = React.forwardRef(
  (
    {
      childAge,
      selectedSchool,
      customSchoolFee,
      savedAmount,
      yearsUntilCollege,
      annualFee,
      futureValue,
      remainingNeeded,
      monthlySavings,
    },
    ref
  ) => {
    const displaySchool = selectedSchool === "Other"
      ? `Other (₱${money(customSchoolFee)})`
      : selectedSchool;

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
                display: "flex-end",
                justifyContent: "space-between", // 🔥 THIS pushes logo to the right
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
                    height: "125px",
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
            EDUCATION
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
          To plan for your child’s 4-year college education based on current savings
          and future needs.
        </div>

        {/* ===== INPUTS SECTION ===== */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: "0 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>1.</strong> Child’s age:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {childAge} years
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>2.</strong> Selected school:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            {displaySchool}
          </p>

          <p style={{ margin: "14px 0 10px" }}>
            <strong style={{ color: COLORS.primary }}>3.</strong> Amount already saved:
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
            ₱ {money(savedAmount)}
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
            Education Funding Plan Summary
          </p>

          <table width="100%" style={{ borderCollapse: "collapse", fontSize: "11pt" }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Years until college:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  {yearsUntilCollege} year{yearsUntilCollege !== 1 ? "s" : ""}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Total needed (future value):</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  ₱ {money(futureValue)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Remaining to save:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  ₱ {money(remainingNeeded)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: COLORS.muted }}>Monthly savings needed:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", color: COLORS.primary }}>
                  ₱ {money(monthlySavings)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 12, fontSize: 10.5, color: COLORS.muted }}>
            <strong>Assumptions:</strong>
            <br />
            • 8% annual education cost inflation
            <br />
            • 5% annual investment return
            <br />
            • 4-year college program
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
            *Results are for illustration purposes only and do not constitute financial advice.
            Actual outcomes may vary based on market performance and fee changes.
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

export default EducationResultPDF;