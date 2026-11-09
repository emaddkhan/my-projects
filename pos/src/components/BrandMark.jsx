/** Premium Grocery POS logo mark: subtle retail green with crisp white geometry */
export default function BrandMark({ className = 'size-9' }) {
  return (
    <div
      className={`grid place-items-center rounded-lg bg-emerald-800 text-white shadow-sm ring-1 ring-black/5 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3.5 10h17l-1.6 8.1a2 2 0 0 1-2 1.6H7.1a2 2 0 0 1-2-1.6L3.5 10Z" strokeLinejoin="round" />
        <path d="M8 10l2.5-5M16 10l-2.5-5" strokeLinecap="round" />
        <path d="M12 13.5v3.5M9 13.5v3.5M15 13.5v3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
