import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();


// educationLevel
let educationLevelStr = '';
if (typeof params.educationLevel === 'string') {
  educationLevelStr = params.educationLevel;
} else if (Array.isArray(params.educationLevel) && params.educationLevel.length > 0) {
  educationLevelStr = params.educationLevel[0];
}
const higherEd = ['bachelor', 'master', 'phd'];
const flagEducation = higherEd.includes(educationLevelStr) ? 0 : 1;
const msgEducation = flagEducation
  ? "Education: No bachelor's degree or higher. (Likely dropout risk)"
  : "Education: Bachelor's degree or higher. (No risk)";

// unmetPAG
const unmetPAGVal =
  typeof params.unmetPAG === 'string'
    ? params.unmetPAG
    : Array.isArray(params.unmetPAG)
    ? params.unmetPAG[0]
    : params.unmetPAG;

const flagPAG = Number(unmetPAGVal) === 1 ? 1 : 0;
const msgPAG = flagPAG
  ? "Physical Activity: Below recommended 150 min/week. (Likely dropout risk)"
  : "Physical Activity: Meets recommended level. (No risk)";

// 3. CRF - Jurca formula (original version)
const sex = params.sex;
const age = params.age ? parseInt(params.age as string) : null;
const bmi = params.bmi ? parseFloat(params.bmi as string) : null;
const restingHR = params.restingHeartRate ? parseFloat(params.restingHeartRate as string) : null;
const physicalActivityMinutes = params.physicalActivityMinutes ? parseFloat(params.physicalActivityMinutes as string) : null;

let crfScore: number | null = null;
if (sex && age !== null && bmi !== null && restingHR !== null && physicalActivityMinutes !== null) {
  const sexConst = sex === 'Male' ? 2.77 : 0;
  const ageConst = 0.10 * age!;
  const bmiConst = 0.17 * bmi!;
  const rhrConst = 0.03 * restingHR!;
  const activityConst = physicalActivityMinutes! >= 150 ? 1 : 0;

  crfScore = 18.07 + sexConst - ageConst - bmiConst - rhrConst + activityConst;
}

const flagCRF = crfScore !== null && crfScore < 7 ? 1 : 0;
const msgCRF = crfScore !== null
  ? (flagCRF
      ? `CRF: Estimated fitness score = ${crfScore.toFixed(1)} METs. (Below recommended level, likely dropout risk)`
      : `CRF: Estimated fitness score = ${crfScore.toFixed(1)} METs. (Healthy range, no risk)`)
  : "CRF: Insufficient data to calculate. (No flag)";



  // 4. Balance Confidence
  const balanceConfidence = params.balanceConfidence ? parseInt(params.balanceConfidence as string) : null;
  const flagBalance = balanceConfidence !== null && balanceConfidence < 3 ? 1 : 0;
  const msgBalance = flagBalance
    ? "Balance Confidence: Low confidence. (Likely dropout risk)"
    : "Balance Confidence: Normal or above. (No risk)";

  // 5. Self-efficacy
  let selfEfficacyAnswers: number[] = [];
  try {
    selfEfficacyAnswers = params.selfEfficacyAnswers
      ? JSON.parse(params.selfEfficacyAnswers as string).map((x: string | number) => Number(x))
      : [];
  } catch {
    selfEfficacyAnswers = [];
  }
  const seMean = selfEfficacyAnswers.length
    ? selfEfficacyAnswers.reduce((a, b) => a + b, 0) / selfEfficacyAnswers.length
    : null;
  const flagSE = seMean !== null && seMean < 60 ? 1 : 0;
  const msgSE = flagSE
    ? "Self-Efficacy: Average confidence <60%. (Likely dropout risk)"
    : "Self-Efficacy: Good confidence. (No risk)";

  // 6. GDS
  let gdsAnswers: number[] = [];
  try {
    gdsAnswers = params.gdsAnswers
      ? JSON.parse(params.gdsAnswers as string).map((x: string | number) => Number(x))
      : [];
  } catch {
    gdsAnswers = [];
  }
  const gdsScore = gdsAnswers.reduce((a, b) => a + b, 0);
  const flagGDS = gdsScore > 1 ? 1 : 0;
  const msgGDS = flagGDS
    ? `GDS: Depression score >1 (${gdsScore}). (Likely dropout risk)`
    : "GDS: No significant depression. (No risk)";

  // 7. Memory / Forgetting
  const forgetting = params.forgetting ? parseInt(params.forgetting as string) : null;
  const flagMemory = forgetting !== null && forgetting > 6 ? 1 : 0;
  const msgMemory = flagMemory
    ? "Memory: Forgetfulness score >6. (Likely dropout risk)"
    : "Memory: No memory risk. (No risk)";


  const flagList = [
    flagEducation,
    flagPAG,
    flagCRF,
    flagBalance,
    flagSE,
    flagGDS,
    flagMemory,
  ];
  const riskCount = flagList.filter(f => f === 1).length;


  console.log("Dropout Calculation Details:");
  console.log(msgEducation);
  console.log(msgPAG);
  console.log(msgCRF);
  console.log(msgBalance);
  console.log(msgSE);
  console.log(msgGDS);
  console.log(msgMemory);
  console.log("Dropout Risk Flag List:", flagList, "Total Risk Count:", riskCount);

  // output
let overallMsg = '';
if (riskCount === 0) {
  overallMsg = "Great job! Based on your responses, you are currently meeting key public health guidelines. Keep up your healthy habits!";
} else if (riskCount === 1) {
  overallMsg = "Based on your responses, we noticed a few areas where you could benefit from additional support or resources. Small changes can make a big difference.";
} else if (riskCount <= 3) {
  overallMsg = "Your responses suggest several areas that may benefit from attention. Making improvements in these areas can enhance your health and wellbeing.";
} else {
  overallMsg = "We recommend discussing your results with a health professional, who can help you set goals and connect with helpful resources.";
}


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dropout Risk Summary</Text>
      <Text style={styles.overall}>{overallMsg}</Text>

      <View style={{ marginTop: 40 }}>
        <Button
          title="See My Recommendations"
          onPress={() => {
            router.push({
              pathname: '/recommendation',
              params: { ...params }
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 24 },
  overall: { fontSize: 19, fontWeight: 'bold', color: '#1565c0', marginTop: 14, textAlign: 'center' },
});
