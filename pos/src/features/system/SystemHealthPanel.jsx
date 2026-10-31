import Panel from '../../components/Panel.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { CheckCircleIcon, XCircleIcon, RefreshIcon } from '../../components/icons.jsx';
import { formatBytes, formatDateTime, formatTime } from '../../lib/format.js';

function buildChecks({ bridgeAvailable, appInfo, database }) {
  const c = database?.checks ?? {};
  const connected = database?.status === 'connected' || database?.status === 'degraded';
  return [
    {
      id: 'bridge',
      label: 'Secure desktop bridge',
      detail: bridgeAvailable && appInfo ? 'Preload IPC responding' : 'Preload bridge unavailable',
      pass: Boolean(bridgeAvailable && appInfo),
    },
    {
      id: 'connection',
      label: 'Database connection',
      detail: connected ? 'SQLite opened from local storage' : database?.error ?? 'Not connected',
      pass: connected && c.reachable === true,
    },
    {
      id: 'integrity',
      label: 'Integrity check',
      detail: database?.integrityResult ? `quick_check: ${database.integrityResult}` : '—',
      pass: c.integrity === true,
    },
    {
      id: 'wal',
      label: 'Write-ahead logging',
      detail: database?.journalMode ? `journal_mode = ${database.journalMode}, synchronous = ${database.synchronous}` : '—',
      pass: c.walMode === true,
    },
    {
      id: 'fk',
      label: 'Foreign key enforcement',
      detail: c.foreignKeys ? 'foreign_keys = ON' : 'foreign_keys = OFF',
      pass: c.foreignKeys === true,
    },
    {
      id: 'schema',
      label: 'Schema migrations',
      detail:
        database?.schemaVersion != null
          ? `Version ${database.schemaVersion} of ${database.latestSchemaVersion}`
          : '—',
      pass: c.schemaUpToDate === true,
    },
  ];
}

function DetailRow({ label, children, mono = false, id }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</dt>
      <dd
        id={id}
        className={`selectable mt-1 truncate text-sm text-slate-200 ${mono ? 'font-mono text-[13px]' : ''}`}
        title={typeof children === 'string' ? children : undefined}
      >
        {children}
      </dd>
    </div>
  );
}

export default function SystemHealthPanel({ health, appInfo, bridgeAvailable, refreshing, onRefresh, error }) {
  const database = health?.database;
  const checks = buildChecks({ bridgeAvailable, appInfo, database });
  const passed = checks.filter((check) => check.pass).length;
  const allPassed = passed === checks.length;

  return (
    <Panel
      id="system-health"
      title="System health"
      description={health ? `Last checked ${formatTime(health.checkedAt)}` : 'Running checks…'}
      className="animate-fade-up [animation-delay:240ms]"
      actions={
        <>
          <StatusBadge id="health-summary" tone={allPassed ? 'success' : passed > 0 ? 'warning' : 'danger'}>
            {passed}/{checks.length} checks passed
          </StatusBadge>
          <button
            id="refresh-health"
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshIcon className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking' : 'Re-check'}
          </button>
        </>
      }
    >
      {error && (
        <div className="mx-6 mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <ul className="divide-y divide-white/[0.05] px-6">
        {checks.map((check) => (
          <li key={check.id} id={`check-${check.id}`} data-pass={check.pass} className="flex items-center gap-3 py-3">
            {check.pass ? (
              <CheckCircleIcon className="size-5 shrink-0 text-emerald-400" />
            ) : (
              <XCircleIcon className="size-5 shrink-0 text-rose-400" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-100">{check.label}</p>
              <p className="truncate text-xs text-slate-400">{check.detail}</p>
            </div>
            <span className={`text-xs font-medium ${check.pass ? 'text-emerald-300/80' : 'text-rose-300/80'}`}>
              {check.pass ? 'Pass' : 'Fail'}
            </span>
          </li>
        ))}
      </ul>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.06] px-6 py-5 lg:grid-cols-3">
        <div className="col-span-2 lg:col-span-3">
          <DetailRow label="Database file" mono id="db-path">
            {database?.filePath ?? '—'}
          </DetailRow>
        </div>
        <DetailRow label="Size on disk">{formatBytes(database?.sizeBytes)}</DetailRow>
        <DetailRow label="SQLite engine">{database?.sqliteVersion ?? '—'}</DetailRow>
        <DetailRow label="Response time">
          {database?.responseMs != null ? `${database.responseMs} ms` : '—'}
        </DetailRow>
        <DetailRow label="Database created" id="db-created-at">
          {formatDateTime(database?.createdAt)}
        </DetailRow>
        <DetailRow label="Launches recorded" id="db-launch-count">
          {database?.launchCount ?? '—'}
        </DetailRow>
        <DetailRow label="Last started">{formatDateTime(database?.lastStartedAt)}</DetailRow>
      </dl>
    </Panel>
  );
}
