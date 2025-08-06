import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';

const metTable = {
  sedentary: 1.5,
  light: 2.5,
  moderate: 4.5,
  vigorous: 7,
  veryVigorous: 10,
};

export default function RecommendationScreen() {
  const params = useLocalSearchParams();
  const [activities, setActivities] = useState<any[]>([]);
  const [pretieScores, setPretieScores] = useState({ preference: 0, tolerance: 0 });

  const age = Number(params.age);
  const activityLevelStr = typeof params.activityLevel === 'string' ? params.activityLevel : (Array.isArray(params.activityLevel) ? params.activityLevel[0] : 'sedentary');
  const metThreshold = metTable[activityLevelStr as keyof typeof metTable] || 1.5;
  const buddyType = typeof params.buddySupportType === 'string' ? params.buddySupportType.toLowerCase() : 'none';

  useEffect(() => {
    async function loadCSV() {
      const asset = Asset.fromModule(
        age >= 60 ? require('C:/Users/udazken/passfit-app/assets/older-compendium.csv') : require('C:/Users/udazken/passfit-app/assets/general-compendium.csv')
      );
      await asset.downloadAsync();
      const fileUri = asset.localUri || asset.uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri!, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      const data = parsed.data as any[];
      const filtered = data.filter(row => parseFloat(row.METS) >= metThreshold);

      let selected: any[] = [];
      if (buddyType === 'solo' || buddyType === 'social') {
        selected = filtered.filter(row => row['Social Context'].toLowerCase() === buddyType);
        selected = shuffle(selected).slice(0, 6);
      } else {
        const solo = shuffle(filtered.filter(r => r['Social Context'].toLowerCase() === 'solo')).slice(0, 2);
        const social = shuffle(filtered.filter(r => r['Social Context'].toLowerCase() === 'social')).slice(0, 2);
        const noPref = shuffle(filtered.filter(r => r['Social Context'].toLowerCase() === 'no preference')).slice(0, 2);
        selected = [...solo, ...social, ...noPref];
      }

      setActivities(selected);
    }

    //pretie scores analysis
    let pretieAnswers: number[] = [];
    try {
      pretieAnswers = params.pretieAnswers ? JSON.parse(params.pretieAnswers as string).map((x: string | number) => Number(x)) : [];
    } catch {}
    let preferenceScore = 0;
    let toleranceScore = 0;
    const preferenceOriginal = [5, 9, 13, 15];
    const preferenceReverse = [1, 3, 7, 11];
    const toleranceOriginal = [0, 2, 8, 12];
    const toleranceReverse = [4, 6, 10, 14];
    preferenceOriginal.forEach(i => preferenceScore += pretieAnswers[i] || 0);
    preferenceReverse.forEach(i => preferenceScore += (6 - (pretieAnswers[i] || 0)));
    toleranceOriginal.forEach(i => toleranceScore += pretieAnswers[i] || 0);
    toleranceReverse.forEach(i => toleranceScore += (6 - (pretieAnswers[i] || 0)));
    setPretieScores({ preference: preferenceScore, tolerance: toleranceScore });

    loadCSV();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Personalized Recommendation</Text>
      <Text style={styles.section}><Text style={{ fontWeight: 'bold' }}>Your MET level: </Text>{metThreshold}</Text>
      <Text style={styles.section}><Text style={{ fontWeight: 'bold' }}>Preference: </Text>{pretieScores.preference}, <Text style={{ fontWeight: 'bold' }}>Tolerance: </Text>{pretieScores.tolerance}</Text>
      <Text style={styles.section}><Text style={{ fontWeight: 'bold' }}>Matched Activities:</Text></Text>
      {activities.length > 0
        ? activities.map((a, i) => (
            <Text key={i} style={styles.activityItem}>
              {`${i + 1}. ${a['Activity Description']} (${a.METS} METs, ${a['Social Context']})`}
            </Text>
          ))
        : <Text>Loading...</Text>}
      <Button title="Debug Log" onPress={() => console.log(params)} />
    </ScrollView>
  );
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 14, textAlign: 'center' },
  section: { marginVertical: 6, fontSize: 15 },
  activityItem: { marginVertical: 4, fontSize: 15 },
});