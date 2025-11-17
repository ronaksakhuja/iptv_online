import { useState, useEffect } from 'react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import VideoPlayer from './components/VideoPlayer';
import { XtreamApi } from './services/xtreamApi';
import { storage } from './services/storage';
import type {
  XtreamServerConfig,
  XtreamChannel,
  XtreamCategory,
  XtreamAuthResponse,
} from './types/xtream';
import './App.css';

export default function App() {
  const [api, setApi] = useState<XtreamApi | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authInfo, setAuthInfo] = useState<XtreamAuthResponse | null>(null);
  const [channels, setChannels] = useState<XtreamChannel[]>([]);
  const [categories, setCategories] = useState<XtreamCategory[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<XtreamChannel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved config on mount
  const savedConfig = storage.loadConfig();

  const handleLogin = async (config: XtreamServerConfig) => {
    setLoading(true);
    setError(null);

    try {
      const newApi = new XtreamApi(config);

      // Authenticate
      const authResponse = await newApi.authenticate();
      setAuthInfo(authResponse);

      // Save config
      storage.saveConfig(config);
      setApi(newApi);
      setAuthenticated(true);

      // Load categories and channels
      const [categoriesData, channelsData] = await Promise.all([
        newApi.getLiveCategories(),
        newApi.getLiveStreams(),
      ]);

      setCategories(categoriesData);
      setChannels(channelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setApi(null);
    setAuthenticated(false);
    setAuthInfo(null);
    setChannels([]);
    setCategories([]);
    setSelectedChannel(null);
    storage.clearConfig();
  };

  const handleCategoryChange = async (categoryId: string | null) => {
    if (!api) return;

    setLoading(true);
    setError(null);

    try {
      const channelsData = await api.getLiveStreams(categoryId || undefined);
      setChannels(channelsData);
      setSelectedChannel(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelSelect = (channel: XtreamChannel) => {
    setSelectedChannel(channel);
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} savedConfig={savedConfig} />;
  }

  return (
    <div className="app">
      <ChannelList
        channels={channels}
        categories={categories}
        onChannelSelect={handleChannelSelect}
        selectedChannel={selectedChannel}
        onCategoryChange={handleCategoryChange}
        onLogout={handleLogout}
      />
      <div className="main-content">
        {loading && <div className="loading-overlay">Loading...</div>}
        {error && <div className="error-overlay">{error}</div>}
        {selectedChannel && api ? (
          <VideoPlayer
            streamUrl={api.getStreamUrl(selectedChannel.stream_id)}
            channelName={selectedChannel.name}
          />
        ) : (
          <div className="no-selection">
            <h2>Welcome to IPTV Client</h2>
            <p>Select a channel from the list to start watching</p>
            {authInfo && (
              <div className="user-info">
                <p><strong>Status:</strong> {authInfo.user_info.status}</p>
                <p><strong>Message:</strong> {authInfo.user_info.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
