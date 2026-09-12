export type SalaryFrequency = 'monthly' | 'annual'

export interface PAYEInput {
  salary: number
  frequency: SalaryFrequency
  pensionType: 'percent' | 'amount'
  pensionValue: number
  otherReliefs: number
}

export interface TaxBandBreakdown {
  label: string
  rate: number
  taxableAmount: number
  tax: number
  applies: boolean
}

export interface PAYEResult {
  annualGrossIncome: number
  annualTaxableIncome: number
  annualPAYE: number
  monthlyPAYE: number
  previousMonthlyPAYE: number
  monthlyDifference: number
  estimatedMonthlyTakeHome: number
  annualPensionContribution: number
  taxBandBreakdown: TaxBandBreakdown[]
}

const TAX_BANDS = [
  { label: 'First ₦800,000', limit: 800_000, rate: 0 },
  { label: 'Next ₦2,200,000', limit: 2_200_000, rate: 0.15 },
  { label: 'Next ₦9,000,000', limit: 9_000_000, rate: 0.18 },
  { label: 'Next ₦13,000,000', limit: 13_000_000, rate: 0.21 },
  { label: 'Next ₦25,000,000', limit: 25_000_000, rate: 0.23 },
  { label: 'Above ₦50,000,000', limit: Number.POSITIVE_INFINITY, rate: 0.25 },
] as const

/** Calculates an indicative PAYE estimate using the displayed 2026 progressive bands. */
export function calculatePAYE(input: PAYEInput): PAYEResult {
  const cleanSalary = Math.max(0, Number.isFinite(input.salary) ? input.salary : 0)
  const annualGrossIncome = input.frequency === 'monthly' ? cleanSalary * 12 : cleanSalary
  const cleanPensionValue = Math.max(0, Number.isFinite(input.pensionValue) ? input.pensionValue : 0)
  const annualPensionContribution = input.pensionType === 'percent'
    ? annualGrossIncome * Math.min(cleanPensionValue, 100) / 100
    : Math.min(cleanPensionValue, annualGrossIncome)
  const otherReliefs = Math.max(0, Number.isFinite(input.otherReliefs) ? input.otherReliefs : 0)
  const annualTaxableIncome = Math.max(0, annualGrossIncome - annualPensionContribution - otherReliefs)

  let remaining = annualTaxableIncome
  const taxBandBreakdown = TAX_BANDS.map((band) => {
    const taxableAmount = Math.min(remaining, band.limit)
    const tax = taxableAmount * band.rate
    remaining = Math.max(0, remaining - taxableAmount)
    return { ...band, taxableAmount, tax, applies: taxableAmount > 0 }
  })

  const annualPAYE = taxBandBreakdown.reduce((total, band) => total + band.tax, 0)
  const monthlyPAYE = annualPAYE / 12
  const previousMonthlyPAYE = annualGrossIncome / 12 * 0.075
  const monthlyDifference = monthlyPAYE - previousMonthlyPAYE
  const estimatedMonthlyTakeHome = annualGrossIncome / 12 - monthlyPAYE - annualPensionContribution / 12

  return {
    annualGrossIncome,
    annualTaxableIncome,
    annualPAYE,
    monthlyPAYE,
    previousMonthlyPAYE,
    monthlyDifference,
    estimatedMonthlyTakeHome,
    annualPensionContribution,
    taxBandBreakdown,
  }
}

export const taxBands = TAX_BANDS
