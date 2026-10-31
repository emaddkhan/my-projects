import { useState } from 'react';
import BrandMark from '../../components/BrandMark.jsx';
import Panel from '../../components/Panel.jsx';
import StatTile from '../../components/StatTile.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { CpuIcon, DatabaseIcon, LayersIcon, ShieldIcon, TagIcon, WifiOffIcon, PackageIcon } from '../../components/icons.jsx';
import { formatBytes, formatDuration } from '../../lib/format.js';
import SystemHealthPanel from '../system/SystemHealthPanel.jsx';
import ProductsView from '../products/ProductsView.jsx';
import { useOnlineStatus, useSystemStatus } from '../system/useSystemStatus.js';

const DB_STATUS = {
  connected: { label: 'Connected', tone: 'success', hint: 'Local SQLite storage' },
  degraded: { label: 'Degraded', tone: 'warning', hint: 'Some checks failed' },
  error: { label: 'Unavailable', tone: 'danger', hint: 'See system health' },
};

function EnvironmentRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="selectable font-mono text-[13px] text-slate-200">{value ?? '—'}</dd>
    </div>
  );
}

export default function WelcomeScreen() {
  const [activeTab, setActiveTab] = useState('system');
  const { appInfo, health, error, loading, refreshing, refresh, bridgeAvailable } = useSystemStatus();
  const online = useOnlineStatus();

  const database = health?.database;
  const dbStatus = loading
    ? { label: 'Checking…', tone: 'neutral', hint: 'Contacting database' }
    : DB_STATUS[database?.status] ?? DB_STATUS.error;
  const version = appInfo?.version ?? '—';

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 size-[32rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-8">
        <header className="flex items-center justify-between py-6 animate-fade-up">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-white">Grocery POS</p>
              <p className="text-xs text-slate-400">Point of Sale · Windows</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'system'
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DatabaseIcon className="size-3.5" />
              System Health
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PackageIcon className="size-3.5" />
              Products & Catalog
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <StatusBadge id="header-version" tone="neutral">
              v{version}
            </StatusBadge>
            <StatusBadge id="header-mode" tone="success" pulse>
              Offline Ready
            </StatusBadge>
          </div>
        </header>

        <main className="flex-1 pb-10 pt-4">
          {activeTab === 'products' ? (
            <ProductsView />
          ) : (
            <div>
          <section className="max-w-2xl animate-fade-up [animation-delay:60ms]">
            <p className="text-sm font-medium text-brand-400">Welcome</p>
            <h1 id="app-title" className="mt-2 font-display text-4xl font-semibold tracking-tight text-white">
              Grocery POS
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              Your store runs on this computer. Sales data stays on this PC and every core feature works without an
              internet connection.
            </p>
          </section>

          <section aria-label="Status overview" className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatTile
              id="tile-database"
              label="Database"
              icon={<DatabaseIcon className="size-5" />}
              accent={dbStatus.tone === 'success' ? 'from-emerald-400/25' : 'from-rose-400/25'}
              delay={100}
              value={
                <span id="db-status" data-status={database?.status ?? 'loading'}>
                  {dbStatus.label}
                </span>
              }
              hint={dbStatus.hint}
            />
            <StatTile
              id="tile-mode"
              label="Application mode"
              icon={<WifiOffIcon className="size-5" />}
              accent="from-brand-400/25"
              delay={140}
              value={<span id="app-mode">Offline Ready</span>}
              hint={online ? 'Network detected, not required' : 'No network, fully operational'}
            />
            <StatTile
              id="tile-version"
              label="Version"
              icon={<TagIcon className="size-5" />}
              accent="from-sky-400/25"
              delay={180}
              value={<span id="app-version">{version}</span>}
              hint={appInfo ? (appInfo.isPackaged ? 'Production build' : 'Development build') : '—'}
            />
            <StatTile
              id="tile-schema"
              label="Data schema"
              icon={<LayersIcon className="size-5" />}
              accent="from-violet-400/25"
              delay={220}
              value={database?.schemaVersion != null ? `v${database.schemaVersion}` : '—'}
              hint={
                database?.schemaVersion != null && database.schemaVersion === database.latestSchemaVersion
                  ? 'Up to date'
                  : 'Pending'
              }
            />
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
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

            <div className="flex flex-col gap-6">
              <Panel title="Environment" className="animate-fade-up [animation-delay:280ms]">
                <dl className="divide-y divide-white/[0.05] px-6 py-2">
                  <EnvironmentRow label="Electron" value={appInfo?.versions.electron} />
                  <EnvironmentRow label="Chromium" value={appInfo?.versions.chrome} />
                  <EnvironmentRow label="Node.js" value={appInfo?.versions.node} />
                  <EnvironmentRow label="Platform" value={appInfo ? `${appInfo.platform} ${appInfo.arch}` : null} />
                  <EnvironmentRow
                    label="Uptime"
                    value={health ? formatDuration(health.process.uptimeSeconds) : null}
                  />
                  <EnvironmentRow
                    label="Memory (main)"
                    value={health ? formatBytes(health.process.memoryRssBytes) : null}
                  />
                </dl>
              </Panel>

              <div className="rounded-2xl border border-brand-400/15 bg-gradient-to-br from-brand-500/10 via-ink-900/60 to-ink-900/60 p-5 animate-fade-up [animation-delay:320ms]">
                <div className="flex items-center gap-2 text-brand-300">
                  <ShieldIcon className="size-5" />
                  <p className="text-sm font-semibold">Secure by design</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  The interface runs sandboxed with no direct system or database access. All data requests go
                  through a verified desktop bridge.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

        <footer className="flex items-center justify-between border-t border-white/[0.06] py-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CpuIcon className="size-3.5" />
            Foundation build · business modules coming in upcoming milestones
          </span>
          <span>All data is stored locally on this computer</span>
        </footer>
      </div>
    </div>
  );
}
