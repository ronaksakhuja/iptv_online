import { useEffect, useRef } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  streamUrl: string;
  channelName: string;
}

export default function VideoPlayer({ streamUrl, channelName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [streamUrl]);

  return (
    <div className="video-player">
      <div className="video-info">
        <h3>{channelName}</h3>
      </div>
      <video
        ref={videoRef}
        controls
        autoPlay
        className="video-element"
      >
        <source src={streamUrl} type="application/x-mpegURL" />
        <source src={streamUrl} type="video/mp2t" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
