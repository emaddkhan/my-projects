import Panel from '../../components/Panel.jsx';
import StatTile from '../../components/StatTile.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { DatabaseIcon, LayersIcon, ShieldIcon, TagIcon, WifiOffIcon, CpuIcon } from '../../components/icons.jsx';
import SystemHealthPanel from '../system/SystemHealthPanel.jsx';
import { useOnlineStatus, useSystemStatus } from '../system/useSystemStatus.js';

const DB_STATUS = {
  connected: { label: 'Connected', tone: 'success', hint: 'Local SQLite engine' },
  degraded: { label: 'Degraded', tone: 'warning', hint: 'Some checks degraded' },
  error: { label: 'Unavailable', tone: 'danger', hint: 'Requires Electron bridge' },
};

function EnvironmentRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-xs">
      <dt className="text-[#737780]">{label}</dt>
      <dd className="selectable font-mono text-[#17191C]">{value ?? '—'}</dd>
    </div>
  );
}

export default function WelcomeScreen() {
  const { appInfo, health, error, loading, refreshing, refresh, bridgeAvailable } = useSystemStatus();
  const online = useOnlineStatus();

  const database = health?.database;
  const dbStatus = loading
    ? { label: 'Checking…', tone: 'neutral', hint: 'Probing SQLite' }
    : DB_STATUS[database?.status] ?? DB_STATUS.error;
  const version = appInfo?.version ?? '0.1.0';

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Offline-First Retail Architecture
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#17191C]">
            System Diagnostics & Engine Overview
          </h2>
          <p className="mt-1 text-xs text-[#737780] max-w-xl leading-relaxed">
            All grocery store operational data, catalog records, inventory stock, and sales invoices reside 100% locally
            on this machine in SQLite with WAL durability. No external internet or cloud account is required.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge tone="neutral">
            v{version}
          </StatusBadge>
          <StatusBadge tone="success" pulse>
            Offline Ready
          </StatusBadge>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          id="tile-database"
          label="Database Status"
          icon={<DatabaseIcon className="size-4" />}
          value={
            <span id="db-status-badge" data-status={database?.status ?? 'loading'}>
              {dbStatus.label}
            </span>
          }
          hint={dbStatus.hint}
        />

        <StatTile
          id="tile-mode"
          label="Application Mode"
          icon={<WifiOffIcon className="size-4" />}
          value="Offline Ready"
          hint={online ? 'Network detected (Not required)' : 'No network (Fully operational)'}
        />

        <StatTile
          id="tile-version"
          label="App Version"
          icon={<TagIcon className="size-4" />}
          value={`v${version}`}
          hint={appInfo?.isPackaged ? 'Packaged build' : 'Development mode'}
        />

        <StatTile
          id="tile-schema"
          label="Database Schema"
          icon={<LayersIcon className="size-4" />}
          value={database?.schemaVersion != null ? `v${database.schemaVersion}` : '—'}
          hint={
            database?.schemaVersion != null && database.schemaVersion === database.latestSchemaVersion
              ? 'Up to date'
              : 'Migrations pending'
          }
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SystemHealthPanel
            health={health}
            appInfo={appInfo}
            bridgeAvailable={bridgeAvailable}
            refreshing={refreshing}
            onRefresh={refresh}
            error={error}
          />
        </div>

        <div className="space-y-4">
          <Panel title="System Environment">
            <dl className="divide-y divide-[#F0F2F5] px-4 py-2">
              <EnvironmentRow label="Electron Runtime" value={appInfo?.versions.electron} />
              <EnvironmentRow label="Chromium Engine" value={appInfo?.versions.chrome} />
              <EnvironmentRow label="Node.js Engine" value={appInfo?.versions.node} />
              <EnvironmentRow label="Platform Architecture" value={appInfo ? `${appInfo.platform} (${appInfo.arch})` : null} />
            </dl>
          </Panel>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 text-emerald-900">
              <ShieldIcon className="size-4 text-emerald-700" />
              <p className="text-xs font-bold">Hardened Security Model</p>
            </div>
            <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
              Strict context isolation, no remote script execution, native WAL crash-resilient transactions,
              and verified top-level frame IPC validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
