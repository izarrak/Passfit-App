import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

// PRETIE-Q Questionnaire
const pretieQuestions = [
  "Feeling tired during exercise is my signal to slow down or stop.",
  "I would rather work out at low intensity levels for a long duration than at high-intensity levels for a short duration.",
  "During exercise, if my muscles begin to burn excessively or if I find myself breathing very hard, it is time for me to ease off.",
  "I'd rather go slow during my workout, even if that means taking more time.",
  "While exercising, I try to keep going even after I feel exhausted.",
  "I would rather have a short, intense workout than a long, low-intensity workout.",
  "I block out the feeling of fatigue when exercising.",
  "When I exercise, I usually prefer a slow, steady pace.",
  "I'd rather slow down or stop when a workout starts to get too tough.",
  "Exercising at a low intensity does not appeal to me at all.",
  "Fatigue is the last thing that affects when I stop a workout; I have a goal and stop only when I reach it.",
  "While exercising, I prefer activities that are slow-paced and do not require much exertion.",
  "When my muscles start burning during exercise, I usually ease off some.",
  "The faster and harder the workout, the more pleasant I feel.",
  "I always push through muscle soreness and fatigue when working out.",
  "Low-intensity exercise is boring."
];

// Likert anchor labels
const likertLabels = [
  "1\nI totally disagree",
  "2\nI disagree",
  "3\nI neither agree nor disagree",
  "4\nI agree",
  "5\nI totally agree"
];

const TOTAL_QUESTIONS = pretieQuestions.length + 1; // 16 questions + 1 buddy

export default function PreferencesScreen() {
  const router = useRouter();
  const demographics = useLocalSearchParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [pretieAnswers, setPretieAnswers] = useState<string[]>(Array(16).fill(""));

  // Buddy support
  const [buddySupportType, setBuddySupportType] = useState<string | null>(null); // 'social' | 'solo' | 'none'
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [buddy, setBuddy] = useState(null);
  const [buddyItems, setBuddyItems] = useState([
    { label: 'Family', value: 'family' },
    { label: 'Friend', value: 'friend' },
    { label: 'Coach/Instructor', value: 'coach' },
    { label: 'Healthcare Provider', value: 'healthcare' },
    { label: 'No one', value: 'none' },
    { label: 'Other', value: 'other' },
  ]);

  const handleLikertChange = (value: string) => {
    const updated = [...pretieAnswers];
    updated[currentPage] = value;
    setPretieAnswers(updated);
  };

  const goNext = () => setCurrentPage((prev) => prev + 1);
  const goBack = () => setCurrentPage((prev) => prev - 1);

  let canProceed = false;
  if (currentPage < 16) {
    canProceed = !!pretieAnswers[currentPage];
  } else if (currentPage === 16) {
    if (buddySupportType === 'solo' || buddySupportType === 'none') canProceed = true;
    if (buddySupportType === 'social' && !!buddy) canProceed = true;
  }

  const handleSubmit = () => {
    let finalBuddy: string | null = buddy;
    if (buddySupportType === 'solo' || buddySupportType === 'none') finalBuddy = 'none';

    console.log('preferences params:', {
      ...demographics,
      pretieAnswers: JSON.stringify(pretieAnswers),
      buddySupportType,
      buddy: finalBuddy,
    });

    router.push({
      pathname: '/physical-activity',
      params: {
        ...demographics,
        pretieAnswers: JSON.stringify(pretieAnswers),
        buddySupportType,
        buddy: finalBuddy,
      },
    });
  };

  const progress = (currentPage + 1) / TOTAL_QUESTIONS;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentPage + 1} / {TOTAL_QUESTIONS}
            </Text>
          </View>

          {currentPage < 16 && (
            <View>
              <Text style={styles.title}>Exercise Preference</Text>
              <Text style={styles.questionText}>{pretieQuestions[currentPage]}</Text>
              <LikertRow
                value={pretieAnswers[currentPage]}
                onChange={handleLikertChange}
              />
            </View>
          )}

          {currentPage === 16 && (
            <View>
              <Text style={styles.title}>Buddy Support</Text>
              <Text style={styles.questionText}>
                How do you prefer to exercise?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20, gap: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.likertOption,
                    buddySupportType === 'social' && styles.likertOptionSelected,
                  ]}
                  onPress={() => setBuddySupportType('social')}
                >
                  <Text style={styles.likertOptionText}>Social</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.likertOption,
                    buddySupportType === 'solo' && styles.likertOptionSelected,
                  ]}
                  onPress={() => setBuddySupportType('solo')}
                >
                  <Text style={styles.likertOptionText}>Solo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.likertOption,
                    buddySupportType === 'none' && styles.likertOptionSelected,
                  ]}
                  onPress={() => setBuddySupportType('none')}
                >
                  <Text style={styles.likertOptionText}>No Preference</Text>
                </TouchableOpacity>
              </View>

              {buddySupportType === 'social' && (
                <>
                  <Text style={styles.questionText}>
                    Who supports or motivates your exercise?
                  </Text>
                  <DropDownPicker
                    open={buddyOpen}
                    value={buddy}
                    items={buddyItems}
                    setOpen={setBuddyOpen}
                    setValue={setBuddy}
                    setItems={setBuddyItems}
                    placeholder="Select who supports you"
                    zIndex={2000}
                    style={{ marginBottom: 16 }}
                  />
                </>
              )}
            </View>
          )}

          <View style={styles.buttonRow}>
            {currentPage > 0 && (
              <Button title="Back" onPress={goBack} />
            )}
            {currentPage < TOTAL_QUESTIONS - 1 ? (
              <Button title="Next" onPress={goNext} disabled={!canProceed} />
            ) : (
              <Button title="Submit" onPress={handleSubmit} disabled={!canProceed} />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Likert Row
function LikertRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View style={styles.likertRow}>
      {likertLabels.map((label, idx) => {
        const optVal = (idx + 1).toString();
        return (
          <TouchableOpacity
            key={optVal}
            style={[
              styles.likertOption,
              value === optVal && styles.likertOptionSelected,
            ]}
            onPress={() => onChange(optVal)}
          >
            <Text style={styles.likertOptionText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
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
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  likertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  likertOption: {
    width: 80,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    padding: 2,
  },
  likertOptionSelected: {
    backgroundColor: '#007bff',
  },
  likertOptionText: {
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
});
