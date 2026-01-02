import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import API from '../config/api';
import Clipboard from '@react-native-clipboard/clipboard';
import { AuthContext } from '../context/AuthContext';
import FloatingStars from '../components/FloatingStars';
// import { RoomContext } from '../context/RoomContext';
// import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreatedRoomListScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // const { joinRoom, userName } = useContext(RoomContext);
  const [copied, setCopied] = useState(false);
  const { isVerified } = useContext(AuthContext);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API.GET_ROOMS);
      if (res.data.success) {
        setRooms(res.data.rooms || []);
      }
    } catch (err) {
      console.log('Fetch rooms error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const STAR_IMAGES = [
    require('../assets/images/image1.webp'),
    require('../assets/images/NTR.jpg'),
  ];
  // const handleJoin = async room => {
  //  await joinRoom(room._id, userName);
  //   navigation.navigate('Room');
  // };

  const copyRoomId = () => {
    Clipboard.setString(selectedRoom._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  console.log(selectedRoom, 'selectedRoom');
  return (
    <View style={styles.container}>
      <FloatingStars
        visible={isVerified}
        STAR_IMAGES={STAR_IMAGES}
        screen={'createdRoomList'}
        starCount={2}
      />
      <Text style={styles.title}>Live Rooms</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E6B7C6" />
          <Text style={styles.loaderText}>Loading rooms...</Text>
        </View>
      ) : !loading && rooms.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.emptyText}>No live rooms yet ✨</Text>
        </View>
      ) : (
        rooms.length > 0 && (
          <FlatList
            data={rooms}
            keyExtractor={item => item._id}
            refreshing={false}
            onRefresh={fetchRooms}
            renderItem={({ item }) => (
              <View style={styles.roomCard}>
                <TouchableOpacity
                  style={styles.roomInfo}
                  // onPress={() => handleJoin(item)}
                >
                  <Text style={styles.roomName}>{item.name}</Text>
                  <Text style={styles.roomUsers}>
                    👥 {item.participants?.length || 0} participants
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.inviteBtn}
                  onPress={() => setSelectedRoom(item)}
                >
                  <Text style={styles.inviteBtnIcon}>📩</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )
      )}
      <TouchableOpacity
        style={styles.newRoomBtn}
        onPress={() => navigation.navigate('CreateRoom')}
      >
        <Text style={styles.newRoomText}>+ Create</Text>
      </TouchableOpacity>

      {/* Invite Modal */}
      <Modal visible={!!selectedRoom} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setCopied(false);
                setSelectedRoom(null);
              }}
            >
              {/* <Ionicons name="close" size={26} color="#fff" /> */}
              <Text size={26} color="#fff">
                ✖
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Invite Friend</Text>

            <Text style={styles.modalLabel}>Room Name</Text>
            <Text style={styles.modalValue}>{selectedRoom?.name}</Text>

            <Text style={styles.modalLabel}>Room ID</Text>
            <Text style={styles.modalValue}>{selectedRoom?._id}</Text>

            <TouchableOpacity style={styles.copyBtn} onPress={copyRoomId}>
              <Text style={styles.copyText}>
                {copied ? 'Copied ✓' : '📋 Copy Room ID'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A0D',
    padding: 20,
    position: 'relative',
  },

  title: {
    color: '#F8EDEF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 15,
  },

  roomCard: {
    backgroundColor: '#1C1216',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  roomInfo: { flex: 1 },

  roomName: {
    color: '#F8EDEF',
    fontSize: 18,
    fontWeight: '600',
  },

  roomUsers: {
    color: '#B89CA4',
    marginTop: 5,
    fontSize: 13,
  },

  inviteBtn: {
    backgroundColor: '#E6B7C1',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },

  inviteBtnIcon: {
    color: '#0F0A0D',
    fontSize: 18,
  },

  newRoomBtn: {
    backgroundColor: '#E6B7C1',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
    bottom: 35,
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#E6B7C1',
  },

  newRoomText: {
    color: '#0F0A0D',
    fontSize: 18,
    fontWeight: '700',
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,10,13,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#1C1216',
    padding: 20,
    width: '80%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  closeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E6B7C1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  modalTitle: {
    color: '#F8EDEF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalLabel: {
    color: '#B89CA4',
    fontSize: 14,
    marginTop: 10,
  },

  modalValue: {
    color: '#F8EDEF',
    fontSize: 18,
    marginTop: 3,
    fontWeight: '600',
  },

  copyBtn: {
    marginTop: 25,
    backgroundColor: '#E6B7C1',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  copyText: {
    color: '#0F0A0D',
    fontSize: 16,
    fontWeight: '700',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0f15',
  },

  loaderText: {
    marginTop: 12,
    color: '#E6B7C6', // rose gold
    fontSize: 14,
    letterSpacing: 0.5,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 50,
    textAlign: 'center',
  },
});
