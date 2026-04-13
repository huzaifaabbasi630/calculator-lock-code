import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { AuthService } from '../../services/authService';
import { VaultService } from '../../services/vaultService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [biometrics, setBiometrics] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);

  const performFactoryReset = async () => {
    Alert.alert(
      'FACTORY RESET',
      'This will DELETE ALL IMAGES, VIDEOS, and RESET your SECRET KEY. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'DELETE EVERYTHING', 
          style: 'destructive', 
          onPress: async () => {
            await VaultService.resetVault();
            await AuthService.resetAuth();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Ionicons name="finger-print" size={24} color="#fff" />
            <Text style={styles.label}>Biometric Unlock</Text>
          </View>
          <Switch 
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: '#333', true: Colors.dark.success }}
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={performFactoryReset}>
          <View style={styles.labelContainer}>
            <Ionicons name="key-outline" size={24} color="#fff" />
            <Text style={styles.label}>Change Secret Key (Reset App)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stealth</Text>
        
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Ionicons name="eye-off-outline" size={24} color="#fff" />
            <Text style={styles.label}>Stealth Mode</Text>
          </View>
          <Switch 
            value={stealthMode}
            onValueChange={setStealthMode}
            trackColor={{ false: '#333', true: Colors.dark.primary }}
          />
        </View>
        <Text style={styles.hint}>Change app icon to Notes or System Utility.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cloud Sync</Text>
        <TouchableOpacity style={styles.syncBtn}>
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.syncText}>Sync to Cloud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 5,
  },
  syncBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  syncText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});
