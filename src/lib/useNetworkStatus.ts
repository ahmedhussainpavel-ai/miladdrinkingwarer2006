import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

const OFFLINE_CATALOG_STORAGE_KEY = 'milad_offline_cached_products_v2';
const OFFLINE_CATALOG_SYNC_TIMESTAMP_KEY = 'milad_offline_catalog_synced_at';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
  checkConnection: () => Promise<boolean>;
  lastSyncTime: string | null;
  cachedProductCount: number;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem(OFFLINE_CATALOG_SYNC_TIMESTAMP_KEY);
  });
  const [cachedProductCount, setCachedProductCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(OFFLINE_CATALOG_STORAGE_KEY);
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    try {
      // Lightweight cache-busting ping
      const response = await fetch(`/favicon.png?_ping=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const online = response.ok;
      setIsOnline(online);
      return online;
    } catch {
      // Fallback check
      const online = navigator.onLine;
      setIsOnline(online);
      return online;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      // Auto-clear wasOffline badge after 5 seconds
      setTimeout(() => {
        setWasOffline(false);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOnline(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    checkConnection,
    lastSyncTime,
    cachedProductCount
  };
}

/**
 * Cache products directly to LocalStorage and ServiceWorker Cache for fast offline viewing
 */
export function cacheProductCatalogForOffline(products: Product[]) {
  try {
    const now = new Date().toISOString();
    localStorage.setItem(OFFLINE_CATALOG_STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(OFFLINE_CATALOG_SYNC_TIMESTAMP_KEY, now);

    // Also send message to Service Worker if active
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PRODUCT_CATALOG',
        payload: products
      });
    }
  } catch (err) {
    console.warn('Failed to cache product catalog for offline:', err);
  }
}

/**
 * Retrieve cached products safely if offline or initial load
 */
export function getCachedOfflineCatalog(): Product[] | null {
  try {
    const cached = localStorage.getItem(OFFLINE_CATALOG_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return null;
}
