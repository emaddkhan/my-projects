import { useCallback, useEffect, useRef, useState } from 'react';
import { api, isBridgeAvailable } from '../../lib/api.js';

/**
 * Loads application info and the system health snapshot through the
 * preload bridge. Exposes `refresh()` for manual re-checks.
 */
export function useSystemStatus() {
  const [appInfo, setAppInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [info, snapshot] = await Promise.all([api.app.getInfo(), api.system.getHealth()]);
      if (!mounted.current) return;
      setAppInfo(info);
      setHealth(snapshot);
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  return {
    appInfo,
    health,
    error,
    loading,
    refreshing,
    refresh: load,
    bridgeAvailable: isBridgeAvailable(),
  };
}

/** Tracks the browser's network state (informational: the app never needs it). */
export function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}
