import { useState, useEffect } from 'react';
import type { XtreamChannel, XtreamCategory } from '../types/xtream';
import './ChannelList.css';

interface ChannelListProps {
  channels: XtreamChannel[];
  categories: XtreamCategory[];
  onChannelSelect: (channel: XtreamChannel) => void;
  selectedChannel: XtreamChannel | null;
  onCategoryChange: (categoryId: string | null) => void;
  onLogout: () => void;
}

export default function ChannelList({
  channels,
  categories,
  onChannelSelect,
  selectedChannel,
  onCategoryChange,
  onLogout,
}: ChannelListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h2>Channels</h2>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="channel-list-controls">
        <input
          type="text"
          placeholder="Search channels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategoryId || ''}
          onChange={(e) => handleCategoryChange(e.target.value || null)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className="channel-list-items">
        {filteredChannels.length === 0 ? (
          <div className="no-channels">No channels found</div>
        ) : (
          filteredChannels.map((channel) => (
            <div
              key={channel.stream_id}
              className={`channel-item ${
                selectedChannel?.stream_id === channel.stream_id ? 'active' : ''
              }`}
              onClick={() => onChannelSelect(channel)}
            >
              {channel.stream_icon && (
                <img
                  src={channel.stream_icon}
                  alt={channel.name}
                  className="channel-icon"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="channel-info">
                <div className="channel-name">{channel.name}</div>
                {channel.num > 0 && (
                  <div className="channel-number">Ch {channel.num}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
