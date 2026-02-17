import React, { useState, useMemo, useEffect } from "react";

/* =========================
   Floating Input Component
========================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full bg-gray-50 rounded-md px-3 py-3 text-sm text-gray-800 border border-gray-200 
        focus:bg-white focus:border-[#003266] focus:ring-1 focus:ring-[#003266]/20 
        outline-none transition-all duration-300"
      />
      <label
        className="absolute left-3 top-2 text-xs text-gray-500 transition-all pointer-events-none
        peer-placeholder-shown:top-3
        peer-placeholder-shown:text-sm
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-xs
        peer-focus:text-[#003266]"
      >
        {label}
      </label>
    </div>
  );
};

/* =========================
   Survey Component
========================= */
const Survey = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    age: "",
    civilStatus: "",
    spouseAge: "",
    retirementYears: "",
    lifeInsurance: "",
    healthCoverage: "",
    partnerLifeInsurance: "",
    partnerHealthCoverage: "",
    child1: "",
    child2: "",
    child3: "",
    child4: "",
    child5: "",
    // Income
    yourNetIncome: "",
    yourIncomeMonths: "",
    partnerNetIncome: "",
    partnerIncomeMonths: "",
    // Expenses
    savings: "",
    loanPayments: "",
    household: "",
    education: "",
    vacation: "",
    // Assets
    realProperties: "",
    carAppliancesJewelry: "",
    cashBankDeposits: "",
    mutualFundUITF: "",
    businessInvestments: "",
    insuranceCashValue: "",
    // Liabilities
    realEstateLoan: "",
    carSalaryLoans: "",
    creditCardBalance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const next = () => step < 3 && setStep(step + 1);
  const prev = () => step > 1 && setStep(step - 1);

  const progress = (step / 3) * 100;

  /* =========================
     Calculations
  ========================= */
  const totalMonthlyIncome = useMemo(() => {
    return (
      Number(form.yourNetIncome || 0) +
      Number(form.partnerNetIncome || 0)
    );
  }, [form.yourNetIncome, form.partnerNetIncome]);

  const totalMonthlyExpenses = useMemo(() => {
    return (
      Number(form.savings || 0) +
      Number(form.loanPayments || 0) +
      Number(form.household || 0) +
      Number(form.education || 0) +
      Number(form.vacation || 0)
    );
  }, [form.savings, form.loanPayments, form.household, form.education, form.vacation]);

  const monthlyExcess = useMemo(() => {
    return totalMonthlyIncome - totalMonthlyExpenses;
  }, [totalMonthlyIncome, totalMonthlyExpenses]);

  const totalAssets = useMemo(() => {
    return (
      Number(form.realProperties || 0) +
      Number(form.carAppliancesJewelry || 0) +
      Number(form.cashBankDeposits || 0) +
      Number(form.mutualFundUITF || 0) +
      Number(form.businessInvestments || 0) +
      Number(form.insuranceCashValue || 0)
    );
  }, [form.realProperties, form.carAppliancesJewelry, form.cashBankDeposits, form.mutualFundUITF, form.businessInvestments, form.insuranceCashValue]);

  const totalLiabilities = useMemo(() => {
    return (
      Number(form.realEstateLoan || 0) +
      Number(form.carSalaryLoans || 0) +
      Number(form.creditCardBalance || 0)
    );
  }, [form.realEstateLoan, form.carSalaryLoans, form.creditCardBalance]);

  const netWorth = useMemo(() => {
    return totalAssets - totalLiabilities;
  }, [totalAssets, totalLiabilities]);

  useEffect(() => {
      document.title = "In-depth Form | Financial Needs Analysis";
    }, []);

  return (
    <div className="w-full min-h-screen pt-30 px-4 pb-8 bg-gradient-to-br from-white via-gray-100 to-blue-100 flex justify-center">
      
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 md:p-10">

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#003266] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-[#003266] font-semibold mb-6 uppercase tracking-wide">
          Step {step} of 3
        </p>

        {/* ===================== */}
        {/* STEP 1 - GENERAL INFO */}
        {/* ===================== */}
        {step === 1 && (
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-[#003266] mb-1 text-center">
              GENERAL INFORMATION
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Tell us a little about yourself.
            </p>

            {/* CHANGED: Grid layout to 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FloatingInput label="Your Name" name="name" value={form.name} onChange={handleChange} />
              <FloatingInput label="Your Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <FloatingInput label="Civil Status" name="civilStatus" value={form.civilStatus} onChange={handleChange} />
              <FloatingInput label="Years Before Retirement" name="retirementYears" type="number" value={form.retirementYears} onChange={handleChange} />
              <FloatingInput label="Spouse/Partner's Age (if any)" name="spouseAge" type="number" value={form.spouseAge} onChange={handleChange} />
              <FloatingInput label="Your Total Life Insurance Coverage" name="lifeInsurance" type="number" value={form.lifeInsurance} onChange={handleChange} />
              <FloatingInput label="Partner's Total Life Insurance Coverage" name="partnerLifeInsurance" type="number" value={form.partnerLifeInsurance} onChange={handleChange} />
              <FloatingInput label="Your Total Healthcare Coverage" name="healthCoverage" type="number" value={form.healthCoverage} onChange={handleChange} />
              <FloatingInput label="Partner's Total Healthcare Coverage" name="partnerHealthCoverage" type="number" value={form.partnerHealthCoverage} onChange={handleChange} />
            </div>

            {/* Children */}
            <div className="mt-10">
              <p className="text-sm font-semibold text-[#003266] mb-4">
                Ages of Children Under 18 (if any)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <FloatingInput label="Child 1" name="child1" type="number" value={form.child1} onChange={handleChange} />
                <FloatingInput label="Child 2" name="child2" type="number" value={form.child2} onChange={handleChange} />
                <FloatingInput label="Child 3" name="child3" type="number" value={form.child3} onChange={handleChange} />
                <FloatingInput label="Child 4" name="child4" type="number" value={form.child4} onChange={handleChange} />
                <FloatingInput label="Child 5" name="child5" type="number" value={form.child5} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* STEP 2 - MONTHLY INCOME & EXPENSE */}
        {/* ===================== */}
        {step === 2 && (
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-[#003266] mb-1 text-center">
              MONTHLY INCOME & EXPENSE
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Enter your monthly cash flow information.
            </p>

            {/* Income Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                Income
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Your Income Card */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-[#003266] text-sm mb-4">Your Income</h4>
                  <div className="space-y-4">
                    <FloatingInput 
                      label="Net monthly income" 
                      name="yourNetIncome" 
                      type="number" 
                      value={form.yourNetIncome} 
                      onChange={handleChange} 
                    />
                    <FloatingInput 
                      label="Months per year" 
                      name="yourIncomeMonths" 
                      type="number" 
                      value={form.yourIncomeMonths} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                {/* Partner Income Card */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-[#003266] text-sm mb-4">Partner's Income</h4>
                  <div className="space-y-4">
                    <FloatingInput 
                      label="Net monthly income" 
                      name="partnerNetIncome" 
                      type="number" 
                      value={form.partnerNetIncome} 
                      onChange={handleChange} 
                    />
                    <FloatingInput 
                      label="Months per year" 
                      name="partnerIncomeMonths" 
                      type="number" 
                      value={form.partnerIncomeMonths} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border flex flex-row justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Net Income / Cash In</span>
                <span className="text-lg font-bold text-[#003266]">
                  ₱ {totalMonthlyIncome.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="text-base font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                Expenses
              </h3>
              
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <FloatingInput 
                  label="Monthly Savings/Investment" 
                  name="savings" 
                  type="number" 
                  value={form.savings} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Monthly Loan Payments" 
                  name="loanPayments" 
                  type="number" 
                  value={form.loanPayments} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Household & work expenses" 
                  name="household" 
                  type="number" 
                  value={form.household} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Education-related expenses" 
                  name="education" 
                  type="number" 
                  value={form.education} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Vacation & recreation" 
                  name="vacation" 
                  type="number" 
                  value={form.vacation} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border flex flex-row justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Expenses / Cash Out</span>
                <span className="text-lg font-bold text-[#003266]">
                  ₱ {totalMonthlyExpenses.toLocaleString()}
                </span>
              </div>

              <div className="mt-6 bg-[#003266]/10 p-5 rounded-lg border border-[#003266]/20">
                <div className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Monthly Excess Cash</span>
                  <span className="text-xl font-bold text-[#003266]">
                    ₱ {monthlyExcess.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* STEP 3 - ASSETS, LIABILITIES & NET WORTH */}
        {/* ===================== */}
        {step === 3 && (
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-[#003266] mb-1 text-center">
              ASSETS, LIABILITIES & NET WORTH
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Let's compute your net worth.
            </p>

            {/* Assets Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                ASSETS
              </h3>
              
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <FloatingInput 
                  label="Real Properties" 
                  name="realProperties" 
                  type="number" 
                  value={form.realProperties} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Car, appliances, jewelry" 
                  name="carAppliancesJewelry" 
                  type="number" 
                  value={form.carAppliancesJewelry} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Cash and bank deposits" 
                  name="cashBankDeposits" 
                  type="number" 
                  value={form.cashBankDeposits} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Mutual funds, UITF, VUL" 
                  name="mutualFundUITF" 
                  type="number" 
                  value={form.mutualFundUITF} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Business investments" 
                  name="businessInvestments" 
                  type="number" 
                  value={form.businessInvestments} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Insurance cash value" 
                  name="insuranceCashValue" 
                  type="number" 
                  value={form.insuranceCashValue} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border flex flex-row justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Assets</span>
                <span className="text-lg font-bold text-[#003266]">
                  ₱ {totalAssets.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Liabilities Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                LIABILITIES
              </h3>
              
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <FloatingInput 
                  label="Real Estate Loan" 
                  name="realEstateLoan" 
                  type="number" 
                  value={form.realEstateLoan} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Car & Salary Loans" 
                  name="carSalaryLoans" 
                  type="number" 
                  value={form.carSalaryLoans} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Credit Card Balance" 
                  name="creditCardBalance" 
                  type="number" 
                  value={form.creditCardBalance} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border flex flex-row justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Liabilities</span>
                <span className="text-lg font-bold text-[#003266]">
                  ₱ {totalLiabilities.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Worth */}
            <div className="bg-[#003266]/10 p-6 rounded-lg border border-[#003266]/20">
              <div className="flex flex-row justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Net Worth</span>
                <span className="text-2xl font-bold text-[#003266]">
                  ₱ {netWorth.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-right">
                Total Assets: ₱ {totalAssets.toLocaleString()} - Total Liabilities: ₱ {totalLiabilities.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
          <button 
            onClick={prev} 
            disabled={step === 1} 
            className="text-sm text-gray-500 disabled:opacity-30 cursor-pointer hover:text-[#003266] transition-colors font-medium"
          >
            ← Previous
          </button>

          {step < 3 ? (
            <button 
              onClick={next} 
              className="bg-[#003266] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#003266]/80 transition-colors cursor-pointer font-medium shadow-md shadow-blue-900/20"
            >
              Continue →
            </button>
          ) : (
            <button className="bg-[#003266] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#003266]/80 transition-colors cursor-pointer font-medium shadow-md shadow-blue-900/20">
              Submit
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Survey;  