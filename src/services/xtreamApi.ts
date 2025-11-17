import type {
  XtreamServerConfig,
  XtreamAuthResponse,
  XtreamCategory,
  XtreamChannel,
} from '../types/xtream';

export class XtreamApi {
  private config: XtreamServerConfig;

  constructor(config: XtreamServerConfig) {
    this.config = config;
  }

  private buildUrl(action?: string, params?: Record<string, string>): string {
    const url = new URL(`${this.config.baseUrl}/player_api.php`);
    url.searchParams.set('username', this.config.username);
    url.searchParams.set('password', this.config.password);

    if (action) {
      url.searchParams.set('action', action);
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  async authenticate(): Promise<XtreamAuthResponse> {
    const url = this.buildUrl();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.user_info?.auth !== 1) {
      throw new Error(data.user_info?.message || 'Authentication failed');
    }

    return data;
  }

  async getLiveCategories(): Promise<XtreamCategory[]> {
    const url = this.buildUrl('get_live_categories');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  async getLiveStreams(categoryId?: string): Promise<XtreamChannel[]> {
    const params = categoryId ? { category_id: categoryId } : undefined;
    const url = this.buildUrl('get_live_streams', params);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.statusText}`);
    }

    return response.json();
  }

  getStreamUrl(streamId: number, extension: string = 'ts'): string {
    return `${this.config.baseUrl}/live/${this.config.username}/${this.config.password}/${streamId}.${extension}`;
  }

  updateConfig(config: XtreamServerConfig): void {
    this.config = config;
  }
}
