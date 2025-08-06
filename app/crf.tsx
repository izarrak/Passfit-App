import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CRFScreen() {
  const router = useRouter();

  const prevParams = useLocalSearchParams();

  const [page, setPage] = useState(1);

  // Unit toggle
  const [isMetric, setIsMetric] = useState(true);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [bmiCalculated, setBMICalculated] = useState(false);

  // Activity Picker
  const [activityLevel, setActivityLevel] = useState(null);
  const [activityOptionsOpen, setActivityOptionsOpen] = useState(false);
  const [activityOptions, setActivityOptions] = useState([
    { label: 'Sedentary (little or no activity)', value: 'sedentary' },
    { label: 'Light (1-2 days/week, easy pace)', value: 'light' },
    { label: 'Moderate (3-4 days/week, can speak comfortably)', value: 'moderate' },
    { label: 'Vigorous (5+ days/week, out of breath at times)', value: 'vigorous' },
   { label: 'Very Vigorous (intense, athletic training)', value: 'veryVigorous' },
  ]);

  // Page 2: Resting HR
  const [rhr, setRHR] = useState('');
  const [timer, setTimer] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  // measurement convertion 
  const handleToggleUnit = () => {
    if (height && weight) {
      if (isMetric) {
        // cm/kg => in/lb
        const h = parseFloat(height);
        const w = parseFloat(weight);
        setHeight((h / 2.54).toFixed(2));
        setWeight((w * 2.20462).toFixed(2));
      } else {
        // in/lb => cm/kg
        const h = parseFloat(height);
        const w = parseFloat(weight);
        setHeight((h * 2.54).toFixed(2));
        setWeight((w / 2.20462).toFixed(2));
      }
    }
    setIsMetric(!isMetric);
    setBMI(null);
    setBMICalculated(false);
  };

  // BMI calculation
  const handleCalculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    let bmiVal: number | null = null;
    if (isMetric && h > 0) {
      // height: cm, weight: kg
      bmiVal = w / Math.pow(h / 100, 2);
    } else if (!isMetric && h > 0) {
      // height: in, weight: lb
      bmiVal = (w / Math.pow(h, 2)) * 703;
    }
    if (bmiVal && !isNaN(bmiVal)) {
      setBMI(Number(bmiVal.toFixed(1)));
      setBMICalculated(true);
    } else {
      setBMI(null);
      setBMICalculated(false);
    }
  };


  const handleNext = () => {
    if (!height || !weight || !activityLevel) {
      alert('Please enter valid height, weight, and activity level.');
      return;
    }
    setPage(2);
  };

  // Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCounting && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (isCounting && timer === 0) {
      setIsCounting(false);
      if (page === 2) {
        Alert.alert('Time is up!', 'Please enter the number of beats you counted.');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounting, timer, page]);

  const handleStartTimer = () => {
    setTimer(30);
    setIsCounting(true);
  };

  const handleSubmit = () => {
    const r = parseInt(rhr);
    if (isNaN(r) || r <= 0) {
      alert('Please enter a valid resting heart rate.');
      return;
    }
    console.log('crf params:', {
    ...prevParams,
    height,
    weight,
    bmi: bmi ? bmi.toString() : '',
    isMetric: isMetric ? '1' : '0',
    activityLevel,
    restingHeartRate: r,
  });

    router.push({
      pathname: '/balance',
      params: {
        ...prevParams,
        height,
        weight,
        bmi: bmi ? bmi.toString() : '',
        isMetric: isMetric ? '1' : '0',
        activityLevel,
        restingHeartRate: r,
      },
    });
  };

  // ------------------- UI -------------------

  // PAGE 1
  if (page === 1) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Personal Assessment</Text>
            <Text style={styles.introText}>
              We will now guide you through calculating your Cardiorespiratory Fitness (CRF).
              CRF is an indicator of how well your body can supply oxygen to your muscles during physical activity.
            </Text>

            <View style={styles.toggleRow}>
              <Text style={styles.label}>Unit:</Text>
              <Text style={{ marginRight: 8 }}>{isMetric ? "cm/kg" : "in/lb"}</Text>
              <Switch
                value={!isMetric}
                onValueChange={handleToggleUnit}
                thumbColor="#2196f3"
              />
              <Text>{isMetric ? "in/lb" : "cm/kg"}</Text>
            </View>

            <Text style={styles.label}>
              Height ({isMetric ? "cm" : "inches"})
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder={isMetric ? "e.g. 170" : "e.g. 67"}
              returnKeyType="done"
            />

            <Text style={styles.label}>
              Weight ({isMetric ? "kg" : "lb"})
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder={isMetric ? "e.g. 65" : "e.g. 143"}
              returnKeyType="done"
            />

            <Button title="Calculate BMI" onPress={handleCalculateBMI} />

            {bmiCalculated && (
              <Text style={styles.bmiText}>
                Your BMI: {bmi}
              </Text>
            )}

            {/* Activity Picker */}
            <Text style={styles.label}>Activity Level</Text>
            <View style={{ zIndex: 2000, marginBottom: activityOptionsOpen ? 200 : 20 }}>
              <DropDownPicker
                open={activityOptionsOpen}
                value={activityLevel}
                items={activityOptions}
                setOpen={setActivityOptionsOpen}
                setValue={setActivityLevel}
                setItems={setActivityOptions}
                placeholder="Select activity level"
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>

            <Button title="Next" onPress={handleNext} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }

// PAGE 2
if (page === 2) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Resting Heart Rate Measurement</Text>

          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            <Image
              source={require("C:/Users/udazken/passfit-app/assets/images/rhr.jpg")}
              style={{ width: 250, height: 190, borderRadius: 1, backgroundColor: '#e0e0e0' }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionTitle}>How to Measure Your Resting Heart Rate:</Text>
          <Text style={styles.instruction}>
            1. Sit down and relax for at least 5 minutes.{"\n"}
            2. Place two fingers on your wrist, just below your thumb.{"\n"}
            3. When you are ready, tap "Start Timer" and count your heart beats for 30 seconds.{"\n"}
            4. Enter the number you counted in the field below.
          </Text>

          <View style={styles.timerRow}>
            <Button title="Start Timer" onPress={handleStartTimer} disabled={isCounting} />
            {isCounting && (
              <Text style={styles.timerText}>{timer} s</Text>
            )}
          </View>

          <Text style={styles.label}>Resting Heart Rate (beats in 30 seconds)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rhr}
            onChangeText={setRHR}
            placeholder="e.g. 34"
            returnKeyType="done"
          />

          {/* 自动计算并显示每分钟bpm */}
          {rhr && !isNaN(Number(rhr)) && (
            <Text style={styles.bmiText}>
              Calculated Resting Heart Rate (beats per minute): {Number(rhr) * 2}
            </Text>
          )}

          <Button title="Next" onPress={handleSubmit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}


  return null;
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 15,
    marginBottom: 18,
    color: '#374151',
    textAlign: 'center'
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  bmiText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 8,
    marginBottom: 16,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
    color: '#1a237e',
  },
  instruction: {
    fontSize: 15,
    marginBottom: 12,
    color: '#374151',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  timerText: {
    marginLeft: 14,
    fontSize: 20,
    color: '#e53935',
    fontWeight: 'bold',
  },
});
