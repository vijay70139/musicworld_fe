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
    backgroundColor: '#020214',
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#1a1a2d',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },

  createBtn: {
    backgroundColor: '#257CFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
