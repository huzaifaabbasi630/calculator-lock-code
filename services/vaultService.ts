import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';


const VAULT_ROOT = (FileSystem.documentDirectory ?? '') + 'vault/';
const REAL_PATH = `${VAULT_ROOT}real/`;
const FAKE_PATH = `${VAULT_ROOT}fake/`;

export const VaultService = {
  async initialize() {
    await FileSystem.makeDirectoryAsync(REAL_PATH + 'images/', { intermediates: true });
    await FileSystem.makeDirectoryAsync(REAL_PATH + 'videos/', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FAKE_PATH + 'images/', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FAKE_PATH + 'videos/', { intermediates: true });
  },

  async addMedia(isFake: boolean, type: 'images' | 'videos') {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'images' ? ['images'] : ['videos'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const path = (isFake ? FAKE_PATH : REAL_PATH) + type + '/';
      for (const asset of result.assets) {
        const fileName = asset.uri.split('/').pop();
        const dest = path + fileName;
        try {
          await FileSystem.copyAsync({ from: asset.uri, to: dest });
        } catch (error) {
          console.error("Media copy failed:", error);
        }
      }
    }
  },

  async getMedia(isFake: boolean, type: 'images' | 'videos'): Promise<string[]> {
    const path = (isFake ? FAKE_PATH : REAL_PATH) + type + '/';
    try {
      const files = await FileSystem.readDirectoryAsync(path);
      return files.map(f => path + f);
    } catch {
      return [];
    }
  },

  async deleteMedia(uri: string) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  },

  async resetVault() {
    await FileSystem.deleteAsync(VAULT_ROOT, { idempotent: true });
    await this.initialize();
  }
};
