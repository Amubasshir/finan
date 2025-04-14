interface FinanLogoProps {
  className?: string
  width?: number
  height?: number
  backgroundColor?: string
  textColor?: string
}

export function FinanLogo({
  className = "h-8 w-8",
  width = 40,
  height = 40,
  backgroundColor = "#3B82F6",
  textColor = "white",
}: FinanLogoProps) {
  return (
    <div
      className={`bg-[${backgroundColor}] text-[${textColor}] font-bold rounded-md flex items-center justify-center ${className}`}
      style={{ width: width, height: height }}
    >
      F
    </div>
  )
}

export function FinanLogoWithText({ className = "h-8" }: FinanLogoProps) {
  return (
    <div className="flex items-center">
      <FinanLogo className={className} />
      <span className="ml-2 text-xl font-bold text-gray-900">finan</span>
    </div>
  )
}

export default FinanLogo
