import { Button, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PASSFIT!</Text>
      <Text style={styles.subtitle}>Your personalized behavior feedback app.</Text>
      <Button
        title="Start"
        onPress={() => navigation.navigate('Demographics')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  }
});
