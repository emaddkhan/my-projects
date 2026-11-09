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
      <dt className="text-[11px] font-medium uppercase tracking-wider text-[#737780]">{label}</dt>
      <dd
        id={id}
        className={`selectable mt-0.5 truncate text-xs text-[#17191C] ${mono ? 'font-mono text-[11px]' : ''}`}
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
      title="Desktop System Diagnostics"
      description={health ? `Last checked ${formatTime(health.checkedAt)}` : 'Running diagnostics…'}
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
            className="inline-flex items-center gap-1 rounded-md border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-medium text-[#17191C] hover:bg-[#F3F4F6] disabled:opacity-50"
          >
            <RefreshIcon className={`size-3 text-[#737780] ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking' : 'Re-check'}
          </button>
        </>
      }
    >
      {!bridgeAvailable && (
        <div className="mx-5 mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">Notice: Running in Web Browser</p>
          <p className="mt-0.5 text-amber-800">
            This offline-first POS application connects to its local SQLite database through Electron.
            Please switch to the <strong>Grocery POS</strong> desktop application window running on your Windows taskbar.
          </p>
        </div>
      )}

      {error && bridgeAvailable && (
        <div className="mx-5 mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          {error}
        </div>
      )}

      <ul className="divide-y divide-[#F0F2F5] px-5 py-1">
        {checks.map((check) => (
          <li key={check.id} id={`check-${check.id}`} data-pass={check.pass} className="flex items-center gap-3 py-2.5">
            {check.pass ? (
              <CheckCircleIcon className="size-4 shrink-0 text-emerald-700" />
            ) : (
              <XCircleIcon className="size-4 shrink-0 text-red-600" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#17191C]">{check.label}</p>
              <p className="truncate text-[11px] text-[#737780]">{check.detail}</p>
            </div>
            <span className={`text-[11px] font-semibold ${check.pass ? 'text-emerald-800' : 'text-red-700'}`}>
              {check.pass ? 'Pass' : 'Fail'}
            </span>
          </li>
        ))}
      </ul>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#E8EAED] bg-[#FAFAFB] px-5 py-3.5 lg:grid-cols-3">
        <div className="col-span-2 lg:col-span-3">
          <DetailRow label="Database file" mono id="db-path">
            {database?.filePath ?? '—'}
          </DetailRow>
        </div>
        <DetailRow label="Database Size">{formatBytes(database?.sizeBytes)}</DetailRow>
        <DetailRow label="SQLite Version">{database?.sqliteVersion ?? '—'}</DetailRow>
        <DetailRow label="Response Time">
          {database?.responseMs != null ? `${database.responseMs} ms` : '—'}
        </DetailRow>
        <DetailRow label="Created At" id="db-created-at">
          {formatDateTime(database?.createdAt)}
        </DetailRow>
        <DetailRow label="Launch Count" id="db-launch-count">
          {database?.launchCount ?? '—'}
        </DetailRow>
        <DetailRow label="Last Launch">{formatDateTime(database?.lastStartedAt)}</DetailRow>
      </dl>
    </Panel>
  );
}
