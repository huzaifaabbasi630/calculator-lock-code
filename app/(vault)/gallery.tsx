import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VaultService } from '../../services/vaultService';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = width / COLUMN_COUNT;

export default function GalleryScreen() {
  const { isFake } = useLocalSearchParams<{ isFake: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fakeMode = isFake === 'true';

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const list = await VaultService.getMedia(fakeMode, 'images');
    setImages(list);
    setLoading(false);
  };

  const handleAdd = async () => {
    await VaultService.addMedia(fakeMode, 'images');
    loadImages();
  };

  const handleDelete = async (uri: string) => {
    await VaultService.deleteMedia(uri);
    loadImages();
  };

  if (loading) return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={COLUMN_COUNT}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemWrapper} 
            onPress={() => setSelectedImage(item)}
          >
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash" size={16} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedImage} transparent={false} animationType="fade">
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.fullImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  itemWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    padding: 1,
  },
  image: {
    flex: 1,
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.dark.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  }
});
