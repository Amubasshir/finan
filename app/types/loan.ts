export interface LoanFeature {
  name: string
  description: string
  tooltip: string
}

export interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  loanType: string
  features: {
    [key: string]: boolean
  }
  estimatedSavings: number
  loanTerm: number
  maxLTV: number
  fees: {
    establishmentFee: number
    ongoingFees: number
  }
  apr: number
}
