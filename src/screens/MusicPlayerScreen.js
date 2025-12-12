import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import { RoomContext } from '../context/RoomContext';

const formatTime = seconds => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function MusicPlayerScreen({ navigation }) {
  const {
    roomName,
    nowPlaying,
    songs,
    skipSong,
    externalEvent,
    playSong,
    pauseSong,
    seekSong,
    PreviousSong
  } = useContext(RoomContext);

  const playerRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // If no track → go back
  useEffect(() => {
    if (!nowPlaying || !nowPlaying.url) {
      navigation.goBack();
    } else {
      setPosition(0);
      setDuration(0);
      setPaused(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying]);

  // APPLY SOCKET-SYNCED EVENTS
  useEffect(() => {
    if (!externalEvent || !playerRef.current) return;

    const { type, at, position: evtPos } = externalEvent;

    if (type === 'play') {
      playerRef.current.seek(at || 0);
      setPaused(false);
    } else if (type === 'pause') {
      playerRef.current.seek(at || 0);
      setPaused(true);
    } else if (type === 'seek') {
      playerRef.current.seek(evtPos);
    }
  }, [externalEvent]);

  const onLoad = meta => setDuration(meta.duration);

  const onProgress = prog => {
    if (!isSeeking) setPosition(prog.currentTime);
  };

  const onEnd = async () => {
    await skipSong(); // server will update nowPlaying
  };

  const handlePlayPause = () => {
    const newState = !paused;
    setPaused(newState);

    if (newState === false) {
      // play
      playSong(position);
    } else {
      // pause
      pauseSong(position);
    }
  };

  const handleSeekComplete = value => {
    setIsSeeking(false);
    setPosition(value);
    playerRef.current.seek(value);
    seekSong(value); // broadcast to all users
  };

  if (!nowPlaying) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.infoText}>No track playing</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: nowPlaying.url }}
        paused={paused}
        audioOnly
        playInBackground
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        style={styles.hiddenPlayer}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.roomSubtitle}>Now playing</Text>
      </View>

      {/* ARTWORK */}
      <View style={styles.artworkContainer}>
        <View style={styles.artworkCircle}>
          <Text style={styles.artworkEmoji}>🎧</Text>
        </View>
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {nowPlaying.title}
        </Text>
      </View>

      {/* Progress slider */}
      <View style={styles.progressContainer}>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={isSeeking ? undefined : position}
          minimumTrackTintColor="#22c55e"
          maximumTrackTintColor="#444"
          thumbTintColor="#fff"
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={handleSeekComplete}
        />

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => PreviousSong()}
        >
          <Text style={styles.smallButtonText}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={handlePlayPause}>
          <Text style={styles.mainButtonText}>{paused ? '▶️' : '⏸'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={() => skipSong()}>
          <Text style={styles.smallButtonText}>⏭</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.queueText}>Next songs: {songs.length} waiting</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020214', padding: 20 },
  hiddenPlayer: { width: 0, height: 0 },
  header: { alignItems: 'center', marginBottom: 20 },
  roomName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  roomSubtitle: { color: '#888', fontSize: 12 },
  artworkContainer: { alignItems: 'center', marginVertical: 30 },
  artworkCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#111827',
    borderWidth: 4,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkEmoji: { fontSize: 64 },
  trackInfo: { alignItems: 'center', marginBottom: 20 },
  trackTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  progressContainer: { marginBottom: 20 },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: { color: '#aaa', fontSize: 12 },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  smallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#444',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: { color: '#fff', fontSize: 24 },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: { color: '#fff', fontSize: 32 },
  queueText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 10,
  },
  infoText: { color: '#fff', marginTop: 40, textAlign: 'center' },
});
