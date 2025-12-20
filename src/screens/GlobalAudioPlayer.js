import React, { useContext, useRef, useEffect } from 'react';
import Video from 'react-native-video';
import { RoomContext } from '../context/RoomContext';

export default function GlobalAudioPlayer() {
  const { nowPlaying, paused, position, setPosition } = useContext(RoomContext);

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && position >= 0) {
      ref.current.seek(position);
    }
  }, [nowPlaying]);

  if (!nowPlaying?.url) return null;

  return (
    <Video
      ref={ref}
      source={{ uri: nowPlaying.url }}
      paused={paused}
      audioOnly
      playInBackground
      onProgress={e => setPosition(e.currentTime)}
      style={{ width: 0, height: 0 }}
    />
  );
}
