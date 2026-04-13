import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEYS = {
  SECRET_KEY: 'vault_secret_key',
  FAKE_KEY: 'vault_fake_key',
  IS_LOCKED: 'vault_is_locked',
  WRONG_ATTEMPTS: 'vault_wrong_attempts',
  LAST_WRONG_ATTEMPT: 'vault_last_wrong_attempt',
  BIOMETRICS_ENABLED: 'vault_biometrics_enabled',
};

export const AuthService = {
  async setSecretKey(key: string, isFake = false) {
    const storageKey = isFake ? KEYS.FAKE_KEY : KEYS.SECRET_KEY;
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(storageKey, key);
    } else {
      await SecureStore.setItemAsync(storageKey, key);
    }
  },

  async getSecretKey(isFake = false) {
    const storageKey = isFake ? KEYS.FAKE_KEY : KEYS.SECRET_KEY;
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(storageKey);
    } else {
      return await SecureStore.getItemAsync(storageKey);
    }
  },

  async verifyKey(enteredKey: string): Promise<{ success: boolean; isFake: boolean }> {
    const realKey = await this.getSecretKey(false);
    const fakeKey = await this.getSecretKey(true);

    if (enteredKey === realKey) {
      await this.resetWrongAttempts();
      return { success: true, isFake: false };
    }

    if (enteredKey === fakeKey) {
      await this.resetWrongAttempts();
      return { success: true, isFake: true };
    }

    await this.incrementWrongAttempts();
    return { success: false, isFake: false };
  },

  async incrementWrongAttempts() {
    const attempts = await this.getWrongAttempts();
    const newAttempts = attempts + 1;
    await AsyncStorage.setItem(KEYS.WRONG_ATTEMPTS, newAttempts.toString());
    if (newAttempts >= 5) {
      await AsyncStorage.setItem(KEYS.LAST_WRONG_ATTEMPT, Date.now().toString());
    }
  },

  async resetWrongAttempts() {
    await AsyncStorage.setItem(KEYS.WRONG_ATTEMPTS, '0');
    await AsyncStorage.removeItem(KEYS.LAST_WRONG_ATTEMPT);
  },

  async getWrongAttempts(): Promise<number> {
    const val = await AsyncStorage.getItem(KEYS.WRONG_ATTEMPTS);
    return val ? parseInt(val, 10) : 0;
  },

  async getCooldownTime(): Promise<number> {
    const lastAttempt = await AsyncStorage.getItem(KEYS.LAST_WRONG_ATTEMPT);
    if (!lastAttempt) return 0;
    
    const elapsed = Date.now() - parseInt(lastAttempt, 10);
    const remaining = 30000 - elapsed;
    return remaining > 0 ? remaining : 0;
  },

  async authenticateBiometrics(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Vault',
      fallbackLabel: 'Use Passcode',
    });

    return result.success;
  },

  async resetAuth() {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(KEYS.SECRET_KEY);
      await AsyncStorage.removeItem(KEYS.FAKE_KEY);
    } else {
      await SecureStore.deleteItemAsync(KEYS.SECRET_KEY);
      await SecureStore.deleteItemAsync(KEYS.FAKE_KEY);
    }
    await this.resetWrongAttempts();
    await AsyncStorage.removeItem('has_run_v1'); // Reset onboarding too
  }
};
