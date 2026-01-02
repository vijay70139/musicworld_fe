import { useEffect } from 'react';
import socket from '../config/socket';
import { Alert } from 'react-native';

const useRoomSocket = (
  roomId,
  setSongs,
  setNowPlaying,
  setParticipants,
  // setExternalEvent,
) => {
  useEffect(() => {
    if (!roomId) return;

    console.log('Socket listeners active for room:', roomId);

    // --------------------------
    // PLAYLIST UPDATE
    // --------------------------
    socket.on('playlist_updated', ({ playlist }) => {
      setSongs(playlist || []);
    });

    // --------------------------
    // NOW PLAYING UPDATE
    // --------------------------
    socket.on('now_playing', ({ nowPlaying }) => {
      setNowPlaying(nowPlaying || null);
    });

    // --------------------------
    // PARTICIPANT EVENTS
    // --------------------------
    socket.on('user_joined', ({ participants }) => {
      setParticipants(participants || []);
    });

    socket.on('user_left', ({ participants }) => {
      setParticipants(participants || []);
    });

    socket.on('participants_updated', ({ participants }) => {
      setParticipants(participants || []);
    });

    // --------------------------
    // REALTIME PLAYBACK SYNC
    // --------------------------

    // socket.on('play', ({ at }) => {
    //   setExternalEvent({ type: 'play', at });
    // });

    // socket.on('pause', ({ at }) => {
    //   setExternalEvent({ type: 'pause', at });
    // });

    // socket.on('seek', ({ position }) => {
    //   setExternalEvent({ type: 'seek', position });
    // });

    socket.on('room_state', state => {
      // console.log("state: ", state);
      setSongs(state.songs || []);
      setNowPlaying(state.nowPlaying || null);
      setParticipants(state.participants || []);
    });
    socket.on('songs_added_result', ({ addedCount, skippedCount }) => {
      Alert.alert(`🎶 Added: ${addedCount}, Skipped: ${skippedCount}`);
    });

    socket.on('error', err => {
      if (err.type === 'SONG_ALREADY_IN_ROOM') {
        Alert.alert('Already Added', err.message);
      } else {
        Alert.alert('Error', err.message);
      }
    });

    // --------------------------
    // CLEANUP
    // --------------------------
    return () => {
      socket.off('playlist_updated');
      socket.off('now_playing');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('participants_updated');

      // socket.off('play'); // ✅ FIXED
      // socket.off('pause'); // ✅ FIXED
      // socket.off('seek'); // ✅ FIXED
      socket.off('room_state');
      socket.off('error');
      socket.off('songs_added_result');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
};

export default useRoomSocket;
