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
    netIncome: "",
    savings: "",
    loanPayments: "",
    household: "",
    realEstate: "",
    cash: "",
    loans: "",
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
  const monthlyExcess = useMemo(() => {
    return (
      Number(form.netIncome || 0) -
      (Number(form.savings || 0) +
        Number(form.loanPayments || 0) +
        Number(form.household || 0))
    );
  }, [form]);

  const netWorth = useMemo(() => {
    return (
      Number(form.realEstate || 0) +
      Number(form.cash || 0) -
      Number(form.loans || 0)
    );
  }, [form]);

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
        {/* STEP 2 - MONTHLY */}
        {/* ===================== */}
        {step === 2 && (
          <div className="bg-gray-50 rounded-xl p-10 shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003266] mb-2 text-center">
              Monthly Income & Expenses
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Let’s understand your monthly flow.
            </p>

            <div className="space-y-5">
              <FloatingInput label="Net Monthly Income" name="netIncome" type="number" value={form.netIncome} onChange={handleChange} />
              <FloatingInput label="Monthly Savings" name="savings" type="number" value={form.savings} onChange={handleChange} />
              <FloatingInput label="Loan Payments" name="loanPayments" type="number" value={form.loanPayments} onChange={handleChange} />
              <FloatingInput label="Household Expenses" name="household" type="number" value={form.household} onChange={handleChange} />
            </div>

            <div className="mt-8 bg-white p-5 rounded-lg border text-center">
              <p className="text-gray-600">Monthly Excess</p>
              <p className="text-xl font-bold text-[#003266]">
                ₱ {monthlyExcess.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* ===================== */}
        {/* STEP 3 - ASSETS */}
        {/* ===================== */}
        {step === 3 && (
          <div className="bg-gray-50 rounded-xl p-10 shadow-inner border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003266] mb-2 text-center">
              Assets & Liabilities
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Let’s compute your net worth.
            </p>

            <div className="space-y-5">
              <FloatingInput label="Real Estate Value" name="realEstate" type="number" value={form.realEstate} onChange={handleChange} />
              <FloatingInput label="Cash & Deposits" name="cash" type="number" value={form.cash} onChange={handleChange} />
              <FloatingInput label="Total Loans" name="loans" type="number" value={form.loans} onChange={handleChange} />
            </div>

            <div className="mt-8 bg-white p-5 rounded-lg border text-center">
              <p className="text-gray-600">Net Worth</p>
              <p className="text-xl font-bold text-green-600">
                ₱ {netWorth.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10">
          <button onClick={prev} disabled={step === 1} className="text-gray-500 disabled:opacity-30 cursor-pointer">
            ← Previous
          </button>

          {step < 3 ? (
            <button onClick={next} className="bg-[#003266] text-white px-6 py-2 rounded-lg hover:bg-[#003266] cursor-pointer">
              Continue →
            </button>
          ) : (
            <button className="bg-[#003266] text-white px-6 py-2 rounded-lg hover:bg-[#003266]-700 cursor-pointer">
              Submit
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Survey;
