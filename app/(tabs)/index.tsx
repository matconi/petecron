import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
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
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [patidaAtivo, setPatidaAtivo] = useState(true);

  // Buscar tempoPonto do AsyncStorage ao iniciar e ao focar a tela
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const ponto = await AsyncStorage.getItem('tempoPonto');
          const value = ponto ? Number(ponto) : 0;
          const patidaAtivo = await AsyncStorage.getItem('patidaAtivo');
          if (isActive) {
            setSeconds(value);
            setInitialSeconds(value);
            
            setPatidaAtivo(patidaAtivo === 'true')
            if (patidaAtivo === 'false') {
              setTopRunning(false);
            }
          }
        } catch (e) {}
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          setRunning(false);
          setSeconds(initialSeconds);
          return initialSeconds;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, initialSeconds]);

  const handlePress = () => {
    if (running) {
      setSeconds(initialSeconds);
      setRunning(false);
    } else {
      setRunning(true);
      setTopRunning(true);
    }
  };

  const handleTopPress = () => {
    setTopRunning((prev) => !prev);
  };

  const handleTopReset = () => {
    Alert.alert(
      'Reiniciar partida',
      'Tem certeza que deseja reiniciar a partida?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', style: 'destructive', onPress: async () => {
            setTopSeconds(0);
            try {
              const ponto = await AsyncStorage.getItem('tempoPonto');
              const value = ponto ? Number(ponto) : 0;
              setSeconds(value);
              setInitialSeconds(value);
            } catch (e) {
              setSeconds(0);
              setInitialSeconds(0);
            }
            setRunning(false);
          }
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {patidaAtivo && <View style={styles.topTimerContainer}> 
        {!running && <TouchableOpacity style={styles.topPausePlayButton} onPress={handleTopPress}>
          <IconSymbol
            name={topRunning ? 'pause.fill' : 'play.fill'}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>}
        <Text style={styles.topTimerText}>{formatTime(topSeconds)}</Text>
        <TouchableOpacity style={styles.topResetButton} onPress={handleTopReset}>
          <IconSymbol name="restart.circle.fill" size={32} color="#fff" />
        </TouchableOpacity>
      </View>}

      <View style={styles.roundedBox}>
        <Text style={styles.timerText}>{seconds}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: running ? '#e20000ff' : '#43a047' }]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{running ? 'Zerar' : 'Iniciar'}</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    fontSize: 60,
    color: '#fff',
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
    fontSize: 208,
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
