import React, { useState, useMemo, useCallback, memo } from "react";
import logo from "../../assets/images/short-cfs-b.png";

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
  const [expandedRow, setExpandedRow] = useState(null);

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
    children: [],
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

  const addChild = useCallback(() => {
    setForm(prev => ({
      ...prev,
      children: [...prev.children, { age: "", id: Date.now() }]
    }));
  }, []);

  const removeChild = useCallback((id) => {
    setForm(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
  }, []);

  const updateChildAge = useCallback((id, age) => {
    setForm(prev => ({
      ...prev,
      children: prev.children.map(child => 
        child.id === id ? { ...child, age } : child
      )
    }));
  }, []);

  const parseNum = useCallback((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, []);

  const validateStep = useCallback(() => {
    const newErrors = {};

    if (step === 1) {
      if (!form.name || !form.name.trim()) newErrors.name = "Name is required";
      if (!form.age || parseNum(form.age) <= 0) newErrors.age = "Age is required and must be positive";
      if (!form.civilStatus || !form.civilStatus.trim()) newErrors.civilStatus = "Civil Status is required";
      if (!form.retirementYears || parseNum(form.retirementYears) <= 0) {
        newErrors.retirementYears = "Years to retirement is required";
      }
      if (form.retirementYears && parseNum(form.retirementYears) > 60) {
        newErrors.retirementYears = "Please enter a realistic timeframe";
      }
      if (!form.lifeInsurance || parseNum(form.lifeInsurance) <= 0) {
        newErrors.lifeInsurance = "Life Insurance Coverage is required";
      }
      if (!form.healthCoverage || parseNum(form.healthCoverage) <= 0) {
        newErrors.healthCoverage = "Health Insurance Coverage is required";
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
    } else {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [validateStep]);

  const prev = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const toggleRow = useCallback((rowId) => {
    setExpandedRow(prev => prev === rowId ? null : rowId);
  }, []);

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

  const TUITION_BASE = 150000;
  const TUITION_INFLATION = 0.05;
  const COLLEGE_DURATION = 4;
  const COLLEGE_START_AGE = 18;

  const children = useMemo(() => {
    return form.children
      .map((child, index) => ({
        name: `Child ${index + 1}`,
        age: parseNum(child.age)
      }))
      .filter(c => c.age > 0 && c.age < COLLEGE_START_AGE);
  }, [form.children, parseNum]);

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

  return (
    <div className="w-full min-h-screen pt-24 md:pt-30 px-4 pb-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 flex justify-center">
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
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 md:p-10 print-container">
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-[#003266]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={logo} 
                alt="Caelum Financial Solutions" 
                className="w-16 h-16 object-contain"
              />
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
              <FloatingInput label="Your Age" name="age" type="number" value={form.age} onChange={handleChange} required error={errors.age} min="18" max="100" />
              <FloatingInput label="Civil Status" name="civilStatus" value={form.civilStatus} onChange={handleChange} required error={errors.civilStatus} placeholder="Single, Married, etc." />
              <FloatingInput label="Years Until Retirement" name="retirementYears" type="number" value={form.retirementYears} onChange={handleChange} required error={errors.retirementYears} min="1" max="60" />
              <FloatingInput label="Spouse/Partner's Age" name="spouseAge" type="number" value={form.spouseAge} onChange={handleChange} min="18" max="100" placeholder="If applicable" />
              <FloatingInput label="Your Life Insurance Coverage" name="lifeInsurance" type="number" value={form.lifeInsurance} onChange={handleChange} required error={errors.lifeInsurance} placeholder="Total face amount" />
              <FloatingInput label="Partner's Life Insurance Coverage" name="partnerLifeInsurance" type="number" value={form.partnerLifeInsurance} onChange={handleChange} placeholder="Total face amount" />
              <FloatingInput label="Your Health Insurance Coverage" name="healthCoverage" type="number" value={form.healthCoverage} onChange={handleChange} required error={errors.healthCoverage} placeholder="Annual limit" />
              <FloatingInput label="Partner's Health Insurance Coverage" name="partnerHealthCoverage" type="number" value={form.partnerHealthCoverage} onChange={handleChange} placeholder="Annual limit" />
            </div>

            <fieldset className="mt-10">
              <legend className="text-sm font-semibold text-[#003266] mb-4 block">Children Under 18 (if any)</legend>
              <div className="space-y-3">
                {form.children.map((child, index) => (
                  <div key={child.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <FloatingInput
                        label={`Child ${index + 1} Age`}
                        name={`child-${child.id}`}
                        type="number"
                        value={child.age}
                        onChange={(e) => updateChildAge(child.id, e.target.value)}
                        min="0"
                        max="17"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                      aria-label={`Remove child ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChild}
                  className="mt-2 px-4 py-2 bg-[#003266] text-white rounded-lg hover:bg-[#002244] text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>+ Add Child</span>
                </button>
              </div>
            </fieldset>
          </section>
        )}

        {/* STEP 2: Income & Expenses */}
        {step === 2 && (
          <section aria-labelledby="step2-heading" className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
            <h2 id="step2-heading" className="text-xl font-bold text-[#003266] mb-1 text-center">MONTHLY INCOME & EXPENSES</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Enter your household cash flow information.</p>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Income Sources</h3>
              <div className="grid lg:grid-cols-2 gap-6">
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

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Net Income</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalMonthlyIncome)}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#003266] mb-4 pb-2 border-b border-gray-200">Monthly Expenses</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FloatingInput label="Savings & Investments" name="savings" type="number" value={form.savings} onChange={handleChange} placeholder="Amount set aside" />
                <FloatingInput label="Loan Payments" name="loanPayments" type="number" value={form.loanPayments} onChange={handleChange} placeholder="All debt payments" />
                <FloatingInput label="Household & Work" name="household" type="number" value={form.household} onChange={handleChange} placeholder="Utilities, transport, etc." />
                <FloatingInput label="Education" name="education" type="number" value={form.education} onChange={handleChange} placeholder="Tuition, supplies" />
                <FloatingInput label="Leisure & Vacation" name="vacation" type="number" value={form.vacation} onChange={handleChange} placeholder="Entertainment, travel" />
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Total Monthly Expenses</span>
                <span className="text-lg font-bold text-[#003266]" aria-live="polite">
                  {formatCurrency(totalMonthlyExpenses)}
                </span>
              </div>

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

        {/* STEP 4: Results Summary with Dropdown Details */}
        {step === 4 && (
          <section aria-labelledby="results-heading" className="space-y-6 pb-8">
            <h2 id="results-heading" className="text-2xl font-bold text-[#003266] text-center">
              Your Financial Needs Analysis
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Based on your inputs, here's a comprehensive assessment of your financial readiness.
            </p>

            {/* SUMMARY TABLE WITH DROPDOWN DETAILS */}
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
                      <th className="px-6 py-3 text-center font-bold text-[#003266] print:text-white border-b border-gray-300 no-print">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white print-bg-white">
                    {/* Emergency Fund */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Emergency Fund</td>
                      <td className={`px-6 py-3 font-semibold ${efShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getEmergencyFundStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('emergency')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'emergency'}
                          aria-controls="emergency-details"
                        >
                          {expandedRow === 'emergency' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'emergency' && (
                      <tr id="emergency-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Recommended:</strong> {formatCurrency(efMin)} – {formatCurrency(efMax)}</p>
                            <p><strong>Based on:</strong> 6–12 months of expenses ({formatCurrency(totalMonthlyExpenses)}/mo)</p>
                            <p><strong>Your liquid reserves:</strong> {formatCurrency(cashLiquidity)}</p>
                            <p className="text-xs text-gray-500">• Cash & deposits: {formatCurrency(parseNum(form.cashBankDeposits))}</p>
                            <p className="text-xs text-gray-500">• Liquid investments: {formatCurrency(parseNum(form.mutualFundUITF) + parseNum(form.insuranceCashValue))}</p>
                            {efShortage > 0 && (
                              <p className="text-red-600"><strong>Shortage:</strong> {formatCurrency(efShortage)} – prioritize building your emergency fund</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Savings Rate */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Savings Rate</td>
                      <td className={`px-6 py-3 font-semibold ${savingsRate < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {getSavingsRateStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('savings')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'savings'}
                          aria-controls="savings-details"
                        >
                          {expandedRow === 'savings' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'savings' && (
                      <tr id="savings-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Recommended:</strong> 10–20% of income ({formatCurrency(totalMonthlyIncome * 0.1)} – {formatCurrency(totalMonthlyIncome * 0.2)})</p>
                            <p><strong>Your current savings:</strong> {formatCurrency(currentSavings)} ({formatPercent(savingsRate)})</p>
                            {savingsRate < 10 && (
                              <p className="text-red-600"><strong>Recommendation:</strong> Consider increasing savings to at least 10% of income to build wealth</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Debt Load */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Debt Load</td>
                      <td className={`px-6 py-3 font-semibold ${
                        debtRate >= 36 ? 'text-red-600' : debtRate >= 15 ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {getDebtLoadStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('debt')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'debt'}
                          aria-controls="debt-details"
                        >
                          {expandedRow === 'debt' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'debt' && (
                      <tr id="debt-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Current debt:</strong> {formatCurrency(monthlyDebt)} ({formatPercent(debtRate)} of income)</p>
                            <p><strong>Maximum recommended:</strong> ≤36% of income ({formatCurrency(totalMonthlyIncome * 0.36)})</p>
                            {debtRate > 36 && (
                              <p className="text-red-600"><strong>Warning:</strong> High debt burden may limit your ability to save and invest. Consider debt consolidation or acceleration strategies.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Your Insurance Coverage */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Your Insurance Coverage</td>
                      <td className={`px-6 py-3 font-semibold ${yourInsShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getYourInsuranceStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('yourInsurance')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'yourInsurance'}
                          aria-controls="yourInsurance-details"
                        >
                          {expandedRow === 'yourInsurance' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'yourInsurance' && (
                      <tr id="yourInsurance-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Your coverage:</strong> {formatCurrency(yourIns)} ({yourInsMultiple}x annual income)</p>
                            <p><strong>Recommended:</strong> 5–12x annual income</p>
                            <p className="text-xs text-gray-500">• 5x target: {formatCurrency(annualIncome * 5)}</p>
                            <p className="text-xs text-gray-500">• 10x target: {formatCurrency(annualIncome * 10)}</p>
                            <p className="text-xs text-gray-500">• 12x target: {formatCurrency(annualIncome * 12)}</p>
                            {yourInsShortage > 0 && (
                              <p className="text-red-600"><strong>Shortage:</strong> {formatCurrency(yourInsShortage)}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Partner's Insurance Coverage */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Partner's Insurance Coverage</td>
                      <td className={`px-6 py-3 font-semibold ${partnerInsShortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getPartnerInsuranceStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('partnerInsurance')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'partnerInsurance'}
                          aria-controls="partnerInsurance-details"
                        >
                          {expandedRow === 'partnerInsurance' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'partnerInsurance' && (
                      <tr id="partnerInsurance-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Partner's coverage:</strong> {formatCurrency(partnerIns)} ({partnerInsMultiple}x annual income)</p>
                            <p><strong>Recommended:</strong> 5–12x annual income</p>
                            <p className="text-xs text-gray-500">• 5x target: {formatCurrency(partnerAnnualIncome * 5)}</p>
                            <p className="text-xs text-gray-500">• 10x target: {formatCurrency(partnerAnnualIncome * 10)}</p>
                            <p className="text-xs text-gray-500">• 12x target: {formatCurrency(partnerAnnualIncome * 12)}</p>
                            {partnerInsShortage > 0 && (
                              <p className="text-red-600"><strong>Shortage:</strong> {formatCurrency(partnerInsShortage)}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Your Healthcare Coverage */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Your Healthcare Coverage</td>
                      <td className={`px-6 py-3 font-semibold ${
                        yourHealthShortage === 0 ? 'text-green-600' : 
                        yourHealthShortage < idealHealthYou * 0.25 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {getYourHealthStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('yourHealth')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'yourHealth'}
                          aria-controls="yourHealth-details"
                        >
                          {expandedRow === 'yourHealth' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'yourHealth' && (
                      <tr id="yourHealth-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Your coverage:</strong> {formatCurrency(yourHealth)}</p>
                            <p><strong>Target:</strong> {formatCurrency(idealHealthYou)} (100% of annual income)</p>
                            {yourHealthShortage > 0 && (
                              <p className="text-red-600"><strong>Gap:</strong> {formatCurrency(yourHealthShortage)}</p>
                            )}
                            <p className="text-xs text-gray-500 italic">Note: Health coverage targets are estimates. Actual needs depend on family medical history and existing employer benefits.</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Partner's Healthcare Coverage */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Partner's Healthcare Coverage</td>
                      <td className={`px-6 py-3 font-semibold ${
                        partnerHealthShortage === 0 ? 'text-green-600' :
                        partnerHealthShortage < idealHealthPartner * 0.25 ? 'text-blue-600' :
                        partnerHealthShortage < idealHealthPartner * 0.5 ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {getPartnerHealthStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('partnerHealth')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'partnerHealth'}
                          aria-controls="partnerHealth-details"
                        >
                          {expandedRow === 'partnerHealth' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'partnerHealth' && (
                      <tr id="partnerHealth-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Partner's coverage:</strong> {formatCurrency(partnerHealth)}</p>
                            <p><strong>Target:</strong> {formatCurrency(idealHealthPartner)} (50% of annual income)</p>
                            {partnerHealthShortage > 0 && (
                              <p className="text-red-600"><strong>Gap:</strong> {formatCurrency(partnerHealthShortage)}</p>
                            )}
                            <p className="text-xs text-gray-500 italic">Note: Health coverage targets are estimates. Actual needs depend on family medical history and existing employer benefits.</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Liquidity */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Liquidity</td>
                      <td className={`px-6 py-3 font-semibold ${
                        liqPercent < 10 ? 'text-red-600' : liqPercent < 25 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getLiquidityStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('liquidity')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'liquidity'}
                          aria-controls="liquidity-details"
                        >
                          {expandedRow === 'liquidity' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'liquidity' && (
                      <tr id="liquidity-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Liquid assets:</strong> {formatPercent(liqPercent)} of total assets</p>
                            <p><strong>Cash & deposits:</strong> {formatCurrency(cashLiquidity)}</p>
                            <p><strong>Total assets:</strong> {formatCurrency(totalAssets)}</p>
                            {liqPercent < 10 && (
                              <p className="text-red-600"><strong>Warning:</strong> Very low liquidity may limit your ability to handle emergencies without selling long-term assets at a loss.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* College Education Fund */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">College Education Fund</td>
                      <td className={`px-6 py-3 font-semibold ${
                        children.length === 0 ? 'text-gray-600' :
                        collegeGaps.some(c => c.gap > 0) ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {getCollegeFundStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('college')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'college'}
                          aria-controls="college-details"
                        >
                          {expandedRow === 'college' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'college' && (
                      <tr id="college-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            {children.length === 0 ? (
                              <p>No children under 18 reported.</p>
                            ) : (
                              <>
                                {collegeGaps.map((child, idx) => (
                                  <div key={idx} className="border-b border-gray-200 pb-2 last:border-0">
                                    <p><strong>{child.name}:</strong> Age {child.age}, {child.yearsLeft} years to college</p>
                                    <p>Estimated total cost: {formatCurrency(child.totalRequired)}</p>
                                    <p className="text-xs text-gray-500">Based on ₱150,000 annual tuition with 5% inflation</p>
                                    {child.gap > 0 && (
                                      <p className="text-red-600"><strong>Funding gap:</strong> {formatCurrency(child.gap)}</p>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Retirement Fund */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Retirement Fund</td>
                      <td className={`px-6 py-3 font-semibold ${retirementGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getRetirementStatus()}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('retirement')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'retirement'}
                          aria-controls="retirement-details"
                        >
                          {expandedRow === 'retirement' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'retirement' && (
                      <tr id="retirement-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Years until retirement:</strong> {retirementYearsLeft}</p>
                            <p><strong>Required fund:</strong> {formatCurrency(requiredRetirementFund)}</p>
                            <p><strong>Projected fund:</strong> {formatCurrency(projectedRetirementFund)}</p>
                            <p className="text-xs text-gray-500">Assumptions: 3% inflation, 8% pre-retirement return, 6% post-retirement return</p>
                            {retirementGap > 0 && (
                              <>
                                <p className="text-red-600"><strong>Shortfall:</strong> {formatCurrency(retirementGap)}</p>
                                <p><strong>Required monthly savings:</strong> {formatCurrency(requiredMonthlyToCloseGap)}</p>
                                <p><strong>Current monthly savings:</strong> {formatCurrency(currentSavings)}</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Your Estate Tax Provision */}
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-3">Your Estate Tax Provision</td>
                      <td className={`px-6 py-3 font-semibold ${
                        estateTaxStatus === "TAX IS MINIMAL" ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {estateTaxStatus}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('yourEstate')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'yourEstate'}
                          aria-controls="yourEstate-details"
                        >
                          {expandedRow === 'yourEstate' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'yourEstate' && (
                      <tr id="yourEstate-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Net Estate:</strong> {formatCurrency(netWorth)}</p>
                            <p><strong>Taxable Amount:</strong> {formatCurrency(taxableEstate)} (over ₱5M exemption)</p>
                            {estateTaxStatus !== "TAX IS MINIMAL" && (
                              <p className="text-orange-600"><strong>Estimated tax:</strong> {formatCurrency(estimatedEstateTax)} (6% rate)</p>
                            )}
                            <p className="text-xs text-gray-500 italic">Note: Simplified estimate. Consult an estate planning professional for accurate calculations.</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Spouse's Estate Tax Provision */}
                    <tr>
                      <td className="px-6 py-3">Spouse's Estate Tax Provision</td>
                      <td className={`px-6 py-3 font-semibold ${
                        estateTaxStatus === "TAX IS MINIMAL" ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {estateTaxStatus}
                      </td>
                      <td className="px-6 py-3 text-center no-print">
                        <button
                          onClick={() => toggleRow('spouseEstate')}
                          className="text-[#003266] hover:text-[#002244] font-medium text-sm"
                          aria-expanded={expandedRow === 'spouseEstate'}
                          aria-controls="spouseEstate-details"
                        >
                          {expandedRow === 'spouseEstate' ? '▼' : '▶'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === 'spouseEstate' && (
                      <tr id="spouseEstate-details" className="bg-gray-50 no-print">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="text-sm space-y-2">
                            <p><strong>Net Estate:</strong> {formatCurrency(netWorth)}</p>
                            <p><strong>Taxable Amount:</strong> {formatCurrency(taxableEstate)} (over ₱5M exemption)</p>
                            {estateTaxStatus !== "TAX IS MINIMAL" && (
                              <p className="text-orange-600"><strong>Estimated tax:</strong> {formatCurrency(estimatedEstateTax)} (6% rate)</p>
                            )}
                            <p className="text-xs text-gray-500 italic">Note: Simplified estimate. Consult an estate planning professional for accurate calculations.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Disclaimer */}
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-gray-700 print:bg-gray-100">
                <p className="font-semibold mb-1">Important:</p>
                <p>These results are based on general assumptions which may not necessarily apply to you. It is strongly recommended that you consult a competent financial planner before you carry out any plan to improve your financial health to avoid costly mistakes.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center pt-8 border-t border-gray-200 no-print">
              <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                <button
                  onClick={() => {
                    setStep(1);
                    setExpandedRow(null);
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