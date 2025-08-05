import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function HomeScreen() {
  // Segundo cronômetro (topo)
  const [topSeconds, setTopSeconds] = useState(0);
  const [topRunning, setTopRunning] = useState(false);
  const topIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (topRunning) {
      topIntervalRef.current = setInterval(() => {
        setTopSeconds((prev) => prev + 1);
      }, 1000);
    } else if (topIntervalRef.current) {
      clearInterval(topIntervalRef.current);
      topIntervalRef.current = null;
    }
    return () => {
      if (topIntervalRef.current) clearInterval(topIntervalRef.current);
    };
  }, [topRunning]);

  // Cronômetro original (retângulo)
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handlePress = () => {
    if (running) {
      setSeconds(0);
      setRunning(false);
    } else {
      setSeconds(0);
      setRunning(true);
    }
  };

  const handleTopPress = () => {
    setTopRunning((prev) => !prev);
  };

  const handleTopReset = () => {
    Alert.alert(
      'Reiniciar partida',
      'Deseja realmente reiniciar a partida?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', style: 'destructive', onPress: () => {
            setTopSeconds(0);
            setSeconds(0);
            setRunning(false);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topTimerContainer}>
        <TouchableOpacity style={styles.topPausePlayButton} onPress={handleTopPress}>
          <IconSymbol
            name={topRunning ? 'pause.fill' : 'play.fill'}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.topTimerText}>{formatTime(topSeconds)}</Text>
        <TouchableOpacity style={styles.topResetButton} onPress={handleTopReset}>
          <IconSymbol name="restart.circle.fill" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.roundedBox}>
        <Text style={styles.timerText}>{seconds}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: running ? '#e20000ff' : '#43a047' }]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{running ? 'Zerar' : 'Iniciar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTimerContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  topTimerText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 16,
  },
  topPausePlayButton: {
    marginRight: 8,
  },
  topResetButton: {
    marginLeft: 8,
  },
  topButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  roundedBox: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: 'rgba(71, 71, 71, 0.4)',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 172,
    color: '#e20000ff',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    left: 24,
    bottom: 32,
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderRadius: 24,
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
