export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 41 L24 9" stroke="#2F4BFF" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M38 41 L24 9" stroke="#FF5A36" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="35" r="4.5" fill="currentColor" />
    </svg>
  )
}
