import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const sections = [
  // Section 1
  [
    {
      q: "SOMEONE WHO EXERCISES REGULARLY",
      left: "Does not describe me",
      right: "Describes me",
    },
    {
      q: "How certain are you of this self-description?",
      left: "Not at all certain",
      right: "Very certain",
    },
    {
      q: "How important is BEING SOMEONE WHO EXERCISES REGULARLY to your self-image?",
      left: "Not at all important",
      right: "Very important",
    },
  ],
  // Section 2
  [
    {
      q: "SOMEONE WHO KEEPS IN SHAPE",
      left: "Does not describe me",
      right: "Describes me",
    },
    {
      q: "How certain are you of this self-description?",
      left: "Not at all certain",
      right: "Very certain",
    },
    {
      q: "How important is BEING SOMEONE WHO KEEPS IN SHAPE to your self-image?",
      left: "Not at all important",
      right: "Very important",
    },
  ],
  // Section 3
  [
    {
      q: "PHYSICALLY ACTIVE",
      left: "Does not describe me",
      right: "Describes me",
    },
    {
      q: "How certain are you of this self-description?",
      left: "Not at all certain",
      right: "Very certain",
    },
    {
      q: "How important is BEING PHYSICALLY ACTIVE to your self-image?",
      left: "Not at all important",
      right: "Very important",
    },
  ],
  // Section 4
  [
    {
      q: "I AM SOMEONE WHO WILL ALWAYS BE AN EXERCISER",
      left: "Does not describe me",
      right: "Describes me",
    },
    {
      q: "How certain are you of this self-description?",
      left: "Not at all certain",
      right: "Very certain",
    },
    {
      q: "How important is ALWAYS BEING AN EXERCISER to your self-image?",
      left: "Not at all important",
      right: "Very important",
    },
  ],
];

export default function ESSQSectionScreen() {
  const router = useRouter();
  const prevParams = useLocalSearchParams();
  const [sectionIndex, setSectionIndex] = useState(0);


  const [answers, setAnswers] = useState(Array(12).fill(-1));

  const baseIndex = sectionIndex * 3;

  const handleSliderChange = (qIdx: number, value: number) => {
    const updated = [...answers];
    updated[baseIndex + qIdx] = value;
    setAnswers(updated);
  };

  const handleNext = () => {

    const currentFilled = answers.slice(baseIndex, baseIndex + 3).every(a => a !== -1);
    if (!currentFilled) {
      Alert.alert("Please answer all questions", "Use the slider for each item.");
      return;
    }
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
    } else {
      
      router.push({
        pathname: '/gds', 
        params: {
          ...prevParams,
          essqAnswers: JSON.stringify(answers),
        },
      });
    }
  };

  const handleBack = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  };

  const sectionIntro = [
    "Section 1: Someone Who Exercises Regularly",
    "Section 2: Someone Who Keeps in Shape",
    "Section 3: Physically Active",
    "Section 4: Always Being an Exerciser",
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.progressText}>
        Section {sectionIndex + 1} / {sections.length}
      </Text>
      <Text style={styles.sectionTitle}>{sectionIntro[sectionIndex]}</Text>
      {sections[sectionIndex].map((item, qIdx) => (
        <View key={qIdx} style={styles.qBlock}>
          <Text style={styles.question}>{item.q}</Text>
          <View style={styles.anchorRow}>
            <Text style={styles.anchor}>{item.left}</Text>
            <Text style={styles.anchor}>{item.right}</Text>
          </View>
          <Slider
            style={{ width: 260, height: 40 }}
            minimumValue={1}
            maximumValue={11}
            step={1}
            value={answers[baseIndex + qIdx] === -1 ? 6 : answers[baseIndex + qIdx]}
            onValueChange={(val) => handleSliderChange(qIdx, val)}
            minimumTrackTintColor="#1a9274"
            maximumTrackTintColor="#d6d6d6"
            thumbTintColor="#1a9274"
          />
          <Text style={styles.valueLabel}>
            {answers[baseIndex + qIdx] === -1 ? '--' : answers[baseIndex + qIdx]}
          </Text>
        </View>
      ))}
      <View style={styles.buttonRow}>
        {sectionIndex > 0 && <Button title="Back" onPress={handleBack} />}
        <Button
          title={sectionIndex === sections.length - 1 ? "Submit" : "Next"}
          onPress={handleNext}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  progressText: { fontSize: 15, color: '#888', width: '100%', textAlign: 'right', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a9274', marginBottom: 16, textAlign: 'center' },
  qBlock: { width: '100%', alignItems: 'center', marginBottom: 22, backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 },
  question: { fontSize: 16, marginBottom: 8, fontWeight: 'bold', textAlign: 'center' },
  anchorRow: { flexDirection: 'row', justifyContent: 'space-between', width: 260, marginBottom: 4 },
  anchor: { fontSize: 11, color: '#888', maxWidth: 100, textAlign: 'center' },
  valueLabel: { fontSize: 18, fontWeight: 'bold', color: '#1a9274', marginTop: 6 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16, gap: 14 },
});

