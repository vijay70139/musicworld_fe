import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  // Alert,
} from 'react-native';
import { RoomContext } from '../context/RoomContext';
import axios from 'axios';
import API from '../config/api';
import socket from '../config/socket';

export default function RoomScreen({ navigation }) {
  const [showParticipants, setShowParticipants] = useState(false);

  const {
    roomId,
    roomName,
    userName,
    participants,
    songs,
    nowPlaying,
    skipSong,
    leaveRoom,
    removeParticipant,
    setNowPlaying,
  } = useContext(RoomContext);
  console.log('roomName, userName: ', roomName, userName);

  useEffect(() => {
    console.log('roomId: ', roomId);
    if (!roomId) {
      // Alert.alert('Room Left', 'You exited the room.');
      navigation.navigate('Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleSongSelect = song => {
    if (!song) return;

    socket.emit('set_now_playing', {
      roomId,
      song,
    });
  };

  const handleRemoveParticipant = participant => {
    // Implement participant removal logic here
    console.log('Remove participant: ', participant);
    removeParticipant(participant._id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName}</Text>
        <Text style={styles.user}>You: {userName}</Text>
      </View>

      {/* Now Playing UI */}
      {nowPlaying ? (
        <TouchableOpacity
          style={styles.nowPlayingBox}
          onPress={() => navigation.navigate('MusicPlayer')}
        >
          <Text style={styles.nowTitle}>🎶 Now Playing:</Text>
          <Text style={styles.songName}>{nowPlaying.title}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.waiting}>Waiting for a song...</Text>
      )}

      {/* Playlist */}
      <Text style={styles.sectionTitle}>Playlist</Text>
      <FlatList
        data={songs}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <View
            style={styles.songItem}
            onTouchEnd={() => handleSongSelect(item)}
          >
            <Text style={styles.songText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No songs added yet</Text>
        }
      />

      {/* Controls */}
      <TouchableOpacity style={styles.skipBtn} onPress={skipSong}>
        <Text style={styles.btnText}>⏭ Skip</Text>
      </TouchableOpacity>

      {/* Add Song */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddSong')}
      >
        <Text style={styles.btnText}>➕ Add Song</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.participantsBtn}
        onPress={() => setShowParticipants(true)}
      >
        <Text style={styles.btnText}>👥 Show Participants</Text>
      </TouchableOpacity>

      {/* Leave Room */}
      <TouchableOpacity style={styles.leaveBtn} onPress={leaveRoom}>
        <Text style={styles.btnText}>🚪 Leave Room</Text>
      </TouchableOpacity>
      <Modal visible={showParticipants} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowParticipants(false)}
            >
              <Text style={styles.modalCloseIcon}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Participants</Text>
            <ScrollView style={styles.participantScroll}>
              {participants.length > 0 ? (
                participants.map((p, index) => (
                  <View key={index} style={styles.userRow}>
                    <Text key={index} style={styles.modalUser}>
                      👤 {p.user}
                      <Text
                        style={styles.deleteIcon}
                        onPress={() => handleRemoveParticipant(p)}
                      >
                        ✖
                      </Text>
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.modalEmpty}>No participants...</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f15', padding: 20 },
  header: { marginBottom: 20 },
  roomTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  user: { color: '#aaa', fontSize: 14 },

  nowPlayingBox: {
    backgroundColor: '#1e242e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  nowTitle: { color: '#aaa', fontSize: 14 },
  songName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  waiting: { color: '#555', fontSize: 16, marginBottom: 10 },

  sectionTitle: { color: '#aaa', fontSize: 14, marginVertical: 10 },
  songItem: {
    padding: 12,
    backgroundColor: '#1c2330',
    marginBottom: 8,
    borderRadius: 6,
  },
  songText: { color: 'white' },
  empty: { color: '#777', textAlign: 'center', marginTop: 10 },

  skipBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: '#22c55e',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  leaveBtn: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: 'white', textAlign: 'center', fontSize: 16 },
  participantsBtn: {
    backgroundColor: '#4A7AFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    height: '60%',
    backgroundColor: '#1e242e',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  participantScroll: {
    smoothness: 'auto',
    smoothnessMode: 'always',
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  modalUser: {
    color: '#fff',
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'left',
    padding: 5,
    backgroundColor: '#2a3342',
    width: '100%',
    borderRadius: 6,
    marginTop: 8,
  },

  modalEmpty: {
    color: '#aaa',
    marginTop: 10,
  },
  modalCloseIcon: {
    color: '#fff',
    fontSize: 18,
  },
  deleteIcon: {
    color: '#ff4444',
    fontSize: 18,
    right: 0,
    marginLeft: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
});
