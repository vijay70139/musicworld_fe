import React, { useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { RoomContext } from '../context/RoomContext';

export default function CreateRoomScreen({ navigation }) {
  const { createRoom, setUserName, userName, setRoomName, roomName } =
    useContext(RoomContext);

  const handleCreate = () => {
    if (!roomName || !userName) {
      return Alert.alert('Required', 'Enter Room Name & Your Name');
    }
    createRoom(roomName, userName, () => {
      navigation.navigate('CreatedRoomList');
    });

    // navigation.navigate('Room');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Room</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        placeholderTextColor="#777"
        value={userName}
        onChangeText={setUserName}
      />

      {/* Room Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Room Name"
        placeholderTextColor="#777"
        value={roomName}
        onChangeText={setRoomName}
      />

      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.btnText}>Create Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A0D',
    padding: 20,
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
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  createBtn: {
    backgroundColor: '#E6B7C1',
    padding: 15,
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
