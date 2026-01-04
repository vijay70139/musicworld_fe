import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import API from '../config/api';
import { RoomContext } from '../context/RoomContext';

export default function PublicRoomListScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const { joinRoom, userName } = useContext(RoomContext);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API.GET_ROOMS);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.log('Error fetching lounges:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoin = room => {
    joinRoom(room._id, userName);
    navigation.navigate('Room');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lounges Exists</Text>

      <FlatList
        data={rooms}
        keyExtractor={item => item._id}
        onRefresh={fetchRooms}
        refreshing={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomCard}
            onPress={() => handleJoin(item)}
          >
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomUsers}>
              👥 {item.participants?.length || 0} users
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.newRoomBtn}
        onPress={() => navigation.navigate('JoinRoom')}
      >
        <Text style={styles.btnText}>+ Join New Lounge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f15', padding: 20 },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  roomCard: {
    backgroundColor: '#1c2433',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  roomName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  roomUsers: { color: '#ccc', marginTop: 5 },
  newRoomBtn: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
