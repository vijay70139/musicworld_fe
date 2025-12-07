import { useEffect } from 'react';
import socket from '../config/socket'; // remove braces!

const useRoomSocket = (roomId, setSongs, setNowPlaying, setParticipants) => {
  useEffect(() => {
    if (!roomId) return;

    console.log('Socket listeners enabled for room:', roomId);

    // ► Playlist Updates
    socket.on('playlist_updated', ({ playlist }) => {
      setSongs(playlist || []);
    });

    // ► Now Playing Updates
    socket.on('now_playing', ({ nowPlaying }) => {
      setNowPlaying(nowPlaying || null);
    });

    // ► When Someone Joins
    socket.on('user_joined', ({ participants }) => {
      setParticipants(participants || []);
    });

    // ► When Someone Leaves
    socket.on('user_left', ({ participants }) => {
      setParticipants(participants || []);
    });

    // ► Participants update (fallback)
    socket.on('participants_updated', ({ participants }) => {
      setParticipants(participants || []);
    });

    return () => {
      socket.off('playlist_updated');
      socket.off('now_playing');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('participants_updated');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
};

export default useRoomSocket;


