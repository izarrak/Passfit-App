import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = (version: 'demo' | 'research') => {
    router.push(`/demographics?version=${version}`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('C:/Users/udazken/passfit-app/assets/images/PASSFIT Profile.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to PASSFIT!</Text>
      <Text style={styles.subtitle}>
        Your personalized behavior feedback app.
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Start Demo Version" onPress={() => handleStart('demo')} />
        <View style={{ height: 12 }} />
        <Button title="Start Research Version" onPress={() => handleStart('research')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonGroup: {
    width: '100%',
    paddingHorizontal: 20,
  },
});
