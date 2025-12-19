import React, { createContext, useEffect, useState } from 'react';
import API from '../config/api';
import axios from 'axios';
import socket from '../config/socket'; // Remove braces! Default export
import useRoomSocket from '../hooks/useRoomSocket';
import { Alert } from 'react-native';

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [externalEvent, setExternalEvent] = useState(null);

  // Enable socket listeners
  useRoomSocket(
    roomId,
    setSongs,
    setNowPlaying,
    setParticipants,
    setExternalEvent,
  );

  useEffect(() => {
    if (!roomId) return;

    const handleReconnect = () => {
      console.log('🔁 Re-syncing room:', roomId);
      socket.emit('sync_request', { roomId });
    };

    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('reconnect', handleReconnect);
    };
  }, [roomId]);

  // Fetch Playlist
  const fetchPlaylist = async id => {
    try {
      const res = await axios.get(API.PLAYLIST(id));
      console.log('res:playlist ', res);
      if (res.data.success) setSongs(res.data.playlist);
    } catch (e) {
      console.log('fetchPlaylist error:', e.message);
    }
  };

  // Fetch Now Playing
  const fetchNowPlaying = async id => {
    try {
      const res = await axios.get(API.GET_NOW_PLAYING(id));
      console.log('res:nowPlaying ', res);
      if (res.data.success) setNowPlaying(res.data.nowPlaying);
    } catch (e) {
      console.log('fetchNowPlaying error:', e.message);
    }
  };

  const PreviousSong = async () => {
    socket.emit('previous_song', { roomId });
  };

  // 🔹 Create Room
  const createRoom = async (name, user, onSuccessNavigate) => {
    try {
      const res = await axios.post(API.CREATE_ROOM, {
        name: name,
        userName: user,
      });
      const room = res.data.room;

      setRoomId(room._id);
      setRoomName(room.name);
      setUserName(user);

      Alert.alert(
        'Room Created 🎉',
        `Room "${room.name}" created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => onSuccessNavigate(), // Navigate only after alert click
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create room');
    }
  };

  // 🔹 Join Room
  const joinRoom = async (id, user) => {
    console.log('id, user: ', id, user);
    await axios.post(API.JOIN_ROOM(id), { user: user });

    setRoomId(id);
    setUserName(user);

    socket.emit('join_room', { roomId: id, user });

    // Load full state
    fetchPlaylist(id);
    fetchNowPlaying(id);

    // Get room name
    const r = await axios.get(API.GET_ROOM(id));
    setRoomName(r.data.room.name);
    // Get participants
    getAllParticipants();
  };

  // 🔹 Add Song
  const addSong = async song => {
    await axios.post(API.ADD_SONG(roomId), song);
  };

  // 🔹 Skip Song
  const skipSong = async () => {
    socket.emit('skip_song', { roomId });
  };

  // 🔹 Leave
  const leaveRoom = async () => {
    // await axios.post(API.LEAVE_ROOM(roomId), { userId });
    socket.emit('leave_room', { roomId, userId });

    setRoomId(null);
    setUserId(null);
    setRoomName(null);
    setParticipants([]);
    setSongs([]);
    setNowPlaying(null);
  };

  const getAllParticipants = async () => {
    try {
      const res = await axios.get(API.PARTICIPANTS(roomId));
      if (res.data.success) setParticipants(res.data.participants);
    } catch (e) {
      console.log('getAllParticipants error:', e.message);
    }
  };

  const removeParticipant = async participantId => {
    try {
      const res = await axios.post(API.REMOVE_PARTICIPANT(roomId), {
        userId: participantId,
      });
      console.log('removeParticipant res:', res.data);
      if (res.data.success) {
        // Update participants list
        setParticipants(res.data.participants);
      } else {
        Alert.alert('Error', 'Failed to remove participant');
      }
    } catch (e) {
      console.log('removeParticipant error:', e.message);
    }
  };

  const playSong = at => {
    if (!roomId) return;
    socket.emit('play', { roomId, at });
  };

  const pauseSong = at => {
    if (!roomId) return;
    socket.emit('pause', { roomId, at });
  };

  const seekSong = position => {
    if (!roomId) return;
    socket.emit('seek', { roomId, position });
  };

  const getAllSongs = async () => {
    try {
      const res = await axios.get(API.GET_ALL_SONGS());
      if (res.data.success) setAllSongs(res.data.songs);
    } catch (e) {
      console.log('getAllSongs error:', e.message);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        roomId,
        roomName,
        userName,
        songs,
        nowPlaying,
        participants,
        createRoom,
        joinRoom,
        leaveRoom,
        addSong,
        skipSong,
        setRoomId,
        setSongs,
        setNowPlaying,
        setParticipants,
        userId,
        setUserId,
        setUserName,
        setRoomName,
        removeParticipant,
        fetchPlaylist,
        fetchNowPlaying,
        externalEvent,
        playSong,
        pauseSong,
        seekSong,
        PreviousSong,
        setAllSongs,
        allSongs,
        getAllSongs,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
