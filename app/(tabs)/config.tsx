import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [pontoTempo, setPontoTempo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const enabled = await AsyncStorage.getItem('habilitado');
        const minutes = await AsyncStorage.getItem('tempoPartida');
        const ponto = await AsyncStorage.getItem('tempoPonto');
        if (enabled !== null) setIsEnabled(enabled === 'true');
        if (minutes !== null) setSelectedMinutes(Number(minutes));
        if (ponto !== null) setPontoTempo(ponto);
      } catch (e) {}
    })();
  }, []);

  const handleSwitch = async (value: boolean) => {
    setIsEnabled(value);
    await AsyncStorage.setItem('patidaAtivo', value.toString());
  };

  const handlePicker = async (value: number) => {
    setSelectedMinutes(value);
    await AsyncStorage.setItem('tempoPartida', value.toString());
  };

  const handlePontoTempo = async (text: string) => {
    if (/^\d{0,2}$/.test(text)) {
      setPontoTempo(text);
      await AsyncStorage.setItem('tempoPonto', text);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topTimerContainer}>
        <Collapsible title="Tempo da Partida">
          <View style={styles.titleContainer}>
            <ThemedText style={styles.textCenter}>
              Ativo
            </ThemedText>
            <Switch
              value={isEnabled}
              onValueChange={handleSwitch}
            />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.textCenter}>
              Tempo
            </ThemedText>
            <Picker
              selectedValue={selectedMinutes}
              onValueChange={handlePicker}
              style={{color: '#fff', width: 200 }}
            >
              <Picker.Item label="5 min" value={300} />
              <Picker.Item label="8 min" value={480} />
              <Picker.Item label="10 min" value={600} />
              <Picker.Item label="12 min" value={720} />
              <Picker.Item label="15 min" value={900} />
              <Picker.Item label="20 min" value={1200} />
            </Picker>
          </View>
        </Collapsible>
        <View style={styles.titleContainer}>
          <ThemedText type='subtitle'>
            Tempo do Ponto
          </ThemedText>
          <TextInput
            value={pontoTempo}
            onChangeText={handlePontoTempo}
            keyboardType="numeric"
            maxLength={2}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              height: 32,
              width: 48,
              paddingBottom: 4,
              color: '#fff',
            }}
            placeholder="00"
            placeholderTextColor="#888"
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  topTimerContainer: {
    position: 'absolute',
    top: 48,
    left: 6,
    right: 6,
    gap: 8
  },
  titleContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textCenter: {
    textAlignVertical: 'center',
  }
});
