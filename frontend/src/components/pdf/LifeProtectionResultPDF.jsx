// components/pdf/LifeProtectionResultPDF.jsx
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

const LifeProtectionResultPDF = React.forwardRef(
  (
    {
      years,
      expenses,
      totalExpenses,
      existingCoverage,
      multiplier,
      result,
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
            LIFE PROTECTION
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
          To protect your family’s quality of life in the event of death,
          disability, or other unforeseen circumstances.
        </div>

        {/* ===== SECTION A ===== */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: COLORS.primary }}>A.</strong>{" "}
            Years you will provide for your family:
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.primary,
              marginTop: 6,
            }}
          >
            {years} years
          </p>
        </div>

        {/* ===== SECTION B ===== */}
        <div style={{ marginBottom: 22 }}>
          <p>
            <strong style={{ color: COLORS.primary }}>B.</strong>{" "}
            Monthly Living Expenses
          </p>

          <table
            width="100%"
            style={{
              borderCollapse: "collapse",
              fontSize: 11.5,
            }}
          >
            <tbody>
              {Object.entries(expenses).map(([label, value]) => (
                <tr key={label}>
                  <td
                    style={{
                      padding: "8px 0",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      textAlign: "right",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    ₱ {money(value)}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  style={{
                    paddingTop: 10,
                    fontWeight: "bold",
                    color: COLORS.primary,
                  }}
                >
                  Total Monthly Expenses
                </td>
                <td
                  style={{
                    paddingTop: 10,
                    textAlign: "right",
                    fontWeight: "bold",
                    color: COLORS.primary,
                  }}
                >
                  ₱ {money(totalExpenses)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== SECTION C ===== */}
        <div style={{ marginBottom: 22 }}>
          <p>
            <strong style={{ color: COLORS.primary }}>C.</strong>{" "}
            Existing Life Insurance Coverage
          </p>
          <p style={{ fontSize: 16, fontWeight: "bold" }}>
            ₱ {money(existingCoverage)}
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
            Minimum Recommended Life Protection Amount
          </p>

          <p
            style={{
              margin: "10px 0",
              fontSize: 26,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            ₱ {money(result)}
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
            (12 × Monthly Expenses × Inflation Multiplier) − Existing Coverage
            <br />
            (12 × {money(totalExpenses)} × {multiplier.toFixed(4)}) −{" "}
            {money(existingCoverage)}
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
            * Assumes 4% annual inflation. Results are for illustration purposes
            only and do not constitute financial advice.
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

export default LifeProtectionResultPDF;