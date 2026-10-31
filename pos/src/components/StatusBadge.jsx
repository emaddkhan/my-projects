const TONES = {
  success: { text: 'text-emerald-300', bg: 'bg-emerald-400/10', ring: 'ring-emerald-400/25', dot: 'bg-emerald-400' },
  warning: { text: 'text-amber-300', bg: 'bg-amber-400/10', ring: 'ring-amber-400/25', dot: 'bg-amber-400' },
  danger: { text: 'text-rose-300', bg: 'bg-rose-400/10', ring: 'ring-rose-400/25', dot: 'bg-rose-400' },
  info: { text: 'text-sky-300', bg: 'bg-sky-400/10', ring: 'ring-sky-400/25', dot: 'bg-sky-400' },
  neutral: { text: 'text-slate-300', bg: 'bg-slate-400/10', ring: 'ring-slate-400/20', dot: 'bg-slate-400' },
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
