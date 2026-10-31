/**
 * Glass-style surface used for grouped content.
 * @param {{ title?: string, description?: string, actions?: React.ReactNode, className?: string, children: React.ReactNode }} props
 */
export default function Panel({ title, description, actions, className = '', children, ...rest }) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.07] bg-ink-900/70 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold text-white">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
