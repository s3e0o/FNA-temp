import React, { useState, useMemo, useCallback, memo } from "react";

// ────────────────────────────────────────────────
// Memoized Floating Input Component
// ────────────────────────────────────────────────
const FloatingInput = memo(({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  error,
  ...props
}) => {
  const displayValue = type === "number" && value !== '' && value !== null
    ? Number(value).toLocaleString('en-US')
    : value ?? '';

  const handleInputChange = useCallback((e) => {
    let raw = e.target.value.replace(/,/g, '');
    if (type === "number") {
      if (raw === '' || /^\d+$/.test(raw)) {
        onChange({ ...e, target: { ...e.target, name, value: raw } });
      }
    } else {
      onChange(e);
    }
  }, [type, name, onChange]);

  const inputId = `input-${name}`;
  const errorId = error ? `error-${name}` : undefined;

  return (
    <div className="relative w-full">
      <input
        id={inputId}
        type={type === "number" ? "text" : type}
        inputMode={type === "number" ? "numeric" : undefined}
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onWheel={(e) => e.target.blur()}
        placeholder=" "
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          peer w-full bg-gray-50 rounded-md px-4 py-5 text-sm text-gray-800
          border ${error ? 'border-red-500' : 'border-gray-300'}
          focus:bg-white focus:border-[#003266] focus:ring-1 focus:ring-[#003266]/20
          outline-none transition-all duration-200
          placeholder-transparent
        `}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={`
          absolute left-4 pointer-events-none transition-all duration-200 ease-out
          text-gray-500 text-sm
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-focus:top-2 peer-focus:text-xs
          peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs
          peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1
          peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:-ml-1
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {error && (
        <p id={errorId} className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
FloatingInput.displayName = 'FloatingInput';

const Survey = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

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
    yourNetIncome: "",
    yourIncomeMonths: "12",
    partnerNetIncome: "",
    partnerIncomeMonths: "12",
    savings: "",
    loanPayments: "",
    household: "",
    education: "",
    vacation: "",
    realProperties: "",
    carAppliancesJewelry: "",
    cashBankDeposits: "",
    mutualFundUITF: "",
    businessInvestments: "",
    insuranceCashValue: "",
    realEstateLoan: "",
    carSalaryLoans: "",
    creditCardBalance: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const parseNum = useCallback((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, []);

  const validateStep = useCallback(() => {
    const newErrors = {};

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (form.age && parseNum(form.age) <= 0) newErrors.age = "Age must be positive";
      if (form.retirementYears && parseNum(form.retirementYears) <= 0) {
        newErrors.retirementYears = "Years to retirement must be positive";
      }
      if (form.retirementYears && parseNum(form.retirementYears) > 60) {
        newErrors.retirementYears = "Please enter a realistic timeframe";
      }
    }

    if (step === 2) {
      const yourIncome = parseNum(form.yourNetIncome);
      const partnerIncome = parseNum(form.partnerNetIncome);
      
      if (!yourIncome && !partnerIncome) {
        newErrors.yourNetIncome = "At least one income source is required";
      }
      
      if (form.yourIncomeMonths) {
        const months = parseNum(form.yourIncomeMonths);
        if (months < 1 || months > 12) {
          newErrors.yourIncomeMonths = "Must be between 1–12";
        }
      }
      
      if (form.partnerIncomeMonths) {
        const months = parseNum(form.partnerIncomeMonths);
        if (months < 1 || months > 12) {
          newErrors.partnerIncomeMonths = "Must be between 1–12";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, form, parseNum]);

  const next = useCallback(() => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
      // Reset summary view when moving to results
      if (prev + 1 === 4) {
        setShowSummary(false);
      }
    } else {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [validateStep]);

  const prev = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const progress = step === 4 ? 100 : Math.min((step / 3) * 100, 99);

  // ────────────────────────────────────────────────
  // Financial Calculations
  // ────────────────────────────────────────────────
  
  const totalMonthlyIncome = useMemo(() => {
    return parseNum(form.yourNetIncome) + parseNum(form.partnerNetIncome);
  }, [form.yourNetIncome, form.partnerNetIncome, parseNum]);

  const annualIncome = useMemo(() => totalMonthlyIncome * 12, [totalMonthlyIncome]);
  const partnerAnnualIncome = useMemo(() => parseNum(form.partnerNetIncome) * 12, [form.partnerNetIncome, parseNum]);

  const totalMonthlyExpenses = useMemo(() => {
    return ['savings', 'loanPayments', 'household', 'education', 'vacation']
      .reduce((sum, key) => sum + parseNum(form[key]), 0);
  }, [form, parseNum]);

  const monthlyExcess = useMemo(() => totalMonthlyIncome - totalMonthlyExpenses, [totalMonthlyIncome, totalMonthlyExpenses]);

  const totalAssets = useMemo(() => {
    return ['realProperties', 'carAppliancesJewelry', 'cashBankDeposits', 'mutualFundUITF', 'businessInvestments', 'insuranceCashValue']
      .reduce((sum, key) => sum + parseNum(form[key]), 0);
  }, [form, parseNum]);

  const totalLiabilities = useMemo(() => {
    return ['realEstateLoan', 'carSalaryLoans', 'creditCardBalance']
      .reduce((sum, key) => sum + parseNum(form[key]), 0);
  }, [form, parseNum]);

  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities]);
  const cashLiquidity = useMemo(() => parseNum(form.cashBankDeposits), [form.cashBankDeposits, parseNum]);

  const efMin = useMemo(() => totalMonthlyExpenses * 6, [totalMonthlyExpenses]);
  const efMax = useMemo(() => totalMonthlyExpenses * 12, [totalMonthlyExpenses]);
  const efShortage = useMemo(() => Math.max(0, efMin - cashLiquidity), [efMin, cashLiquidity]);

  const currentSavings = useMemo(() => parseNum(form.savings), [form.savings, parseNum]);
  const savingsRate = useMemo(() => 
    totalMonthlyIncome > 0 ? (currentSavings / totalMonthlyIncome) * 100 : 0
  , [currentSavings, totalMonthlyIncome]);

  const monthlyDebt = useMemo(() => 
    parseNum(form.loanPayments) + (parseNum(form.creditCardBalance) / 12)
  , [form.loanPayments, form.creditCardBalance, parseNum]);
  
  const debtRate = useMemo(() => 
    totalMonthlyIncome > 0 ? (monthlyDebt / totalMonthlyIncome) * 100 : 0
  , [monthlyDebt, totalMonthlyIncome]);

  const yourIns = useMemo(() => parseNum(form.lifeInsurance), [form.lifeInsurance, parseNum]);
  const yourInsMultiple = useMemo(() => 
    annualIncome > 0 ? (yourIns / annualIncome).toFixed(1) : '0.0'
  , [yourIns, annualIncome]);
  const yourInsShortage = useMemo(() => Math.max(0, annualIncome * 5 - yourIns), [annualIncome, yourIns]);

  const partnerIns = useMemo(() => parseNum(form.partnerLifeInsurance), [form.partnerLifeInsurance, parseNum]);
  const partnerInsMultiple = useMemo(() => 
    partnerAnnualIncome > 0 ? (partnerIns / partnerAnnualIncome).toFixed(1) : '0.0'
  , [partnerIns, partnerAnnualIncome]);
  const partnerInsShortage = useMemo(() => Math.max(0, partnerAnnualIncome * 5 - partnerIns), [partnerAnnualIncome, partnerIns]);

  const yourHealth = useMemo(() => parseNum(form.healthCoverage), [form.healthCoverage, parseNum]);
  const partnerHealth = useMemo(() => parseNum(form.partnerHealthCoverage), [form.partnerHealthCoverage, parseNum]);
  const idealHealthYou = useMemo(() => annualIncome, [annualIncome]);
  const idealHealthPartner = useMemo(() => partnerAnnualIncome * 0.5, [partnerAnnualIncome]);
  const yourHealthShortage = useMemo(() => Math.max(0, idealHealthYou - yourHealth), [idealHealthYou, yourHealth]);
  const partnerHealthShortage = useMemo(() => Math.max(0, idealHealthPartner - partnerHealth), [idealHealthPartner, partnerHealth]);

  const liqPercent = useMemo(() => 
    totalAssets > 0 ? (cashLiquidity / totalAssets) * 100 : 0
  , [cashLiquidity, totalAssets]);

  // College Fund Projections
  const TUITION_BASE = 150000;
  const TUITION_INFLATION = 0.05;
  const COLLEGE_DURATION = 4;
  const COLLEGE_START_AGE = 18;

  const children = useMemo(() => {
    const childFields = ['child1', 'child2', 'child3', 'child4', 'child5'];
    return childFields
      .map((field, index) => ({
        name: `Child ${index + 1}`,
        age: parseNum(form[field])
      }))
      .filter(c => c.age > 0 && c.age < COLLEGE_START_AGE);
  }, [form, parseNum]);

  const collegeGaps = useMemo(() => {
    return children.map(child => {
      const yearsLeft = Math.max(0, COLLEGE_START_AGE - child.age);
      const futureAnnualTuition = TUITION_BASE * Math.pow(1 + TUITION_INFLATION, yearsLeft);
      const totalRequired = futureAnnualTuition * COLLEGE_DURATION;
      const currentAllocation = children.length > 0 
        ? (parseNum(form.mutualFundUITF) + parseNum(form.insuranceCashValue)) / children.length 
        : 0;
      const gap = Math.max(0, totalRequired - currentAllocation);
      
      return {
        ...child,
        yearsLeft,
        futureAnnualTuition,
        totalRequired,
        currentAllocation,
        gap
      };
    });
  }, [children, form.mutualFundUITF, form.insuranceCashValue, parseNum]);

  // Retirement Fund Projection
  const retirementYearsLeft = useMemo(() => {
    const years = parseNum(form.retirementYears);
    return years > 0 ? years : 20;
  }, [form.retirementYears, parseNum]);

  const RETIREMENT_EXPENSE_RATIO = 0.8;
  const RETIREMENT_DURATION = 15;
  const INFLATION_RATE = 0.03;
  const PRE_RETIREMENT_RETURN = 0.08;
  const POST_RETIREMENT_RETURN = 0.06;

  const inflationAdjustedReturn = useMemo(() => 
    (POST_RETIREMENT_RETURN - INFLATION_RATE) / (1 + INFLATION_RATE)
  , []);

  const retirementMonthlyNeed = useMemo(() => 
    totalMonthlyExpenses * RETIREMENT_EXPENSE_RATIO
  , [totalMonthlyExpenses]);

  const retirementFVmonthly = useMemo(() => 
    retirementMonthlyNeed * Math.pow(1 + INFLATION_RATE, retirementYearsLeft)
  , [retirementMonthlyNeed, retirementYearsLeft]);

  const retirementFVannual = useMemo(() => retirementFVmonthly * 12, [retirementFVmonthly]);

  const requiredRetirementFund = useMemo(() => {
    if (inflationAdjustedReturn === 0) return retirementFVannual * RETIREMENT_DURATION;
    return retirementFVannual * (1 - Math.pow(1 + inflationAdjustedReturn, -RETIREMENT_DURATION)) / inflationAdjustedReturn;
  }, [retirementFVannual, inflationAdjustedReturn]);

  const retirementAssetAllocation = useMemo(() => totalAssets * 0.5, [totalAssets]);
  const projectedRetirementFund = useMemo(() => 
    retirementAssetAllocation * Math.pow(1 + PRE_RETIREMENT_RETURN, retirementYearsLeft)
  , [retirementAssetAllocation, retirementYearsLeft]);

  const retirementGap = useMemo(() => 
    Math.max(0, requiredRetirementFund - projectedRetirementFund)
  , [requiredRetirementFund, projectedRetirementFund]);

  const requiredAnnualToCloseGap = useMemo(() => {
    if (retirementGap === 0) return 0;
    return retirementGap / Math.pow(1 + PRE_RETIREMENT_RETURN, retirementYearsLeft);
  }, [retirementGap, retirementYearsLeft]);

  const requiredMonthlyToCloseGap = useMemo(() => requiredAnnualToCloseGap / 12, [requiredAnnualToCloseGap]);
  const retirementSavingsShortage = useMemo(() => 
    Math.max(0, requiredMonthlyToCloseGap - currentSavings)
  , [requiredMonthlyToCloseGap, currentSavings]);

  // Estate Tax Estimate
  const ESTATE_EXEMPTION = 5000000;
  const ESTATE_TAX_RATE = 0.06;
  const taxableEstate = useMemo(() => Math.max(0, netWorth - ESTATE_EXEMPTION), [netWorth]);
  const estimatedEstateTax = useMemo(() => taxableEstate * ESTATE_TAX_RATE, [taxableEstate]);
  const estateTaxStatus = useMemo(() => 
    taxableEstate === 0 ? "TAX IS MINIMAL" : "TAX APPLICABLE"
  , [taxableEstate]);

  const formatCurrency = useCallback((amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '₱0';
    return `₱${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }, []);

  const formatPercent = useCallback((value) => `${Math.round(value)}%`, []);

  // Determine status for summary
  const getEmergencyFundStatus = () => efShortage > 0 ? "INSUFFICIENT" : "ADEQUATE";
  const getSavingsRateStatus = () => savingsRate < 10 ? "INSUFFICIENT" : "ADEQUATE";
  const getDebtLoadStatus = () => {
    if (debtRate < 5) return "MINIMAL";
    if (debtRate < 15) return "LIGHT";
    if (debtRate < 36) return "MODERATE";
    if (debtRate < 50) return "HEAVY";
    return "VERY HEAVY";
  };
  const getYourInsuranceStatus = () => yourInsShortage > 0 ? "INSUFFICIENT" : "ADEQUATE";
  const getPartnerInsuranceStatus = () => partnerInsShortage > 0 ? "INSUFFICIENT" : "ADEQUATE";
  const getYourHealthStatus = () => {
    if (yourHealthShortage === 0) return "ADEQUATE";
    if (yourHealthShortage < idealHealthYou * 0.25) return "SLIGHTLY INSUFFICIENT";
    return "INSUFFICIENT";
  };
  const getPartnerHealthStatus = () => {
    if (partnerHealthShortage === 0) return "ADEQUATE";
    if (partnerHealthShortage < idealHealthPartner * 0.25) return "SLIGHTLY INSUFFICIENT";
    if (partnerHealthShortage < idealHealthPartner * 0.5) return "INSUFFICIENT";
    return "VERY INSUFFICIENT";
  };
  const getLiquidityStatus = () => {
    if (liqPercent < 10) return "VERY LOW";
    if (liqPercent < 25) return "MODERATE";
    return "HEALTHY";
  };
  const getCollegeFundStatus = () => {
    if (children.length === 0) return "N/A";
    const hasGap = collegeGaps.some(c => c.gap > 0);
    return hasGap ? "INSUFFICIENT FUNDS" : "ADEQUATE";
  };
  const getRetirementStatus = () => retirementGap > 0 ? "INSUFFICIENT FUNDS" : "ADEQUATE";

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const toggleSummary = useCallback(() => {
    setShowSummary(prev => !prev);
  }, []);

  return (
    <div className="w-full min-h-screen pt-24 md:pt-30 px-4 pb-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 flex justify-center">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
          .print-bg-white {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-bg-blue {
            background: #003266 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-border {
            border: 1px solid #ddd !important;
          }
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 md:p-10 print-container">
        {/* Logo Header - Only visible in print */}
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-[#003266]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo Placeholder - Replace with actual logo */}
              <div className="w-16 h-16 bg-[#003266] rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">LOGO</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#003266]">Financial Needs Analysis</h1>
                <p className="text-sm text-gray-600">Comprehensive Financial Assessment Report</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-medium text-[#003266]">{form.name || 'Client Name'}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar - Hidden in print */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden no-print" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div 
            className="h-full bg-[#003266] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }} 
            aria-hidden="true"
          />
        </div>

        <p className="text-xs text-[#003266] font-semibold mb-6 uppercase tracking-wider no-print" aria-live="polite">
          {step === 4 ? "Financial Needs Analysis Summary" : `Step ${step} of 3`}
        </p>

        {/* STEP 1: General Information */}
        {step === 1 && (
          <section aria-labelledby="step1-heading" className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
            <h2 id="step1-heading" className="text-xl font-bold text-[#003266] mb-1 text-center">GENERAL INFORMATION</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Tell us a little about yourself and your family.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FloatingInput label="Your Full Name" name="name" value={form.name} onChange={handleChange} required error={errors.name} autoComplete="name" />
              <FloatingInput label="Your Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} min="18" max="100" />
              <FloatingInput label="Civil Status" name="civilStatus" value={form.civilStatus} onChange={handleChange} placeholder="Single, Married, etc." />
              <FloatingInput label="Years Until Retirement" name="retirementYears" type="number" value={form.retirementYears} onChange={handleChange} error={errors.retirementYears} min="1" max="60" />
              <FloatingInput label="Spouse/Partner's Age" name="spouseAge" type="number" value={form.spouseAge} onChange={handleChange} min="18" max="100" placeholder="If applicable" />
              <FloatingInput label="Your Life Insurance Coverage" name="lifeInsurance" type="number" value={form.lifeInsurance} onChange={handleChange} placeholder="Total face amount" />
              <FloatingInput label="Partner's Life Insurance Coverage" name="partnerLifeInsurance" type="number" value={form.partnerLifeInsurance} onChange={handleChange} placeholder="Total face amount" />
              <FloatingInput label="Your Health Insurance Coverage" name="healthCoverage" type="number" value={form.healthCoverage} onChange={handleChange} placeholder="Annual limit" />
              <FloatingInput label="Partner's Health Insurance Coverage" name="partnerHealthCoverage" type="number" value={form.partnerHealthCoverage} onChange={handleChange} placeholder="Annual limit" />
            </div>

            <fieldset className="mt-10">
              <legend className="text-sm font-semibold text-[#003266] mb-4 block">Ages of Children Under 18 (if any)</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {['child1', 'child2', 'child3', 'child4', 'child5'].map((childName, idx) => (
                  <FloatingInput 
                    key={childName}
                    label={`Child ${idx + 1}`} 
                    name={childName} 
                    type="number" 
                    value={form[childName]} 
                    onChange={handleChange}
                    min="0"
                    max="17"
                  />
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {/* STEP 2: Income & Expenses */}
        {step === 2 && (
          <section aria-labelledby="step2-heading" className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
            <h2 id="step2-heading" className="text-xl font-bold text-[#003266] mb-1 text-center">MONTHLY INCOME & EXPENSES</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Enter your household cash flow information.</p>

            {/* Income Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Income Sources</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Your Income */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-[#003266] text-sm mb-4">Your Income</h4>
                  <div className="space-y-4">
                    <FloatingInput 
                      label="Net monthly income" 
                      name="yourNetIncome" 
                      type="number" 
                      value={form.yourNetIncome} 
                      onChange={handleChange} 
                      error={errors.yourNetIncome}
                      placeholder="After-tax take home"
                    />
                    <FloatingInput 
                      label="Months received per year" 
                      name="yourIncomeMonths" 
                      type="number" 
                      value={form.yourIncomeMonths} 
                      onChange={handleChange} 
                      error={errors.yourIncomeMonths}
                      min="1"
                      max="12"
                    />
                  </div>
                </div>

                {/* Partner's Income */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-[#003266] text-sm mb-4">Partner's Income</h4>
                  <div className="space-y-4">
                    <FloatingInput 
                      label="Net monthly income" 
                      name="partnerNetIncome" 
                      type="number" 
                      value={form.partnerNetIncome} 
                      onChange={handleChange}
                      placeholder="After-tax take home"
                    />
                    <FloatingInput 
                      label="Months received per year" 
                      name="partnerIncomeMonths" 
                      type="number" 
                      value={form.partnerIncomeMonths} 
                      onChange={handleChange} 
                      error={errors.partnerIncomeMonths}
                      min="1"
                      max="12"
                    />
                  </div>
                </div>
              </div>

              {/* Total Income Summary */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Net Income</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalMonthlyIncome)}
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Monthly Expenses</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FloatingInput label="Savings & Investments" name="savings" type="number" value={form.savings} onChange={handleChange} placeholder="Amount set aside" />
                <FloatingInput label="Loan Payments" name="loanPayments" type="number" value={form.loanPayments} onChange={handleChange} placeholder="All debt payments" />
                <FloatingInput label="Household & Work" name="household" type="number" value={form.household} onChange={handleChange} placeholder="Utilities, transport, etc." />
                <FloatingInput label="Education" name="education" type="number" value={form.education} onChange={handleChange} placeholder="Tuition, supplies" />
                <FloatingInput label="Leisure & Vacation" name="vacation" type="number" value={form.vacation} onChange={handleChange} placeholder="Entertainment, travel" />
              </div>

              {/* Total Expenses Summary */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Expenses</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalMonthlyExpenses)}
                </span>
              </div>

              {/* Cash Flow Result */}
              <div className="mt-6 bg-[#003266]/5 p-5 rounded-lg border border-[#003266]/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Cash Flow</span>
                  <span 
                    className={`text-xl font-bold ${monthlyExcess >= 0 ? "text-green-600" : "text-red-600"}`}
                    aria-live="polite"
                  >
                    {monthlyExcess >= 0 ? '+' : ''}{formatCurrency(monthlyExcess)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {monthlyExcess >= 0 
                    ? "You have surplus cash to allocate toward goals" 
                    : "Expenses exceed income – review budget priorities"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: Assets & Liabilities */}
        {step === 3 && (
          <section aria-labelledby="step3-heading" className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
            <h2 id="step3-heading" className="text-xl font-bold text-[#003266] mb-1 text-center">ASSETS, LIABILITIES & NET WORTH</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Let's calculate your current financial position.</p>

            {/* Assets */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Assets (What You Own)</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FloatingInput label="Real Estate Properties" name="realProperties" type="number" value={form.realProperties} onChange={handleChange} placeholder="Market value" />
                <FloatingInput label="Vehicles & Valuables" name="carAppliancesJewelry" type="number" value={form.carAppliancesJewelry} onChange={handleChange} placeholder="Cars, jewelry, etc." />
                <FloatingInput label="Cash & Bank Deposits" name="cashBankDeposits" type="number" value={form.cashBankDeposits} onChange={handleChange} placeholder="Savings, checking" />
                <FloatingInput label="Investments" name="mutualFundUITF" type="number" value={form.mutualFundUITF} onChange={handleChange} placeholder="UITF, mutual funds, stocks" />
                <FloatingInput label="Business Interests" name="businessInvestments" type="number" value={form.businessInvestments} onChange={handleChange} placeholder="Ownership value" />
                <FloatingInput label="Insurance Cash Value" name="insuranceCashValue" type="number" value={form.insuranceCashValue} onChange={handleChange} placeholder="VUL, endowment surrender value" />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Assets</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalAssets)}
                </span>
              </div>
            </div>

            {/* Liabilities */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Liabilities (What You Owe)</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FloatingInput label="Real Estate Loans" name="realEstateLoan" type="number" value={form.realEstateLoan} onChange={handleChange} placeholder="Mortgage balance" />
                <FloatingInput label="Auto & Personal Loans" name="carSalaryLoans" type="number" value={form.carSalaryLoans} onChange={handleChange} placeholder="Car loan, salary loan" />
                <FloatingInput label="Credit Card Balances" name="creditCardBalance" type="number" value={form.creditCardBalance} onChange={handleChange} placeholder="Outstanding balance" />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Liabilities</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalLiabilities)}
                </span>
              </div>
            </div>

            {/* Net Worth Summary */}
            <div className="bg-gradient-to-r from-[#003266]/10 to-[#003266]/5 p-6 rounded-xl border border-[#003266]/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                <span className="text-lg font-semibold text-gray-800">Net Worth</span>
                <span className="text-2xl font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(netWorth)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {formatCurrency(totalAssets)} (Assets) − {formatCurrency(totalLiabilities)} (Liabilities)
              </p>
              {netWorth < 0 && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  Negative net worth: Focus on reducing debt and building assets
                </p>
              )}
            </div>
          </section>
        )}

        {/* STEP 4: Results Summary */}
        {step === 4 && (
          <section aria-labelledby="results-heading" className="space-y-6 pb-8">
            <h2 id="results-heading" className="text-2xl font-bold text-[#003266] text-center">
              Your Financial Needs Analysis
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Based on your inputs, here's a comprehensive assessment of your financial readiness. 
              Click the button below to view your summary report.
            </p>

            {/* Detailed Analysis Sections */}
            <div className="space-y-6 mt-8">
              <h3 className="text-lg font-bold text-[#003266] border-b pb-2">DETAILED ANALYSIS</h3>

            {/* Emergency Fund */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="ef-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="ef-heading">Emergency Fund</span>
                <span className={`text-sm px-3 py-1 rounded-full ${efShortage > 0 ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"}`}>
                  {efShortage > 0 ? "INSUFFICIENT" : "ADEQUATE"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Recommended Range</td>
                      <td className="py-2 text-right font-medium">
                        {formatCurrency(efMin)} – {formatCurrency(efMax)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Based on</td>
                      <td className="py-2 text-right">6–12 months of expenses ({formatCurrency(totalMonthlyExpenses)}/mo)</td>
                    </tr>
                    <tr className="border-b border-gray-100 font-semibold bg-gray-50">
                      <td className="py-3">Your Liquid Reserves</td>
                      <td className="py-3 text-right text-[#003266]">{formatCurrency(cashLiquidity)}</td>
                    </tr>
                    <tr className="text-xs text-gray-500">
                      <td colSpan={2} className="py-1 pl-4">
                        • Cash & deposits: {formatCurrency(parseNum(form.cashBankDeposits))}<br/>
                        • Liquid investments: {formatCurrency(parseNum(form.mutualFundUITF) + parseNum(form.insuranceCashValue))}
                      </td>
                    </tr>
                    {efShortage > 0 && (
                      <tr>
                        <td colSpan={2} className="pt-4 text-red-600 font-medium bg-red-50 p-3 rounded">
                          Shortage of {formatCurrency(efShortage)} – prioritize building your emergency fund
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Savings Rate */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="savings-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="savings-heading">Savings Rate</span>
                <span className={`text-sm px-3 py-1 rounded-full ${savingsRate < 10 ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"}`}>
                  {savingsRate < 10 ? "BELOW TARGET" : "ON TRACK"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Recommended Savings</td>
                      <td className="py-2 text-right font-medium">
                        10–20% of income ({formatCurrency(totalMonthlyIncome * 0.1)} – {formatCurrency(totalMonthlyIncome * 0.2)})
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 font-semibold bg-gray-50">
                      <td className="py-3">Your Current Savings</td>
                      <td className="py-3 text-right text-[#003266]">
                        {formatCurrency(currentSavings)} ({formatPercent(savingsRate)})
                      </td>
                    </tr>
                    {savingsRate < 10 && (
                      <tr>
                        <td colSpan={2} className="pt-4 text-red-600 font-medium bg-red-50 p-3 rounded">
                          Consider increasing savings to at least 10% of income to build wealth
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Debt Load */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="debt-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="debt-heading">Debt Burden</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  debtRate < 5 ? "bg-green-500/20 text-green-200" :
                  debtRate < 15 ? "bg-blue-500/20 text-blue-200" :
                  debtRate < 36 ? "bg-yellow-500/20 text-yellow-800" :
                  debtRate < 50 ? "bg-orange-500/20 text-orange-200" :
                  "bg-red-500/20 text-red-200"
                }`}>
                  {debtRate < 5 ? "MINIMAL" :
                   debtRate < 15 ? "LIGHT" :
                   debtRate < 36 ? "MODERATE" :
                   debtRate < 50 ? "HEAVY" : "VERY HEAVY"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-medium">Guideline</th>
                      <th className="p-3 text-center font-medium">Monthly Amount</th>
                      <th className="p-3 text-center font-medium">Debt Ratio</th>
                      <th className="p-3 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Maximum Recommended</td>
                      <td className="p-3 text-center">{formatCurrency(totalMonthlyIncome * 0.36)}</td>
                      <td className="p-3 text-center">≤36%</td>
                      <td className="p-3 text-center text-green-600">Healthy</td>
                    </tr>
                    <tr className="border-b bg-gray-50 font-medium">
                      <td className="p-3">Your Current Debt</td>
                      <td className="p-3 text-center" colSpan={3}>
                        {formatCurrency(monthlyDebt)} ({formatPercent(debtRate)})
                      </td>
                    </tr>
                  </tbody>
                </table>
                {debtRate > 36 && (
                  <p className="mt-4 text-red-600 text-sm font-medium">
                    High debt burden may limit your ability to save and invest. Consider debt consolidation or acceleration strategies.
                  </p>
                )}
              </div>
            </article>

            {/* Life Insurance Coverage */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="life-ins-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="life-ins-heading">Life Insurance Coverage</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  yourInsShortage > 0 || partnerInsShortage > 0 ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
                }`}>
                  {(yourInsShortage > 0 || partnerInsShortage > 0) ? "INSUFFICIENT" : "ADEQUATE"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <p className="mb-4 text-sm text-gray-700">
                  Recommended coverage: <strong>5–12x annual income</strong> to protect dependents.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-3 text-left font-medium">Coverage Target</th>
                        <th className="border p-3 text-center font-medium">You</th>
                        <th className="border p-3 text-center font-medium">Partner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[12, 10, 5].map(multiple => (
                        <tr key={multiple} className="border-b">
                          <td className="border p-3">{multiple}x annual income</td>
                          <td className="border p-3 text-center">{formatCurrency(annualIncome * multiple)}</td>
                          <td className="border p-3 text-center">{formatCurrency(partnerAnnualIncome * multiple)}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-50">
                        <td className="border p-3">Current Coverage</td>
                        <td className="border p-3 text-center">
                          {formatCurrency(yourIns)} ({yourInsMultiple}x)
                          {yourInsShortage > 0 && <span className="block text-red-600 text-xs">Short: {formatCurrency(yourInsShortage)}</span>}
                        </td>
                        <td className="border p-3 text-center">
                          {formatCurrency(partnerIns)} ({partnerInsMultiple}x)
                          {partnerInsShortage > 0 && <span className="block text-red-600 text-xs">Short: {formatCurrency(partnerInsShortage)}</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* Health Insurance Coverage */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="health-ins-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="health-ins-heading">Health Insurance Coverage</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  yourHealthShortage > 0 || partnerHealthShortage > 0 ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
                }`}>
                  {(yourHealthShortage > 0 || partnerHealthShortage > 0) ? "REVIEW NEEDED" : "ADEQUATE"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-[#003266] mb-1">Your Coverage</p>
                    <p className="text-2xl font-bold">{formatCurrency(yourHealth)}</p>
                    <p className="text-xs text-gray-500 mt-1">Target: {formatCurrency(idealHealthYou)} (100% of annual income)</p>
                    {yourHealthShortage > 0 && (
                      <p className="text-red-600 text-sm mt-2 font-medium">
                        Gap: {formatCurrency(yourHealthShortage)}
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-[#003266] mb-1">Partner's Coverage</p>
                    <p className="text-2xl font-bold">{formatCurrency(partnerHealth)}</p>
                    <p className="text-xs text-gray-500 mt-1">Target: {formatCurrency(idealHealthPartner)} (50% of annual income)</p>
                    {partnerHealthShortage > 0 && (
                      <p className="text-red-600 text-sm mt-2 font-medium">
                        Gap: {formatCurrency(partnerHealthShortage)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Note: Health coverage targets are estimates. Actual needs depend on family medical history and existing employer benefits.
                </p>
              </div>
            </article>

            {/* Liquidity Ratio */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="liquidity-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="liquidity-heading">Asset Liquidity</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  liqPercent < 10 ? "bg-red-500/20 text-red-200" :
                  liqPercent < 25 ? "bg-yellow-500/20 text-yellow-800" :
                  "bg-green-500/20 text-green-200"
                }`}>
                  {liqPercent < 10 ? "VERY LOW" : liqPercent < 25 ? "MODERATE" : "HEALTHY"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          liqPercent < 10 ? "bg-red-500" : liqPercent < 25 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(liqPercent, 100)}%` }}
                        aria-valuenow={Math.round(liqPercent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPercent(liqPercent)} of total assets are liquid (cash or easily convertible)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#003266]">{formatPercent(liqPercent)}</p>
                    <p className="text-xs text-gray-500">Liquidity Ratio</p>
                  </div>
                </div>
                {liqPercent < 10 && (
                  <p className="mt-4 text-red-600 text-sm font-medium">
                    Low liquidity may limit your ability to handle emergencies without selling long-term assets at a loss.
                  </p>
                )}
              </div>
            </article>

            {/* College Fund Projection */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="college-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="college-heading">College Education Fund</span>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-200">
                  {children.length > 0 ? `${children.length} CHILD(REN)` : "NO DEPENDENTS"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                {children.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No children under 18 reported. Add ages in Step 1 to project education needs.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left font-medium">Child</th>
                          <th className="border p-3 text-center font-medium">Current Age</th>
                          <th className="border p-3 text-center font-medium">Years to College</th>
                          <th className="border p-3 text-center font-medium">Est. Total Cost*</th>
                          <th className="border p-3 text-center font-medium">Funding Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collegeGaps.map((child, index) => (
                          <tr key={`${child.name}-${index}`} className="border-b hover:bg-gray-50">
                            <td className="border p-3 font-medium">{child.name}</td>
                            <td className="border p-3 text-center">{child.age}</td>
                            <td className="border p-3 text-center">{child.yearsLeft}</td>
                            <td className="border p-3 text-center">{formatCurrency(child.totalRequired)}</td>
                            <td className={`border p-3 text-center font-medium ${child.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {child.gap > 0 ? formatCurrency(child.gap) : 'Covered'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-3">
                      *Based on ₱150,000 current annual tuition with 5% annual inflation. Assumes 4-year degree starting at age 18.
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Retirement Fund Projection */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="retirement-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="retirement-heading">Retirement Readiness</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  retirementGap > 0 ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
                }`}>
                  {retirementGap > 0 ? "ACTION NEEDED" : "ON TRACK"}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Years until retirement</p>
                    <p className="font-semibold text-lg">{retirementYearsLeft}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current monthly expenses</p>
                    <p className="font-semibold text-lg">{formatCurrency(totalMonthlyExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estimated retirement need (80% of expenses)</p>
                    <p className="font-semibold text-lg">{formatCurrency(retirementMonthlyNeed)}/mo</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Inflation assumption</p>
                    <p className="font-semibold">3.0% annually</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expected return (pre-retirement)</p>
                    <p className="font-semibold">8.0% annually</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expected return (in retirement)</p>
                    <p className="font-semibold">6.0% annually</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Real return after inflation*</p>
                    <p className="font-semibold">{(inflationAdjustedReturn * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Future monthly need at retirement</p>
                    <p className="font-semibold">{formatCurrency(retirementFVmonthly)}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  *Real return calculated using Fisher equation: (nominal return − inflation) / (1 + inflation)
                </p>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Required Retirement Fund</span>
                    <span className="text-xl font-bold text-[#003266]">{formatCurrency(requiredRetirementFund)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Projected from current assets</span>
                    <span className="font-medium">{formatCurrency(projectedRetirementFund)}</span>
                  </div>
                  
                  {retirementGap > 0 && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 font-medium mb-2">
                        Projected shortfall: {formatCurrency(retirementGap)}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Required monthly savings to close gap</p>
                          <p className="font-bold text-red-600">{formatCurrency(requiredMonthlyToCloseGap)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Your current monthly savings</p>
                          <p className="font-bold">{formatCurrency(currentSavings)}</p>
                        </div>
                      </div>
                      {retirementSavingsShortage > 0 && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                          Additional monthly savings needed: {formatCurrency(retirementSavingsShortage)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Estate Tax Estimate */}
            <article className="border rounded-xl overflow-hidden shadow-sm print-break-inside-avoid" aria-labelledby="estate-heading">
              <header className="bg-[#003266] print-bg-blue text-white px-6 py-4 font-bold text-lg flex justify-between items-center">
                <span id="estate-heading">Estate Tax Estimate</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  estateTaxStatus === "TAX IS MINIMAL" ? "bg-green-500/20 text-green-200" : "bg-orange-500/20 text-orange-200"
                }`}>
                  {estateTaxStatus}
                </span>
              </header>
              <div className="p-6 bg-white print-bg-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Estimated Net Estate</p>
                    <p className="text-xl font-bold">{formatCurrency(netWorth)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taxable Amount (over ₱5M exemption)</p>
                    <p className="text-xl font-bold">{formatCurrency(taxableEstate)}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    {estateTaxStatus === "TAX IS MINIMAL" 
                      ? "Your estate is below the ₱5,000,000 tax exemption threshold. No estate tax is expected under current Philippine law."
                      : `Estimated estate tax: ${formatCurrency(estimatedEstateTax)} (6% of taxable estate)`
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Note: This is a simplified estimate. Actual estate tax may vary based on deductions, property valuations, and legal provisions. Consult an estate planning professional.
                  </p>
                </div>
              </div>
            </article>
            </div>

             {/* SUMMARY OF RESULTS TABLE - Only shown when showSummary is true */}
            {showSummary && (
              <div className="print-break-inside-avoid">
                <div className="bg-[#003266] text-white px-6 py-4 rounded-t-xl">
                  <h2 className="text-xl font-bold text-center">SUMMARY OF RESULTS</h2>
                </div>
                <div className="border-x border-b border-gray-300 rounded-b-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-100 print-bg-blue">
                      <tr>
                        <th className="px-6 py-3 text-left font-bold text-[#003266] print:text-white border-b border-gray-300">Financial Measure</th>
                        <th className="px-6 py-3 text-left font-bold text-[#003266] print:text-white border-b border-gray-300">Findings</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white-50 print-bg-white">
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Emergency Fund</td>
                        <td className={`px-6 py-3 font-semibold ${efShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {getEmergencyFundStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Savings Rate</td>
                        <td className={`px-6 py-3 font-semibold ${savingsRate < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {getSavingsRateStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Debt Load</td>
                        <td className={`px-6 py-3 font-semibold ${
                          debtRate >= 36 ? 'text-red-600' : debtRate >= 15 ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          {getDebtLoadStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Your Insurance Coverage</td>
                        <td className={`px-6 py-3 font-semibold ${yourInsShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {getYourInsuranceStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Partner's Insurance Coverage</td>
                        <td className={`px-6 py-3 font-semibold ${partnerInsShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {getPartnerInsuranceStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Your Healthcare Coverage</td>
                        <td className={`px-6 py-3 font-semibold ${
                          yourHealthShortage === 0 ? 'text-green-600' : 
                          yourHealthShortage < idealHealthYou * 0.25 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {getYourHealthStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Partner's Healthcare Coverage</td>
                        <td className={`px-6 py-3 font-semibold ${
                          partnerHealthShortage === 0 ? 'text-green-600' :
                          partnerHealthShortage < idealHealthPartner * 0.25 ? 'text-blue-600' :
                          partnerHealthShortage < idealHealthPartner * 0.5 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {getPartnerHealthStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Liquidity</td>
                        <td className={`px-6 py-3 font-semibold ${
                          liqPercent < 10 ? 'text-red-600' : liqPercent < 25 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getLiquidityStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">College Education Fund</td>
                        <td className={`px-6 py-3 font-semibold ${
                          children.length === 0 ? 'text-gray-600' :
                          collegeGaps.some(c => c.gap > 0) ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {getCollegeFundStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Retirement Fund</td>
                        <td className={`px-6 py-3 font-semibold ${retirementGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {getRetirementStatus()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-3">Your Estate Tax Provision</td>
                        <td className={`px-6 py-3 font-semibold ${
                          estateTaxStatus === "TAX IS MINIMAL" ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {estateTaxStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3">Spouse's Estate Tax Provision</td>
                        <td className={`px-6 py-3 font-semibold ${
                          estateTaxStatus === "TAX IS MINIMAL" ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {estateTaxStatus}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Disclaimer */}
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-gray-700 print:bg-gray-100">
                  <p className="font-semibold mb-1">Important:</p>
                  <p>These results are based on general assumptions which may not necessarily apply to you. It is strongly recommended that you consult a competent financial planner before you carry out any plan to improve your financial health to avoid costly mistakes.</p>
                </div>
              </div>
            )}

            {/* Action Summary & Restart */}
            <div className="text-center pt-8 border-t border-gray-200 no-print">
              <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                <button
                  onClick={() => {
                    setStep(1);
                    setShowSummary(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#003266] text-white px-8 py-3 rounded-lg hover:bg-[#002244] font-medium shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#003266] focus:ring-offset-2"
                  aria-label="Start a new financial analysis"
                >
                  Start New Analysis
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-white text-[#003266] border border-[#003266] px-8 py-3 rounded-lg hover:bg-[#003266]/5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#003266] focus:ring-offset-2"
                  aria-label="Print or save this report"
                >
                  Save / Print Report
                </button>
                <button
                  onClick={toggleSummary}
                  className="bg-[#003266] text-white px-8 py-3 rounded-lg hover:bg-[#002244] font-medium shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#003266] focus:ring-offset-2"
                  aria-label="Toggle summary view"
                >
                  {showSummary ? "Hide Summary" : "View Summary"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4 max-w-md mx-auto">
                This analysis is for educational purposes only and does not constitute financial advice. 
                Please consult a licensed financial planner for personalized recommendations.
              </p>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600 text-center">
              <p>Financial Needs Analysis Report • Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="mt-1">This report is confidential and intended solely for the use of the individual named above.</p>
            </div>
          </section>
        )}

        {/* Navigation Buttons (Steps 1-3) */}
        {step < 4 && (
          <nav className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 no-print" aria-label="Form navigation">
            <button
              onClick={prev}
              disabled={step === 1}
              className="text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#003266] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003266]/20"
              aria-label={step === 1 ? undefined : "Go to previous step"}
            >
              Previous
            </button>

            <button
              onClick={next}
              className="bg-[#003266] text-white text-sm px-8 py-3 rounded-lg hover:bg-[#002244] transition-colors font-medium shadow-md shadow-[#003266]/20 focus:outline-none focus:ring-2 focus:ring-[#003266] focus:ring-offset-2"
              aria-label={step === 3 ? "View analysis results" : "Continue to next step"}
            >
              {step === 3 ? "View Results" : "Continue"}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Survey;