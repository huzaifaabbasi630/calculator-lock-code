import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCalculator } from '../../hooks/useCalculator';
import { Colors } from '../../constants/Colors';
import { AuthService } from '../../services/authService';
import { VaultService } from '../../services/vaultService';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 4;

export default function CalculatorScreen() {
  const router = useRouter();
  const [isSetup, setIsSetup] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    VaultService.initialize();
    checkSetup();
    checkCooldown();
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    const hasRun = await AsyncStorage.getItem('has_run_v1');
    if (!hasRun) {
      Alert.alert(
        "Welcome!",
        "This app is created by Hafiz Huzaifa.",
        [
          { 
            text: "Next", 
            onPress: () => {
              Alert.alert(
                "How to use",
                "1. Type any 6 or 6+ digit number and press '3x rapid 3times' to set your secret key.\n2. Once set, type that number and press '3x rapid 3times' anytime to unlock your vault.\n3. Your data is encrypted and secure.",
                [{ text: "Get Started", onPress: () => AsyncStorage.setItem('has_run_v1', 'true') }]
              );
            } 
          }
        ]
      );
    }
  };

  const checkSetup = async () => {
    const key = await AuthService.getSecretKey();
    setIsSetup(!!key);
  };

  const checkCooldown = async () => {
    const remaining = await AuthService.getCooldownTime();
    if (remaining > 0) {
      setCooldown(Math.ceil(remaining / 1000));
      const timer = setInterval(async () => {
        const r = await AuthService.getCooldownTime();
        if (r <= 0) {
          setCooldown(0);
          clearInterval(timer);
        } else {
          setCooldown(Math.ceil(r / 1000));
        }
      }, 1000);
    }
  };

  const onSecretTrigger = async (input: string) => {
    if (cooldown > 0) return;

    if (!isSetup) {
      if (input.length < 4) return;
      await AuthService.setSecretKey(input);
      // Optional: Set a default fake key too
      await AuthService.setSecretKey('123456', true);
      setIsSetup(true);
      alert('Secret Key Set!');
    } else {
      const result = await AuthService.verifyKey(input);
      if (result.success) {
        router.push({
          pathname: '/dashboard',
          params: { isFake: result.isFake ? 'true' : 'false' }
        });
      } else {
        const attempts = await AuthService.getWrongAttempts();
        if (attempts >= 5) checkCooldown();
      }
    }
  };

  const { display, handlePress } = useCalculator(onSecretTrigger);

  const buttons = [
    ['AC', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const getButtonStyle = (btn: string) => {
    if (['÷', '×', '-', '+', '='].includes(btn)) return styles.operatorButton;
    if (['AC', '+/-', '%'].includes(btn)) return styles.utilityButton;
    return styles.numberButton;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {cooldown > 0 ? `Locked: ${cooldown}s` : display}
        </Text>
      </View>

      <View style={styles.buttonGrid}>
        {buttons.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={[
                  styles.button,
                  getButtonStyle(btn),
                  btn === '0' && styles.zeroButton,
                  btn === '=' && styles.equalsButton
                ]}
                onPress={() => handlePress(btn)}
              >
                <Text style={[
                  styles.buttonText,
                  ['AC', '+/-', '%'].includes(btn) && styles.utilityText
                ]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  displayContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  displayText: {
    color: Colors.dark.text,
    fontSize: 80,
    fontWeight: '300',
  },
  buttonGrid: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    width: BUTTON_SIZE * 2 + 15,
    alignItems: 'flex-start',
    paddingLeft: 35,
  },
  numberButton: {
    backgroundColor: Colors.dark.secondary,
  },
  operatorButton: {
    backgroundColor: Colors.dark.primary,
  },
  equalsButton: {
    backgroundColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  utilityButton: {
    backgroundColor: Colors.dark.accent,
  },
  buttonText: {
    fontSize: 32,
    color: Colors.dark.text,
  },
  utilityText: {
    color: '#000',
  },
  operatorText: {
    color: '#fff',
  }
});
