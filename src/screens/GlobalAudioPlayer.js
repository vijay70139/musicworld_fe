import React, { useContext, useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { RoomContext } from '../context/RoomContext';

const GlobalAudioPlayer = () => {
  const { nowPlaying, externalEvent, playSong, pauseSong, seekSong } =
    useContext(RoomContext);

  const playerRef = useRef(null);

  const [paused, setPaused] = useState(true);
  const [position, setPosition] = useState(0);

  /* ---------------------------------------------------
     RESET WHEN SONG CHANGES
  --------------------------------------------------- */
  useEffect(() => {
    if (!nowPlaying?.url) return;

    setPaused(false);
    setPosition(0);

    // seek to start when song changes
    setTimeout(() => {
      playerRef.current?.seek(0);
    }, 200);
  }, [nowPlaying?.url]);

  /* ---------------------------------------------------
     APPLY SOCKET EVENTS (PLAY / PAUSE / SEEK)
  --------------------------------------------------- */
  useEffect(() => {
    if (!externalEvent || !playerRef.current) return;

    const { type, at, position: seekPos } = externalEvent;

    if (type === 'play') {
      if (typeof at === 'number') {
        playerRef.current.seek(at);
      }
      setPaused(false);
    }

    if (type === 'pause') {
      if (typeof at === 'number') {
        playerRef.current.seek(at);
      }
      setPaused(true);
    }

    if (type === 'seek') {
      if (typeof seekPos === 'number') {
        playerRef.current.seek(seekPos);
      }
    }
  }, [externalEvent]);

  /* ---------------------------------------------------
     TRACK PROGRESS (optional sync)
  --------------------------------------------------- */
  const onProgress = e => {
    setPosition(e.currentTime);
  };

  if (!nowPlaying?.url) return null;

  return (
    <Video
      ref={playerRef}
      source={{ uri: nowPlaying.url }}
      paused={paused}
      audioOnly
      playInBackground
      playWhenInactive
      ignoreSilentSwitch="ignore"
      onProgress={onProgress}
      onError={e => console.log('Audio error:', e)}
      style={{ width: 0, height: 0 }}
    />
  );
};

export default GlobalAudioPlayer;
