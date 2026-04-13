import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function BrowserScreen() {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const webViewRef = useRef<WebView>(null);

  const handleGo = () => {
    let formatted = inputUrl.trim();
    if (!formatted) return;

    // Check if it's a URL or a search query
    const isUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/.test(formatted);
    
    if (isUrl) {
      if (!formatted.startsWith('http')) {
        formatted = 'https://' + formatted;
      }
    } else {
      // It's a search query
      formatted = `https://www.google.com/search?q=${encodeURIComponent(formatted)}`;
    }
    setUrl(formatted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressBar}>
        <TextInput 
          style={styles.input}
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={handleGo}
          placeholder="Enter search or URL"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={handleGo} style={styles.goBtn}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <WebView 
        ref={webViewRef}
        source={{ uri: url }}
        incognito={true}
        style={styles.webview}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => webViewRef.current?.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current?.goForward()}>
          <Ionicons name="chevron-forward" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
          <Ionicons name="reload" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  addressBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
  },
  goBtn: {
    marginLeft: 10,
    padding: 5,
  },
  webview: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#333',
  }
});
