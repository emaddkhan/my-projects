/**
 * Compact metric tile.
 * @param {{ label: string, value: React.ReactNode, hint?: React.ReactNode, icon?: React.ReactNode, accent?: string, id?: string, delay?: number }} props
 */
export default function StatTile({ label, value, hint, icon, accent = 'from-brand-400/20', delay = 0, ...rest }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/70 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-ink-900/90 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
      {...rest}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${accent} to-transparent blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
        {icon && <span className="text-slate-500 transition-colors group-hover:text-slate-300">{icon}</span>}
      </div>
      <div className="relative mt-3 font-display text-2xl font-semibold tracking-tight text-white">{value}</div>
      {hint && <div className="relative mt-1.5 text-sm text-slate-400">{hint}</div>}
    </div>
  );
}
