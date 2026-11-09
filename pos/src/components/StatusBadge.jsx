const TONES = {
  success: { text: 'text-emerald-800', bg: 'bg-emerald-50', ring: 'ring-emerald-600/20', dot: 'bg-emerald-600' },
  warning: { text: 'text-amber-800', bg: 'bg-amber-50', ring: 'ring-amber-600/20', dot: 'bg-amber-600' },
  danger: { text: 'text-red-800', bg: 'bg-red-50', ring: 'ring-red-600/20', dot: 'bg-red-600' },
  info: { text: 'text-sky-800', bg: 'bg-sky-50', ring: 'ring-sky-600/20', dot: 'bg-sky-600' },
  neutral: { text: 'text-slate-700', bg: 'bg-slate-100', ring: 'ring-slate-300/60', dot: 'bg-slate-500' },
};

/**
 * Small pill with a coloured status dot.
 * @param {{ tone?: keyof typeof TONES, pulse?: boolean, children: React.ReactNode, id?: string }} props
 */
export default function StatusBadge({ tone = 'neutral', pulse = false, children, ...rest }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${t.text} ${t.bg} ${t.ring}`}
      {...rest}
    >
      <span className="relative flex size-2">
        {pulse && <span className={`absolute inline-flex size-full rounded-full ${t.dot} animate-ping-slow`} />}
        <span className={`relative inline-flex size-2 rounded-full ${t.dot}`} />
      </span>
      {children}
    </span>
  );
}
