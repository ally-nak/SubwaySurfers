import React, { useState } from 'react';

interface AudioPlayerProps {
    src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
  
  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  
  return (
    <div>
      <video src={src} controls={true} autoPlay={false} onPlay={togglePlay} onPause={togglePlay} />
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}

