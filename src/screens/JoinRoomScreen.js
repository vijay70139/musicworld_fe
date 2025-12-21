import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import API from '../config/api';
import { RoomContext } from '../context/RoomContext';
import socket from '../config/socket';
// import useRoomSocket from '../hooks/useRoomSocket';

export default function JoinRoomScreen({ navigation }) {
  const {
    setUserId,
    setRoomId,
    setRoomName,
    setUserName,
    setSongs,
    setNowPlaying,
    setParticipants,
  } = useContext(RoomContext);
  //   useRoomSocket(setSongs, setNowPlaying, setParticipants);

  const [roomCode, setRoomCode] = useState('');
  const [user, setUser] = useState('');

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !user.trim()) {
      return Alert.alert('Missing info', 'Please enter room ID & name');
    }
    console.log(roomCode, user);
    try {
      // 1️⃣ Verify room exists (REST)
      const exists = await axios.get(API.CHECK_ROOM_EXISTS(roomCode));
      if (!exists.data.exists) {
        return Alert.alert('Room Not Found', 'Enter valid Room ID');
      }

      // 2️⃣ Join room via SOCKET ONLY
      socket.emit('join_room', { roomId: roomCode, user });

      // 3️⃣ Receive synced room state
      socket.once('room_state', state => {
        console.log('ROOM SYNCED STATE:', state);

        setRoomId(roomCode);
        setRoomName(state.name);
        setUserName(user);

        setSongs(state.songs || []);
        setNowPlaying(state.nowPlaying || null);
        setParticipants(state.participants || []);

        navigation.navigate('Room');
      });

      // Optional: error handling
      socket.once('error', err => {
        Alert.alert('Join Failed', err.message || 'Unable to join room');
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to join room');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Room</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        placeholderTextColor="#aaa"
        value={user}
        onChangeText={setUser}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Room ID"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        value={roomCode}
        onChangeText={setRoomCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
        <Text style={styles.btnText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F0A0D',
  },

  title: {
    color: '#F8EDEF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#1C1216',
    color: '#F8EDEF',
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  button: {
    backgroundColor: '#E6B7C1',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#E6B7C1',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  btnText: {
    color: '#0F0A0D',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
