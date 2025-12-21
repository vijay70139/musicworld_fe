import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {COLORS} from '../theme/colors';
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Room</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatedRoomList')}
      >
        <Text style={styles.btnText}>Create Room</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('JoinRoom')}
      >
        <Text style={styles.btnText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginTop: 15,
  },
  btnText: {
    color: COLORS.background,
    fontSize: 18,
  },
});
