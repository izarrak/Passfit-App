import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';

const questions = [
  "Are you basically satisfied with your life?",
  "Do you often get bored?",
  "Do you often feel helpless?",
  "Do you prefer to stay at home, rather than going out and doing new things?",
  "Do you feel pretty worthless the way you are now?"
];

const options = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" }
];

const instruction = "Please answer the following questions about how you have felt in the past week. For each question, select 'Yes' or 'No' based on your experience.";

export default function GDSScreen() {
  const router = useRouter();

  const prevParams = useLocalSearchParams();

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [current, setCurrent] = useState(0);

  const handleChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[current]) {
      Alert.alert('Please answer', 'Please select Yes or No.');
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      console.log('gds params:', {
      ...prevParams,
      gdsAnswers: JSON.stringify(answers),
    });

      router.push({
        pathname: '/forgetting', 
        params: {
          ...prevParams,
          gdsAnswers: JSON.stringify(answers),
        },
      });
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = (current + 1) / questions.length;

  return (
    <View style={styles.container}>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {current + 1} / {questions.length}
      </Text>
      <Text style={styles.title}>Emotion</Text>
      {current === 0 && (
        <Text style={styles.instruction}>{instruction}</Text>
      )}
      <View style={styles.qBlock}>
        <Text style={styles.qText}>{questions[current]}</Text>
        <RadioButton.Group
          onValueChange={handleChange}
          value={answers[current]}
        >
          <View style={styles.radioRow}>
            {options.map(opt => (
              <View style={styles.radioItem} key={opt.value}>
                <RadioButton.Android
                  value={opt.value}
                  color="#1a9274"
                  uncheckedColor="#888"
                />
                <Text>{opt.label}</Text>
              </View>
            ))}
          </View>
        </RadioButton.Group>
      </View>
      <View style={styles.buttonRow}>
        {current > 0 && <Button title="Back" onPress={handleBack} />}
        <Button
          title={current === questions.length - 1 ? "Next" : "Next"}
          onPress={handleNext}
          disabled={!answers[current]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1a9274',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#888',
    width: '100%',
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  instruction: { fontSize: 15, color: '#374151', marginBottom: 20, textAlign: 'center' },
  qBlock: { width: '100%', alignItems: 'center', marginBottom: 18, backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 },
  qText: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
  radioRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4, marginBottom: 8 },
  radioItem: { alignItems: 'center', marginHorizontal: 18, flexDirection: 'row' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16, gap: 14 },
});
