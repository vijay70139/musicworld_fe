import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import axios from 'axios';
import API from '../config/api';
import Clipboard from '@react-native-clipboard/clipboard';
// import { RoomContext } from '../context/RoomContext';
// import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreatedRoomListScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // const { joinRoom, userName } = useContext(RoomContext);
  const [copied, setCopied] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API.GET_ROOMS);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.log('Error fetching rooms:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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
      <Text style={styles.title}>Live Rooms</Text>

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
  container: { flex: 1, backgroundColor: '#0b0f15', padding: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 15 },

  roomCard: {
    backgroundColor: '#1c2433',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  roomUsers: { color: '#cccc', marginTop: 5 },

  inviteBtn: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  newRoomBtn: {
    backgroundColor: '#185ADB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  newRoomText: { color: 'white', fontSize: 18, fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2332',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },

  closeBtn: {
    marginTop: 10,
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteBtnIcon: { color: '#fff', fontSize: 18 },
  roomInfo: { flex: 1 },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 18, // makes it a perfect circle
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#cebdbdff',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },

  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalLabel: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
  },

  modalValue: {
    color: '#fff',
    fontSize: 18,
    marginTop: 3,
    fontWeight: '600',
  },

  copyBtn: {
    marginTop: 25,
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
