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
import FloatingStars from '../components/FloatingStars';
import { AuthContext } from '../context/AuthContext';

export default function AddSongScreen({ navigation }) {
  const [url, setUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const { roomId, fetchPlaylist, allSongs, getAllSongs } =
    useContext(RoomContext);
  const { isVerified } = useContext(AuthContext);

  console.log('allSongs: ', allSongs);

  useEffect(() => {
    getAllSongs();
  }, []);

  const STAR_IMAGES = [
    require('../assets/images/image1.webp'),
    require('../assets/images/NTR.jpg'),
    require('../assets/images/NTR.jpg'),
  ];

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
      <FloatingStars
        visible={isVerified}
        STAR_IMAGES={STAR_IMAGES}
        screen={'addSongScreen'}
        starCount={3}
      />

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
    backgroundColor: '#0F0A0D',
    padding: 20,
  },

  heading: {
    color: '#F8EDEF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#1C1216',
    padding: 15,
    borderRadius: 14,
    color: '#F8EDEF',
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  button: {
    backgroundColor: '#E6B7C1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#E6B7C1',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonText: {
    color: '#0F0A0D',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
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
    backgroundColor: '#1C1216',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A1C22',
  },

  songInfo: {
    flex: 1,
    marginRight: 12,
  },

  songTitle: {
    color: '#F8EDEF',
    fontSize: 16,
    fontWeight: '600',
  },

  songDuration: {
    color: '#B89CA4',
    fontSize: 12,
    marginTop: 4,
  },

  addIcon: {
    fontSize: 22,
    color: '#E6B7C1',
  },

  emptyText: {
    color: '#7E646C',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
