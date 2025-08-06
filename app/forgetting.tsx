import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';

const options = [
  { label: "1, No Problems", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4, Some Problems", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7, Major Problems", value: "7" },
];

const instruction = "On a scale from 1 to 7, how would you rate your memory in terms of the kinds of problems you have? (1 = No Problems, 7 = Major Problems)";

export default function ForgettingScreen() {
  const router = useRouter();

  const prevParams = useLocalSearchParams();

  const [answer, setAnswer] = useState('');

  const handleNext = () => {
    if (!answer) {
      Alert.alert('Please select an option', instruction);
      return;
    }
    console.log('forgetting params:', {
    ...prevParams,
    forgetting: answer,
  });

    router.push({
      pathname: '/summary',
      params: {
        ...prevParams,
        forgetting: answer,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Self-Rating</Text>
      <Text style={styles.instruction}>{instruction}</Text>
      <RadioButton.Group
        onValueChange={setAnswer}
        value={answer}
      >
        {options.map(opt => (
          <View style={styles.radioRow} key={opt.value}>
            <RadioButton.Android
              value={opt.value}
              color="#1a9274"
              uncheckedColor="#888"
            />
            <Text>{opt.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
      <Button title="Next" onPress={handleNext} disabled={!answer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' },
  instruction: { fontSize: 16, marginBottom: 18, textAlign: 'center' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, marginLeft: 12 },
});
