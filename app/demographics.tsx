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
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function DemographicsScreen() {
  const router = useRouter();
  const { version } = useLocalSearchParams(); 
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [studyID, setStudyID] = useState('');
  const [institution, setInstitution] = useState('');

  const [openDropdown, setOpenDropdown] = useState<'race' | 'education' | null>(null);

  const [raceValue, setRaceValue] = useState(null);
  const [raceItems, setRaceItems] = useState([
    { label: 'Asian', value: 'asian' },
    { label: 'Black or African American', value: 'black' },
    { label: 'Hispanic or Latino', value: 'hispanic' },
    { label: 'White', value: 'white' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'no_answer' },
  ]);

  const [educationLevel, setEducationLevel] = useState(null);
  const [educationItems, setEducationItems] = useState([
    { label: 'No formal education', value: 'none' },
    { label: 'Some high school', value: 'some_hs' },
    { label: 'High school graduate', value: 'hs_grad' },
    { label: 'Some college', value: 'some_college' },
    { label: 'Bachelor’s degree', value: 'bachelor' },
    { label: 'Master’s degree', value: 'master' },
    { label: 'Doctoral degree', value: 'phd' },
    { label: 'Prefer not to say', value: 'no_answer' },
  ]);

  const canProceed = studyID && institution && age && sex && raceValue && educationLevel;

  const handleCloseDropdown = () => setOpenDropdown(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); handleCloseDropdown(); }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>Demographic Information</Text>

          <Text style={styles.label}>Study ID</Text>
          <TextInput
            style={styles.input}
            value={studyID}
            onChangeText={setStudyID}
            placeholder="Enter Study ID"
            returnKeyType="done"
          />

          <Text style={styles.label}>Affiliated Institution</Text>
          <TextInput
            style={styles.input}
            value={institution}
            onChangeText={setInstitution}
            placeholder="e.g. University of Illinois"
            returnKeyType="done"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Sex</Text>
          <View style={styles.radioGroup}>
            {['Female', 'Male', 'Prefer not to say'].map((option) => (
              <View key={option} style={styles.radioOption}>
                <Text
                  style={styles.radioText}
                  onPress={() => setSex(option)}
                >
                  {sex === option ? '🔘' : '⚪'} {option}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Race / Ethnicity</Text>
          <DropDownPicker
            open={openDropdown === 'race'}
            value={raceValue}
            items={raceItems}
            setOpen={() => setOpenDropdown(openDropdown === 'race' ? null : 'race')}
            setValue={setRaceValue}
            setItems={setRaceItems}
            placeholder="Select your race/ethnicity"
            style={{ marginBottom: 26 }}
            dropDownContainerStyle={{ zIndex: 3000 }}
            zIndex={3000}
            zIndexInverse={1000}
            onOpen={() => setOpenDropdown('race')}
            onClose={handleCloseDropdown}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
          />

          <Text style={styles.label}>Education Level</Text>
          <DropDownPicker
            open={openDropdown === 'education'}
            value={educationLevel}
            items={educationItems}
            setOpen={() => setOpenDropdown(openDropdown === 'education' ? null : 'education')}
            setValue={setEducationLevel}
            setItems={setEducationItems}
            placeholder="Select your education level"
            style={{ marginBottom: 30 }}
            dropDownContainerStyle={{ zIndex: 2000 }}
            zIndex={2000}
            zIndexInverse={1000}
            onOpen={() => setOpenDropdown('education')}
            onClose={handleCloseDropdown}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
          />

          <Button
            title="Next"
            onPress={() => {
              if (!canProceed) {
                alert("Please complete all fields!");
                return;
              }
              console.log('demographics params:', {
                studyID,
                institution,
                age,
                sex,
                race: raceValue,
                educationLevel,
                version, // debug log
              });
              router.push({
                pathname: '/preferences',
                params: {
                  studyID,
                  institution,
                  age,
                  sex,
                  race: raceValue,
                  educationLevel,
                  version, 
                },
              });
            }}
            disabled={!canProceed}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  radioGroup: {
    marginBottom: 10,
  },
  radioOption: {
    marginVertical: 4,
  },
  radioText: {
    fontSize: 16,
  },
});
