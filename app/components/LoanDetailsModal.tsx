import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"
import type { LoanOption, LoanFeature } from "../types/loan"

interface LoanDetailsModalProps {
  loan: LoanOption
  onClose: () => void
}

const loanFeatures: LoanFeature[] = [
  {
    name: "offsetAccount",
    description: "Offset Account",
    tooltip: "An account linked to your loan that reduces the interest you pay",
  },
  {
    name: "redrawFacility",
    description: "Redraw Facility",
    tooltip: "Allows you to withdraw extra repayments you've made",
  },
  {
    name: "extraRepayments",
    description: "Extra Repayments",
    tooltip: "Ability to make additional payments without penalties",
  },
  {
    name: "fixedRatePeriod",
    description: "Fixed Rate Period",
    tooltip: "Option to lock in your interest rate for a set period",
  },
  {
    name: "interestOnlyOption",
    description: "Interest Only Option",
    tooltip: "Pay only the interest for a set period, usually 1-5 years",
  },
  {
    name: "splitLoanOption",
    description: "Split Loan Option",
    tooltip: "Divide your loan into part fixed and part variable interest rates",
  },
]

export function LoanDetailsModal({ loan, onClose }: LoanDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{loan.bank}</DialogTitle>
          <DialogDescription className="text-gray-400">Detailed information about this loan option</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-blue-400">Interest Rate</h3>
              <p>{loan.interestRate}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Comparison Rate</h3>
              <p>{loan.comparisonRate}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Monthly Repayment</h3>
              <p>${loan.monthlyRepayment.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Total Repayment</h3>
              <p>${loan.totalRepayment.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Loan Type</h3>
              <p>{loan.loanType}</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Loan Term</h3>
              <p>{loan.loanTerm} years</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Max LTV</h3>
              <p>{loan.maxLTV}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Estimated Savings</h3>
              <p className="text-green-400">${loan.estimatedSavings.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Fees</h3>
            <p>Establishment Fee: ${loan.fees.establishmentFee}</p>
            <p>Ongoing Fees: ${loan.fees.ongoingFees}/month</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Features</h3>
            <ul className="space-y-1">
              {loanFeatures.map((feature) => (
                <li key={feature.name} className="flex items-center">
                  {loan.features[feature.name] ? (
                    <Check className="text-green-400 mr-2 h-4 w-4" />
                  ) : (
                    <X className="text-red-400 mr-2 h-4 w-4" />
                  )}
                  <span>{feature.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button asChild>
            <Link href="/refinance-process">Apply for This Loan</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
