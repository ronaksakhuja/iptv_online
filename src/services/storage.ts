import type { XtreamServerConfig } from '../types/xtream';

const STORAGE_KEY = 'iptv_server_config';

export const storage = {
  saveConfig(config: XtreamServerConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  loadConfig(): XtreamServerConfig | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
