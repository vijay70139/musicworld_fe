import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function VerifyUserScreen({ navigation }) {
  const { verifyUser, skipVerify } = useContext(AuthContext);
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 🎧</Text>
      <Text style={styles.subtitle}>Verify to unlock special features</Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={async () => {
          if (!name.trim()) return;
          const isVerified = await verifyUser(name.trim());
          console.log("isVerified: ", isVerified);
          if (isVerified) {
            navigation.replace('Home');
          }
        }}
      >
        <Text style={styles.btnText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          skipVerify();
          navigation.replace('Home');
        }}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f15',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    color: '#E6B7C1',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1e242e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  verifyBtn: {
    backgroundColor: '#E6B7C1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  skipText: {
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});
