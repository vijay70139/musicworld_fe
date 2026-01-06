import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Text,
} from 'react-native';
import { Dimensions } from 'react-native';
// const STAR_IMAGES = [
//   require('../assets/images/image1.jpg'),
//   require('../assets/images/NTR.jpg'),
//   require('../assets/images/NTR.jpg'),
// ];

export default function FloatingStars({ visible, STAR_IMAGES, starCount = 2 }) {
  const [activeImage, setActiveImage] = useState(null);

  const { width, height } = Dimensions.get('window');
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * (height * 0.5) + 80,
      left: Math.random() * (width * 0.6) + 30,
      image: STAR_IMAGES[i % STAR_IMAGES.length],
    }));
  }, []);

  if (!visible) return null;

  return (
    <>
      {stars.map(star => (
        <TouchableOpacity
          key={star.id}
          style={[styles.star, { top: star.top, left: star.left }]}
          onPress={() => setActiveImage(star.image)}
        >
          {/* <Image
            source={require('../assets/images/NTR.jpg')}
            style={{ width: 24, height: 24, tintColor: '#e6b7c6' }}
          /> */}
          <Text style={{ width: 30, height: 30, tintColor: '#e6b7c6' }}>
            ✨
          </Text>
        </TouchableOpacity>
      ))}

      {/* Popup */}
      <Modal transparent visible={!!activeImage} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActiveImage(null)}
        >
          <Image source={activeImage} style={styles.popupImage} />
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    zIndex: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupImage: {
    width: 340,
    height: 380,
    borderRadius: 10,
  },
});
