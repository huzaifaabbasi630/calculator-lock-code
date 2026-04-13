import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;

export default function VaultDashboard() {
  const router = useRouter();
  const { isFake } = useLocalSearchParams<{ isFake: string }>();
  const fakeMode = isFake === 'true';

  const menuItems = [
    { title: 'Images', icon: 'images-outline', color: '#5856D6', path: '/gallery' },
    { title: 'Videos', icon: 'videocam-outline', color: '#FF2D55', path: '/videos' },
    { title: 'Browser', icon: 'globe-outline', color: '#007AFF', path: '/browser' },
    { title: 'Settings', icon: 'settings-outline', color: '#8E8E93', path: '/settings' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="calculator" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Private Vault</Text>
        {fakeMode && (
          <View style={styles.decoyBadge}>
            <Text style={styles.decoyText}>Decoy Mode</Text>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.cardWrapper}
            onPress={() => router.push({ pathname: item.path as any, params: { isFake } })}
          >
            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={32} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.exitButton}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.exitText}>Lock Vault</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 15,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  decoyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  decoyText: {
    color: '#aaa',
    fontSize: 12,
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 15,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exitButton: {
    marginTop: 40,
    backgroundColor: Colors.dark.danger,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  exitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
