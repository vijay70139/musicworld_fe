import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { RoomContext } from '../context/RoomContext';
import socket from '../config/socket';

export default function AddSongScreen({ navigation }) {
  const [url, setUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const { roomId, fetchPlaylist } = useContext(RoomContext);

  const handleAddSong = async () => {
    if (!url.trim() || !songTitle.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid media URL');
      return;
    }

    const song = {
      url: url.trim(),
      title: songTitle.trim(),
    };
    console.log(song, 'song adding');

    socket.emit('add_song', { roomId, song });

    // Refresh playlist
    await fetchPlaylist(roomId);

    setUrl('');
    await navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Song</Text>
      <TextInput
        placeholder="Song Title"
        placeholderTextColor="#999"
        style={styles.input}
        value={songTitle}
        onChangeText={setSongTitle}
      />
      <TextInput
        placeholder="Paste YouTube/MP3 Link"
        placeholderTextColor="#999"
        style={styles.input}
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddSong}>
        <Text style={styles.buttonText}>Add to Playlist</Text>
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
  heading: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1c1c2e',
    padding: 15,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#257CFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
