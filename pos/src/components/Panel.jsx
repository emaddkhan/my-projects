/**
 * Premium white surface card with subtle border and elevation.
 * @param {{ title?: string, description?: string, actions?: React.ReactNode, className?: string, children: React.ReactNode }} props
 */
export default function Panel({ title, description, actions, className = '', children, ...rest }) {
  return (
    <section
      className={`rounded-xl border border-[#E8EAED] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-4 border-b border-[#E8EAED] px-5 py-3.5">
          <div>
            {title && <h2 className="text-sm font-semibold text-[#17191C]">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-[#737780]">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
