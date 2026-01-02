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
import FloatingStars from '../components/FloatingStars';
import { AuthContext } from '../context/AuthContext';

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
    paused,
    play,
    pause,
  } = useContext(RoomContext);
  const { isVerified } = useContext(AuthContext);

  // console.log('roomName, userName: ', roomName, userName);
  const STAR_IMAGES = [
    require('../assets/images/image1.webp'),
    require('../assets/images/NTR.jpg'),
    require('../assets/images/NTR.jpg'),
  ];
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
      <FloatingStars
        visible={isVerified}
        STAR_IMAGES={STAR_IMAGES}
        screen={'roomScreen'}
        starCount={3}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName}</Text>
        <Text style={styles.user}>You: {userName}</Text>
      </View>

      {/* Now Playing UI */}
      {nowPlaying ? (
        <TouchableOpacity
          style={styles.nowPlayingBox}
          // onPress={() => navigation.navigate('MusicPlayer')}
        >
          <Text style={styles.nowTitle}>🎶 Now Playing:</Text>
          <TouchableOpacity
            style={styles.songButton}
            onPress={paused ? play : pause}
          >
            <Text style={styles.songName}>{nowPlaying.title}</Text>
            <Text>{paused ? '▶️' : '⏸'}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => handleSongSelect(item)}
          >
            <Text style={styles.songText}>{item.title}</Text>
          </TouchableOpacity>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Participants</Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setShowParticipants(false)}
              >
                <Text style={styles.modalCloseIcon}>✖</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.participantScroll}>
              {participants.length > 0 ? (
                participants.map((p, index) => (
                  <View key={index} style={styles.userRow}>
                    <Text style={styles.modalUser}>👤 {p.user}</Text>

                    <TouchableOpacity
                      onPress={() => handleRemoveParticipant(p)}
                    >
                      <Text style={styles.deleteIcon}>✖</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.modalEmpty}>No participants...</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* 🎛 Floating Mini Player */}
      {/* {nowPlaying && (
        <TouchableOpacity
          style={styles.miniPlayer}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('MusicPlayer')}
        >
          <View style={styles.miniInfo}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              🎵 {nowPlaying.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={paused ? play : pause}
            style={styles.miniControl}
          >
            <Text style={styles.miniIcon}>{paused ? '▶️' : '⏸'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A0D',
    padding: 20,
  },

  /* ---------- HEADER ---------- */
  header: {
    marginBottom: 20,
  },

  roomTitle: {
    color: '#F8EDEF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },

  user: {
    color: '#B89CA4',
    fontSize: 14,
    textAlign: 'center',
  },

  /* ---------- NOW PLAYING ---------- */
  nowPlayingBox: {
    backgroundColor: '#1C1216',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2A1C22',
    shadowColor: '#E6B7C1',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  nowTitle: {
    color: '#B89CA4',
    fontSize: 14,
    marginBottom: 4,
  },

  songName: {
    color: '#F8EDEF',
    fontSize: 18,
    fontWeight: '700',
  },

  waiting: {
    color: '#7E646C',
    fontSize: 16,
    marginBottom: 10,
  },

  /* ---------- PLAYLIST ---------- */
  sectionTitle: {
    color: '#B89CA4',
    fontSize: 14,
    marginVertical: 12,
  },

  songItem: {
    padding: 14,
    backgroundColor: '#1C1216',
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  songText: {
    color: '#F8EDEF',
    fontSize: 15,
  },

  empty: {
    color: '#7E646C',
    textAlign: 'center',
    marginTop: 10,
  },

  /* ---------- BUTTONS ---------- */
  skipBtn: {
    backgroundColor: '#E6B7C1',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#E6B7C1',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  addBtn: {
    backgroundColor: '#C997A3',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
  },

  participantsBtn: {
    backgroundColor: '#B08994',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
  },

  leaveBtn: {
    backgroundColor: '#8E3B4E',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
  },

  btnText: {
    color: '#0F0A0D',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  /* ---------- MODAL ---------- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,10,13,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    height: '60%',
    backgroundColor: '#1C1216',
    padding: 20,
    borderRadius: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  modalTitle: {
    color: '#F8EDEF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },

  modalUser: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },

  modalEmpty: {
    color: '#B89CA4',
    marginTop: 10,
    textAlign: 'center',
  },

  modalCloseIcon: {
    color: '#F8EDEF',
    fontSize: 18,
  },

  deleteIcon: {
    color: '#ff4d4d',
    fontSize: 18,
    marginLeft: 12,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ⬅️ key line
    backgroundColor: '#2a3342',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  songButton: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 90,
    marginLeft: 100,
  },
});
