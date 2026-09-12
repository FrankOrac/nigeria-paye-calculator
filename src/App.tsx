import { useMemo, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Calculator,
  ChevronDown,
  CircleHelp,
  Coins,
  Info,
  Landmark,
  Minus,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { calculatePAYE, taxBands, type PAYEInput, type SalaryFrequency } from './paye'

const EXAMPLE_SALARIES = [150_000, 200_000, 255_000, 300_000, 500_000, 1_000_000]

const FAQS = [
  {
    question: 'What is PAYE?',
    answer: 'PAYE means Pay As You Earn. It is the income tax typically calculated by an employer and deducted from an employee’s salary before payment.',
  },
  {
    question: 'Is PAYE calculated on my gross salary?',
    answer: 'PAYE is calculated on taxable income. Applicable deductions and reliefs, such as eligible pension contributions, can reduce the income that is taxed.',
  },
  {
    question: 'Will everyone pay the same percentage?',
    answer: 'No. PAYE is progressive, so portions of taxable income can fall into different tax bands and rates.',
  },
  {
    question: 'If I enter ₦300,000, will I pay 18% of ₦300,000?',
    answer: 'No. The calculator applies each rate only to the portion of annual taxable income within that band. Reaching the 18% band does not make your whole salary taxable at 18%.',
  },
  {
    question: 'Why is my employer’s PAYE different from this calculator?',
    answer: 'Your payroll may account for statutory deductions, approved reliefs, pay components and current rules that are specific to your situation. This tool is an estimate only.',
  },
  {
    question: 'Is this an official government tax calculator?',
    answer: 'No. This is an independent educational calculator, not an official government assessment tool.',
  },
]

function currency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Math.round(value)).replace('NGN', '₦').replace(/\s/g, '')
}

function valueFromInput(value: string) {
  const parsed = Number(value.replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function MetricCard({ label, value, tone = 'dark' }: { label: string; value: string; tone?: 'dark' | 'green' | 'light' }) {
  const tones = {
    dark: 'bg-[#102d28] text-white',
    green: 'bg-emerald-600 text-white',
    light: 'border border-emerald-950/[0.08] bg-[#f4faf6] text-slate-900',
  }
  return (
    <div className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className={`text-sm font-medium ${tone === 'light' ? 'text-slate-500' : 'text-white/65'}`}>{label}</p>
      <p className="mt-3 text-2xl font-bold tracking-[-0.04em] sm:text-[1.75rem]">{value}</p>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-slate-900"
        aria-expanded={open}
      >
        {question}
        <ChevronDown className={`h-5 w-5 shrink-0 text-emerald-700 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="-mt-1 pb-5 pr-8 text-sm leading-6 text-slate-600">{answer}</p>}
    </div>
  )
}

export default function App() {
  const [salary, setSalary] = useState('')
  const [frequency, setFrequency] = useState<SalaryFrequency>('monthly')
  const [showDetails, setShowDetails] = useState(false)
  const [pensionType, setPensionType] = useState<'percent' | 'amount'>('percent')
  const [pensionValue, setPensionValue] = useState('')
  const [otherReliefs, setOtherReliefs] = useState('')
  const [showSalaryError, setShowSalaryError] = useState(false)
  const calculatorRef = useRef<HTMLElement>(null)

  const salaryNumber = valueFromInput(salary)
  const salaryIsInvalid = salary !== '' && salaryNumber <= 0
  const hasValidSalary = salary !== '' && salaryNumber > 0

  const input: PAYEInput = {
    salary: salaryNumber,
    frequency,
    pensionType,
    pensionValue: valueFromInput(pensionValue),
    otherReliefs: valueFromInput(otherReliefs),
  }
  const result = useMemo(() => hasValidSalary ? calculatePAYE(input) : null, [
    hasValidSalary, salaryNumber, frequency, pensionType, pensionValue, otherReliefs,
  ])

  const salaryLabel = frequency === 'monthly' ? 'Gross Monthly Salary' : 'Gross Annual Salary'
  const inputUnit = frequency === 'monthly' ? 'per month' : 'per year'

  function useExample(amount: number) {
    setSalary(String(amount))
    setFrequency('monthly')
    setShowSalaryError(false)
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function calculate() {
    if (!hasValidSalary) {
      setShowSalaryError(true)
      return
    }
    setShowSalaryError(false)
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function reset() {
    setSalary('')
    setFrequency('monthly')
    setPensionType('percent')
    setPensionValue('')
    setOtherReliefs('')
    setShowDetails(false)
    setShowSalaryError(false)
  }

  function goToCalculator() {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => document.getElementById('salary')?.focus(), 500)
  }

  return (
    <div className="overflow-x-hidden">
      <header className="border-b border-emerald-950/[0.06] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-bold tracking-[-0.03em] text-slate-900">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white"><Landmark className="h-5 w-5" /></span>
            <span>Nigeria PAYE <span className="hidden text-emerald-700 sm:inline">Calculator</span></span>
          </a>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">2026 estimate</span>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <div className="absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute right-0 top-20 -z-10 h-52 w-52 rounded-full bg-lime-100/70 blur-3xl" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-[#102d28] sm:text-6xl">
              Calculate Your Nigerian PAYE
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Enter your salary and payroll details to estimate your PAYE, monthly deduction and take-home pay under the progressive tax system.
            </p>
            <button type="button" onClick={goToCalculator} className="mt-8 inline-flex h-13 items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:bg-emerald-800">
              <Calculator className="h-4.5 w-4.5" /> Calculate My PAYE
            </button>
            <p className="mt-3 text-sm font-medium text-emerald-800">2026 PAYE Calculator</p>
          </div>
        </section>

        <section ref={calculatorRef} className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-label="PAYE calculator">
          <div className="surface overflow-hidden">
            <div className="border-b border-slate-100 bg-gradient-to-r from-[#f1faf4] to-white px-5 py-6 sm:px-8">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white"><WalletCards className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.035em] text-[#102d28]">Enter Your Salary Details</h2>
                  <p className="mt-1 text-sm text-slate-600">Start with your gross salary. Add details only when they apply to you.</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="grid gap-5 md:grid-cols-[1.6fr_0.9fr]">
                <div>
                  <label htmlFor="salary" className="mb-2 block text-sm font-bold text-slate-800">{salaryLabel} <span className="text-emerald-700">*</span></label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
                    <input
                      id="salary"
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={salary}
                      onChange={(event) => { setSalary(event.target.value); setShowSalaryError(false) }}
                      placeholder="e.g. 300000"
                      className={`input-control pl-9 ${salaryIsInvalid || (showSalaryError && !hasValidSalary) ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
                      aria-describedby="salary-help salary-error"
                    />
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-xs">
                    <span id="salary-help" className="text-slate-500">Enter your gross pay {inputUnit}.</span>
                    {(salaryIsInvalid || (showSalaryError && !hasValidSalary)) && <span id="salary-error" className="font-medium text-rose-600">Enter a salary greater than zero.</span>}
                  </div>
                </div>
                <div>
                  <label htmlFor="frequency" className="mb-2 block text-sm font-bold text-slate-800">Salary frequency</label>
                  <select id="frequency" value={frequency} onChange={(event) => setFrequency(event.target.value as SalaryFrequency)} className="input-control cursor-pointer">
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                  <p className="mt-2 text-xs text-slate-500">We automatically annualise monthly income.</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-900/10 bg-[#f8fcf9]">
                <button type="button" onClick={() => setShowDetails(!showDetails)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                  <span>
                    <span className="block text-sm font-bold text-[#173d34]">Add more details for a more accurate estimate</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Optional pension and applicable tax relief information.</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-emerald-700 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </button>
                {showDetails && (
                  <div className="grid gap-5 border-t border-emerald-900/10 p-4 pt-5 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="pension" className="text-sm font-bold text-slate-800">Pension contribution</label><span className="text-xs text-slate-500">Optional</span></div>
                      <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                        <button type="button" onClick={() => setPensionType('percent')} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition ${pensionType === 'percent' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-slate-800'}`}>Percentage</button>
                        <button type="button" onClick={() => setPensionType('amount')} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition ${pensionType === 'amount' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-slate-800'}`}>Annual amount</button>
                      </div>
                      <div className="relative mt-2">
                        {pensionType === 'amount' && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>}
                        <input id="pension" type="number" min="0" inputMode="decimal" value={pensionValue} onChange={(event) => setPensionValue(event.target.value)} placeholder={pensionType === 'percent' ? 'e.g. 8' : 'e.g. 288000'} className={`input-control ${pensionType === 'amount' ? 'pl-9' : ''}`} />
                        {pensionType === 'percent' && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span>}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Enter your employee contribution if it applies. Leave blank if unsure.</p>
                    </div>
                    <div>
                      <label htmlFor="reliefs" className="mb-2 block text-sm font-bold text-slate-800">Other applicable deductions / reliefs <span className="font-normal text-slate-500">(annual)</span></label>
                      <div className="relative"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span><input id="reliefs" type="number" min="0" inputMode="decimal" value={otherReliefs} onChange={(event) => setOtherReliefs(event.target.value)} placeholder="e.g. 50000" className="input-control pl-9" /></div>
                      <p className="mt-2 text-xs text-slate-500">Tax reliefs reduce taxable income; they are not treated as a payroll cash deduction in take-home pay.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={calculate} className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20">
                  <Calculator className="h-5 w-5" /> Calculate PAYE
                </button>
                <button type="button" onClick={reset} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"><RefreshCcw className="h-4 w-4" /> Reset Calculator</button>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> This calculator provides an estimate for educational and payroll-planning purposes. Your employer’s final PAYE calculation may differ based on applicable deductions, reliefs and individual circumstances.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-labelledby="examples-title">
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-emerald-950/[0.07] bg-white px-5 py-6 shadow-sm sm:flex-row sm:items-center sm:px-8">
            <div><h2 id="examples-title" className="text-lg font-bold tracking-[-0.03em] text-[#102d28]">Try an Example</h2><p className="mt-1 text-sm text-slate-500">Explore the calculator with a sample monthly salary.</p></div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_SALARIES.map((amount) => <button type="button" key={amount} onClick={() => useExample(amount)} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-700 hover:text-white">{currency(amount)}</button>)}
            </div>
          </div>
        </section>

        {result && (
          <section id="results" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-16 sm:px-8" aria-live="polite">
            <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Your estimate</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#102d28] sm:text-4xl">Your Estimated PAYE</h2></div><BadgeCheck className="h-9 w-9 text-emerald-600" /></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Annual Gross Income" value={currency(result.annualGrossIncome)} tone="light" />
              <MetricCard label="Estimated Annual PAYE" value={currency(result.annualPAYE)} tone="dark" />
              <MetricCard label="Estimated Monthly PAYE" value={currency(result.monthlyPAYE)} tone="green" />
              <MetricCard label="Estimated Monthly Take-Home" value={currency(result.estimatedMonthlyTakeHome)} tone="light" />
            </div>
            <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950"><span className="font-bold">Your monthly view:</span> Based on the information you entered, your estimated monthly PAYE is {currency(result.monthlyPAYE)}, leaving approximately {currency(result.estimatedMonthlyTakeHome)} after PAYE{result.annualPensionContribution > 0 ? ' and your stated pension contribution' : ''}.</p>
          </section>
        )}

        {result && (
          <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 lg:grid-cols-[0.9fr_1.4fr] sm:px-8">
            <div className="surface h-fit p-6">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Coins className="h-5 w-5" /></span><div><h2 className="font-bold tracking-[-0.03em] text-[#102d28]">How your deduction compares</h2><p className="mt-0.5 text-xs text-slate-500">A like-for-like monthly comparison</p></div></div>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4"><span className="text-slate-600">Previous 7.5% comparison</span><strong>{currency(result.previousMonthlyPAYE)}/month</strong></div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-50 px-3 py-3"><span className="font-bold text-emerald-900">Estimated progressive PAYE</span><strong className="text-emerald-800">{currency(result.monthlyPAYE)}/month</strong></div>
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4"><span className="font-semibold text-slate-700">Difference</span><strong className={`inline-flex items-center gap-1 ${result.monthlyDifference > 0 ? 'text-rose-600' : result.monthlyDifference < 0 ? 'text-emerald-700' : 'text-slate-600'}`}>{result.monthlyDifference > 0 ? <ArrowUpRight className="h-4 w-4" /> : result.monthlyDifference < 0 ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}{result.monthlyDifference > 0 ? '+' : ''}{currency(result.monthlyDifference)}/month</strong></div>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">The previous 7.5% comparison is shown only as a comparison against a previous payroll method. It is not a statement of what was legally correct for every employee.</p>
            </div>

            <div className="surface overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-6"><h2 className="text-xl font-bold tracking-[-0.035em] text-[#102d28]">How Your PAYE Was Calculated</h2><p className="mt-1 text-sm text-slate-500">Your annual taxable income is {currency(result.annualTaxableIncome)}. Each band is taxed separately.</p></div>
              <div className="divide-y divide-slate-100">
                {result.taxBandBreakdown.map((band) => (
                  <div key={band.label} className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${band.applies ? 'bg-emerald-50/70' : 'bg-white opacity-60'}`}>
                    <div className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold ${band.applies ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{Math.round(band.rate * 100)}%</span><div><p className="text-sm font-bold text-slate-800">{band.label}</p><p className="mt-0.5 text-xs text-slate-500">{band.applies ? `${currency(band.taxableAmount)} × ${Math.round(band.rate * 100)}%` : 'Not reached'}</p></div></div>
                    <p className="text-sm font-bold text-slate-800">{currency(band.tax)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-[#102d28] px-6 py-5 text-white"><span className="font-semibold">Total annual PAYE</span><strong className="text-xl tracking-[-0.03em]">{currency(result.annualPAYE)}</strong></div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="rounded-3xl border border-amber-200 bg-[#fffbeb] p-5 sm:p-7">
            <div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800"><Info className="h-5 w-5" /></span><div><h2 className="text-lg font-bold tracking-[-0.03em] text-[#473812]">Progressive tax does NOT mean your whole salary is taxed at one percentage.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-amber-950/75">Different portions of taxable income are taxed at different rates. For example, someone whose income enters the 18% band does not automatically pay 18% of their entire salary as PAYE.</p></div></div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-labelledby="bands-title">
          <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Reference</p><h2 id="bands-title" className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#102d28]">2026 Progressive PAYE Tax Bands</h2></div>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white sm:block"><table className="w-full text-left text-sm"><thead className="bg-[#f4faf6] text-xs uppercase tracking-[0.1em] text-slate-500"><tr><th className="px-6 py-4 font-bold">Taxable Income Band</th><th className="px-6 py-4 text-right font-bold">Rate</th></tr></thead><tbody className="divide-y divide-slate-100">{taxBands.map((band) => <tr key={band.label}><td className="px-6 py-4 font-semibold text-slate-800">{band.label}</td><td className="px-6 py-4 text-right font-bold text-emerald-700">{Math.round(band.rate * 100)}%</td></tr>)}</tbody></table></div>
          <div className="grid gap-3 sm:hidden">{taxBands.map((band) => <div key={band.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4"><span className="text-sm font-semibold text-slate-800">{band.label}</span><span className="text-sm font-bold text-emerald-700">{Math.round(band.rate * 100)}%</span></div>)}</div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8" aria-labelledby="faq-title">
          <div className="mb-5 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><CircleHelp className="h-5 w-5" /></div><h2 id="faq-title" className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[#102d28]">Frequently asked questions</h2></div>
          <div className="surface px-5 sm:px-7">{FAQS.map((faq) => <FAQItem key={faq.question} {...faq} />)}</div>
        </section>
      </main>

      <footer className="bg-[#102d28] text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 sm:flex-row"><div><div className="flex items-center gap-2 font-bold"><Landmark className="h-5 w-5 text-emerald-400" /> Nigeria PAYE Calculator</div><p className="mt-2 text-sm text-white/60">Understand your salary. Understand your tax.</p></div><p className="max-w-md text-sm leading-6 text-white/55">This calculator is provided for educational and estimation purposes only and does not constitute tax, legal or financial advice. Actual PAYE may vary based on applicable legislation, deductions, reliefs and individual payroll circumstances.</p></div><div className="flex flex-col gap-2 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Nigeria PAYE Calculator</p><p>Built by <a href="https://oracdev-tech.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-emerald-300 transition hover:text-emerald-200">Oracdev Tech</a> for educational purposes.</p></div></div>
      </footer>
    </div>
  )
}
