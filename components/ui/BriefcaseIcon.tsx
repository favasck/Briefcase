export function BriefcaseIcon({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="11" rx="1.5" stroke="white" strokeWidth="1.2" />
        <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="white" strokeWidth="1.2" />
        <path d="M5 9h8M5 12h5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
