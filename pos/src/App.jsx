import { useState, useEffect } from 'react';
import BrandMark from './components/BrandMark.jsx';
import StatusBadge from './components/StatusBadge.jsx';
import { 
  ShoppingCartIcon, PackageIcon, ReceiptIcon, ShieldIcon, DatabaseIcon, ClipboardListIcon, TruckIcon 
} from './components/icons.jsx';
import PosView from './features/pos/PosView.jsx';
import ProductsView from './features/products/ProductsView.jsx';
import InventoryView from './features/inventory/InventoryView.jsx';
import PurchasesView from './features/purchases/PurchasesView.jsx';
import SalesHistoryView from './features/sales/SalesHistoryView.jsx';
import WelcomeScreen from './features/welcome/WelcomeScreen.jsx';
import { useSystemStatus } from './features/system/useSystemStatus.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const { appInfo, health, loading } = useSystemStatus();

  const database = health?.database;
  const version = appInfo?.version ?? '0.1.0';

  // Global Function Key Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('pos');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('products');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setActiveTab('inventory');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('purchases');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActiveTab('sales');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setActiveTab('system');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const dbConnected = database?.status === 'connected';

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F7F8FA] text-[#17191C] overflow-hidden">
      {/* Premium Desktop Navigation Header */}
      <header className="h-14 shrink-0 bg-white border-b border-[#E8EAED] px-4 flex items-center justify-between z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <BrandMark className="size-8" />
          <div>
            <h1 id="app-title" className="text-sm font-bold tracking-tight text-[#17191C] leading-none">
              Grocery POS
            </h1>
            <p className="text-[10px] text-[#737780] font-medium leading-tight mt-0.5">
              Desktop Counter · Retail OS
            </p>
          </div>
        </div>

        {/* Central Primary Navigation Pills */}
        <nav className="flex items-center gap-1 rounded-lg border border-[#E8EAED] bg-[#F7F8FA] p-0.5">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'pos'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <ShoppingCartIcon className="size-3.5" />
            POS Checkout <span className="text-[10px] opacity-60 font-mono">(F1)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <PackageIcon className="size-3.5" />
            Products & Catalog <span className="text-[10px] opacity-60 font-mono">(F2)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <ClipboardListIcon className="size-3.5" />
            Inventory & Stock <span className="text-[10px] opacity-60 font-mono">(F3)</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'purchases'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <TruckIcon className="size-3.5" />
            Purchases & Suppliers <span className="text-[10px] opacity-60 font-mono">(F4)</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <ReceiptIcon className="size-3.5" />
            Sales Ledger <span className="text-[10px] opacity-60 font-mono">(F5)</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-[#737780] hover:text-[#17191C]'
            }`}
          >
            <ShieldIcon className="size-3.5" />
            System Health <span className="text-[10px] opacity-60 font-mono">(F6)</span>
          </button>
        </nav>

        {/* Live Diagnostics & Status Group */}
        <div className="flex items-center gap-2">
          {/* Database Live Status Badge */}
          <span
            id="db-status"
            data-status={database?.status ?? (loading ? 'loading' : 'error')}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
              dbConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <DatabaseIcon className="size-3" />
            {loading ? 'Checking…' : dbConnected ? 'SQLite Ready' : 'Database Offline'}
          </span>

          {/* Mode Badge */}
          <StatusBadge tone="success" pulse>
            <span id="app-mode">Offline Ready</span>
          </StatusBadge>

          {/* Version Badge */}
          <StatusBadge tone="neutral">
            <span id="app-version">v{version}</span>
          </StatusBadge>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'pos' && <PosView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'purchases' && <PurchasesView />}
        {activeTab === 'sales' && <SalesHistoryView />}
        {activeTab === 'system' && <WelcomeScreen />}
      </main>
    </div>
  );
}
