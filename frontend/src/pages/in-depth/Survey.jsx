import React, { useState, useMemo } from "react";

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
        className="peer w-full bg-gray-100 rounded-xl px-4 pt-6 pb-2 text-gray-800 shadow-inner border border-gray-200 
        focus:bg-white focus:border-[#003266] focus:ring-2 focus:ring-[#003266]/20 
        outline-none transition-all duration-300"
      />
      <label
        className="absolute left-4 top-2 text-sm text-gray-500 transition-all pointer-events-none
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-sm
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

  return (
    <div className="w-full px-4 py-20 bg-gradient-to-br from-white via-gray-100 to-blue-100">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#003266] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-[#003266] font-semibold mb-6">
          Step {step} of 3
        </p>

        {/* ===================== */}
        {/* STEP 1 - GENERAL INFO */}
        {/* ===================== */}
        {step === 1 && (
          <div className="bg-gray-50 rounded-xl p-10 shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003266] mb-2 text-center">
              General Information
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Tell us a little about yourself.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <FloatingInput label="Your Name" name="name" value={form.name} onChange={handleChange} />
                <FloatingInput label="Your Age" name="age" type="number" value={form.age} onChange={handleChange} />
                <FloatingInput label="Years Before Retirement" name="retirementYears" type="number" value={form.retirementYears} onChange={handleChange} />
                <FloatingInput label="Your Total Life Insurance Coverage" name="lifeInsurance" type="number" value={form.lifeInsurance} onChange={handleChange} />
                <FloatingInput label="Your Total Healthcare Coverage" name="healthCoverage" type="number" value={form.healthCoverage} onChange={handleChange} />
              </div>

              <div className="space-y-5">
                <FloatingInput label="Civil Status" name="civilStatus" value={form.civilStatus} onChange={handleChange} />
                <FloatingInput label="Spouse/Partner's Age (if any)" name="spouseAge" type="number" value={form.spouseAge} onChange={handleChange} />
                <FloatingInput label="Partner's Total Life Insurance Coverage" name="partnerLifeInsurance" type="number" value={form.partnerLifeInsurance} onChange={handleChange} />
                <FloatingInput label="Partner's Total Healthcare Coverage" name="partnerHealthCoverage" type="number" value={form.partnerHealthCoverage} onChange={handleChange} />
              </div>
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
          <div className="bg-gray-50 rounded-xl p-10 shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003266] mb-2 text-center">
              MONTHLY INCOME & EXPENSE
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Enter your monthly cash flow information.
            </p>

            {/* Income Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                Income
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FloatingInput 
                      label="Your net monthly income" 
                      name="yourNetIncome" 
                      type="number" 
                      value={form.yourNetIncome} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="w-32">
                    <FloatingInput 
                      label="No. of months income received in a year" 
                      name="yourIncomeMonths" 
                      type="number" 
                      value={form.yourIncomeMonths} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <FloatingInput 
                      label="Your partner's net monthly income" 
                      name="partnerNetIncome" 
                      type="number" 
                      value={form.partnerNetIncome} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="w-32">
                    <FloatingInput 
                      label="No. of months income received in a year" 
                      name="partnerIncomeMonths" 
                      type="number" 
                      value={form.partnerIncomeMonths} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded-lg border flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Monthly Net Income / Cash In</span>
                <span className="text-xl font-bold text-[#003266]">
                  ₱ {totalMonthlyIncome.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                Expenses
              </h3>
              
              <div className="space-y-4">
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
                  label="Household and work-related expenses" 
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
                  label="Vacation, recreation, other periodic expenses" 
                  name="vacation" 
                  type="number" 
                  value={form.vacation} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-4 bg-white p-4 rounded-lg border flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Monthly Expenses / Cash Out</span>
                <span className="text-xl font-bold text-[#003266]">
                  ₱ {totalMonthlyExpenses.toLocaleString()}
                </span>
              </div>

              <div className="mt-6 bg-[#003266]/10 p-5 rounded-lg border border-[#003266]/20 text-center">
                <p className="text-gray-700 font-medium">Monthly Excess Cash</p>
                <p className="text-2xl font-bold text-[#003266]">
                  ₱ {monthlyExcess.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* STEP 3 - ASSETS, LIABILITIES & NET WORTH */}
        {/* ===================== */}
        {step === 3 && (
          <div className="bg-gray-50 rounded-xl p-10 shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003266] mb-2 text-center">
              ASSETS, LIABILITIES & NET WORTH
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Let's compute your net worth.
            </p>

            {/* Assets Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                ASSETS
              </h3>
              
              <div className="space-y-4">
                <FloatingInput 
                  label="ASSETS - Real Properties" 
                  name="realProperties" 
                  type="number" 
                  value={form.realProperties} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Car, appliances, jewelry, others" 
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
                  label="Mutual fund, UITF, VUL, bonds, stocks" 
                  name="mutualFundUITF" 
                  type="number" 
                  value={form.mutualFundUITF} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Business and other investments" 
                  name="businessInvestments" 
                  type="number" 
                  value={form.businessInvestments} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Insurance, pre-need plans cash value" 
                  name="insuranceCashValue" 
                  type="number" 
                  value={form.insuranceCashValue} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-4 bg-white p-4 rounded-lg border flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Assets</span>
                <span className="text-xl font-bold text-[#003266]">
                  ₱ {totalAssets.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Liabilities Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#003266] mb-4 border-b border-gray-200 pb-2">
                LIABILITIES
              </h3>
              
              <div className="space-y-4">
                <FloatingInput 
                  label="LIABILITIES - Real Estate Loan" 
                  name="realEstateLoan" 
                  type="number" 
                  value={form.realEstateLoan} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Car, Salary and Other Loans" 
                  name="carSalaryLoans" 
                  type="number" 
                  value={form.carSalaryLoans} 
                  onChange={handleChange} 
                />
                <FloatingInput 
                  label="Unpaid credit card balance" 
                  name="creditCardBalance" 
                  type="number" 
                  value={form.creditCardBalance} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mt-4 bg-white p-4 rounded-lg border flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Liabilities</span>
                <span className="text-xl font-bold text-[#003266]">
                  ₱ {totalLiabilities.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Worth */}
            <div className="mt-8 bg-[#003266]/10 p-6 rounded-lg border border-[#003266]/20">
              <div className="flex justify-between items-center mb-2">
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
        <div className="flex justify-between items-center mt-10">
          <button 
            onClick={prev} 
            disabled={step === 1} 
            className="text-gray-500 disabled:opacity-30 cursor-pointer hover:text-[#003266] transition-colors"
          >
            ← Previous
          </button>

          {step < 3 ? (
            <button 
              onClick={next} 
              className="bg-[#003266] text-white px-6 py-2 rounded-lg hover:bg-[#003266]/80 transition-colors cursor-pointer"
            >
              Continue →
            </button>
          ) : (
            <button className="bg-[#003266] text-white px-6 py-2 rounded-lg hover:bg-[#003266]/80 transition-colors cursor-pointer">
              Submit
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Survey;