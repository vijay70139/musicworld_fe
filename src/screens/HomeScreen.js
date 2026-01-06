import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [showStarModal, setShowStarModal] = useState(false);
  const [activeStarImage, setActiveStarImage] = useState(null);

  const { isVerified, userName } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Lounge</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatedRoomList')}
      >
        <Text style={styles.btnText}>Host a Lounge</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('JoinRoom')}
      >
        <Text style={styles.btnText}>Enter Lounge</Text>
      </TouchableOpacity>
      {/* Decorative Stars */}
      {isVerified && (
        <>
          <TouchableOpacity
            onPress={() => {
              setActiveStarImage(require('../assets/images/NTR.jpg'));
              setShowStarModal(true);
            }}
            style={styles.starTopLeft}
          >
            <Text style={styles.starTopLeft}>✦</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveStarImage(require('../assets/images/image1.webp'));
              setShowStarModal(true);
            }}
            style={styles.starMiddleRight}
          >
            <Text style={styles.starMiddleRight}>✧</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveStarImage(require('../assets/images/NTR.jpg'));
              setShowStarModal(true);
            }}
            style={styles.starBottomLeft}
          >
            <Text style={styles.starText}>✨</Text>
          </TouchableOpacity>
        </>
      )}
      <Modal
        visible={showStarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStarModal(false)}
      >
        <TouchableOpacity
          style={styles.starModalOverlay}
          activeOpacity={1}
          onPress={() => setShowStarModal(false)}
        >
          <Image
            source={activeStarImage}
            style={styles.starImage}
          />
        </TouchableOpacity>
      </Modal>
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
    position: 'relative',
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
  starTopLeft: {
    position: 'absolute',
    top: 80,
    left: 30,
    fontSize: 26,
    color: '#E6B7C1',
    opacity: 0.7,
  },

  starMiddleRight: {
    position: 'absolute',
    top: '45%',
    right: 25,
    fontSize: 20,
    color: '#C997A3',
    // opacity: 0.6,
  },

  starBottomLeft: {
    position: 'absolute',
    bottom: 120,
    left: 60,
    fontSize: 30,
    color: '#F1CBD5',
    opacity: 0.5,
  },
  starText: {
    fontSize: 26,
  },

  starModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  starModalContent: {
    width: '80%',
    height: '50%',
    backgroundColor: '#1A1215',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6B7C1',
  },

  starImage: {
    width: 340,
    height: 380,
    borderRadius: 10,
  },
});
