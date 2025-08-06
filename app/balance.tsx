import Slider from '@react-native-community/slider';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function BalanceScreen() {
  const router = useRouter();
  const prevParams = useLocalSearchParams();

  const [confidence, setConfidence] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);

  const videoSource = require('C:/Users/udazken/passfit-app/assets/videos/One-Leg Stance Protocol.mp4');

  const handleNext = () => {
    if (confidence < 1) {
      Alert.alert(
        'Please complete the rating',
        'Please rate your confidence in completing the single-leg stand test before proceeding.'
      );
      return;
    }
    console.log('balance params:', {
    ...prevParams,
    balanceConfidence: confidence,
  });
  
    router.push({
      pathname: '/self-efficacy',
      params: {
        ...prevParams,
        balanceConfidence: confidence,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance</Text>
      <Text style={styles.subtitle}>
        Please watch the demonstration video below and then rate your confidence in performing the test.
      </Text>
      <Video
        source={videoSource}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        useNativeControls
        style={styles.video}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish) {
            setHasWatched(true);
          }
        }}
      />

      <Text style={styles.label}>
        How confident are you that you can stand on one leg for 10 seconds? (1 = Not confident at all, 5 = Very confident)
      </Text>
      <Slider
        style={{ width: '90%', height: 40 }}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={confidence}
        onValueChange={setConfidence}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1a9274"
      />
      <Text style={styles.valueLabel}>{confidence > 0 ? confidence : 'Please slide to rate'}</Text>

      <Button title="Next" onPress={handleNext} disabled={confidence < 1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  video: { width: 320, height: 180, backgroundColor: '#000', marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 8, textAlign: 'center' },
  valueLabel: { fontSize: 18, marginBottom: 24, color: '#1a9274' },
});
