import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Text, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VaultService } from '../../services/vaultService';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_SIZE = width / COLUMN_COUNT;

export default function VideosScreen() {
  const { isFake } = useLocalSearchParams<{ isFake: string }>();
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const fakeMode = isFake === 'true';

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const list = await VaultService.getMedia(fakeMode, 'videos');
    setVideos(list);
    setLoading(false);
  };

  const handleAdd = async () => {
    await VaultService.addMedia(fakeMode, 'videos');
    loadVideos();
  };

  const handleDelete = async (uri: string) => {
    await VaultService.deleteMedia(uri);
    loadVideos();
  };

  if (loading) return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="videocam-off-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>No videos yet</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          numColumns={COLUMN_COUNT}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.itemWrapper} 
              onPress={() => setSelectedVideo(item)}
            >
              <Video
                source={{ uri: item }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isMuted={true}
              />
              <View style={styles.overlay}>
                <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.7)" />
              </View>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selectedVideo} transparent={false} animationType="slide">
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => setSelectedVideo(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo }}
              style={styles.fullVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#333',
    marginTop: 10,
    fontSize: 18,
  },
  itemWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    padding: 1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullVideo: {
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
