import { CheckCircle, Clock } from "lucide-react"

interface TimelineStep {
  title: string
  description: string
  status: "completed" | "current" | "upcoming"
  date?: string
}

interface ApplicationTimelineProps {
  steps: TimelineStep[]
}

export function ApplicationTimeline({ steps }: ApplicationTimelineProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="flex">
          <div className="flex-shrink-0 flex flex-col items-center mr-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : step.status === "current"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle className="h-6 w-6" />
              ) : step.status === "current" ? (
                <Clock className="h-6 w-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-16 ${step.status === "completed" ? "bg-green-200" : "bg-gray-200"}`}></div>
            )}
          </div>
          <div className="pt-1 pb-8">
            <h3
              className={`text-xl font-semibold mb-2 ${
                step.status === "completed"
                  ? "text-green-700"
                  : step.status === "current"
                    ? "text-blue-700"
                    : "text-gray-500"
              }`}
            >
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
            {step.date && (
              <span
                className={`inline-block mt-2 text-sm font-medium ${
                  step.status === "completed"
                    ? "text-green-600"
                    : step.status === "current"
                      ? "text-blue-600"
                      : "text-gray-500"
                }`}
              >
                {step.status === "completed"
                  ? `Completed on ${step.date}`
                  : step.status === "current"
                    ? "In Progress"
                    : "Pending"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
