import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { RoomContext } from '../context/RoomContext';
import socket from '../config/socket';

export default function AddSongScreen({ navigation }) {
  const [url, setUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const { roomId, fetchPlaylist, allSongs, getAllSongs } =
    useContext(RoomContext);
  console.log('allSongs: ', allSongs);

  useEffect(() => {
    getAllSongs();
  }, []);

  const addToRoom = songId => {
    socket.emit('add_song_to_room', {
      roomId,
      songId,
    });
    navigation.goBack();
  };

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

    await socket.emit('add_song', { roomId, song });

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
      {allSongs.length === 0 && (
        <Text style={{ color: '#fff', marginTop: 20 }}>
          No songs available to add.
        </Text>
      )}
      {allSongs.length > 0 && (
        <Text style={{ color: '#fff', marginTop: 20, marginBottom: 10 }}>
          select from existing songs:
        </Text>
      )}
      {allSongs.length > 0 && (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={allSongs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.songRow}
              activeOpacity={0.7}
              onPress={() => addToRoom(item._id)}
            >
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.duration ? (
                  <Text style={styles.songDuration}>
                    {Math.floor(item.duration / 60)}:
                    {(item.duration % 60).toString().padStart(2, '0')}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.addIcon}>➕</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No songs available</Text>
          }
        />
      )}
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
  list: {
    width: '100%',
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c2330',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  songDuration: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  addIcon: {
    fontSize: 22,
    color: '#22c55e',
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
