/**
 * Compact premium metric tile in light theme.
 * @param {{ label: string, value: React.ReactNode, hint?: React.ReactNode, icon?: React.ReactNode, id?: string }} props
 */
export default function StatTile({ label, value, hint, icon, ...rest }) {
  return (
    <div
      className="rounded-xl border border-[#E8EAED] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      {...rest}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#737780]">{label}</p>
        {icon && <span className="text-[#9CA3AF]">{icon}</span>}
      </div>
      <div className="mt-2 text-xl font-bold tracking-tight text-[#17191C] tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-[#737780]">{hint}</div>}
    </div>
  );
}
