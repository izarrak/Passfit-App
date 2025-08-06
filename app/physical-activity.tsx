import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';

export default function PhysicalActivityScreen() {
  const router = useRouter();

  const prevParams = useLocalSearchParams();

  const [minutes, setMinutes] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    const numericMinutes = parseInt(minutes, 10);
    if (isNaN(numericMinutes)) {
      setError('Please enter a valid number');
      return;
    }

    setError('');
    // unmet=1，met=0
    const unmetPAG = numericMinutes < 150 ? 1 : 0;

    console.log('physical-activity params:', {
      ...prevParams,
      physicalActivityMinutes: numericMinutes,
      unmetPAG,
    });

    router.push({
      pathname: '/crf',
      params: {
        ...prevParams,
        physicalActivityMinutes: numericMinutes,
        unmetPAG,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Physical Activity</Text>
          <Text style={styles.subtitle}>
            In the past 7 days, how many minutes of moderate-intensity aerobic activity did you complete?
          </Text>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={setMinutes}
            placeholder="e.g. 120"
            keyboardType="numeric"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Next" onPress={handleNext} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
