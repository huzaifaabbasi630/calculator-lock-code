import { useState, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

export const useCalculator = (onSecretTrigger: (currentInput: string) => void) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);
  
  // Secret Gesture Tracking
  const lastThreePress = useRef<number>(0);
  const threePressCount = useRef<number>(0);

  const handlePress = useCallback((val: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Track '3' presses for secret gesture
    if (val === '3') {
      const now = Date.now();
      if (now - lastThreePress.current < 500) {
        threePressCount.current += 1;
      } else {
        threePressCount.current = 1;
      }
      lastThreePress.current = now;

      if (threePressCount.current === 3) {
        onSecretTrigger(display === '0' ? expression : display);
        threePressCount.current = 0;
        return;
      }
    } else {
      threePressCount.current = 0;
    }

    if (val === 'AC') {
      setDisplay('0');
      setExpression('');
      setLastResult(null);
      return;
    }

    if (val === '=') {
      try {
        // Simple eval replacement for safety
        const result = eval(expression.replace('×', '*').replace('÷', '/'));
        setDisplay(result.toString());
        setExpression(result.toString());
        setLastResult(result);
      } catch {
        setDisplay('Error');
      }
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(val)) {
      setExpression(prev => prev + val);
      setDisplay('0');
      return;
    }

    // Numbers
    setDisplay(prev => (prev === '0' ? val : prev + val));
    setExpression(prev => prev + val);
  }, [display, expression, onSecretTrigger]);

  return { display, expression, handlePress };
};
