export default function DottedLine({ 
  className = "",
  inverted = false
}: { 
  className?: string
  inverted?: boolean
}) {
  return (
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={inverted ? "M 0 50 Q 100 100, 200 50" : "M 0 50 Q 100 0, 200 50"}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8,6"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}
