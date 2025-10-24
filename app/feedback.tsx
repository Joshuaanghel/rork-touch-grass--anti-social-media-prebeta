import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  question: string;
  options: string[];
}

interface ShortResponseQuestion {
  type: 'short-response';
  question: string;
}

type Question = MultipleChoiceQuestion | ShortResponseQuestion;

const questions: Question[] = [
  {
    type: 'multiple-choice',
    question: 'Which feature are you most excited about?',
    options: ['Events', 'Handshakes', 'Friend Finder', 'Social Hotspots'],
  },
  {
    type: 'short-response',
    question: 'What would make Touch Grass a must-have app for you?',
  },
  {
    type: 'multiple-choice',
    question: 'How do you imagine using Touch Grass in your daily life?',
    options: [
      'Meeting new people at events',
      'Finding friends with similar interests',
      'Discovering cool spots nearby',
      'Breaking my phone addiction',
    ],
  },
  {
    type: 'short-response',
    question: 'If you could add ONE feature to Touch Grass, what would it be?',
  },
  {
    type: 'multiple-choice',
    question: 'What\'s your biggest challenge with current social apps?',
    options: [
      'Too much screen time',
      'Superficial connections',
      'Hard to meet people IRL',
      'Algorithm-driven content',
    ],
  },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleMultipleChoice = async (option: string) => {
    const newAnswers = { ...answers, [currentIndex]: option };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      await submitFeedback(newAnswers);
    } else {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const handleShortResponse = async () => {
    if (isLastQuestion) {
      await submitFeedback(answers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const submitFeedback = async (finalAnswers: Record<number, string>) => {
    try {
      const feedback = {
        answers: finalAnswers,
        submittedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('userFeedback', JSON.stringify(feedback));
      
      const currentCount = await AsyncStorage.getItem('userCount');
      const count = currentCount ? parseInt(currentCount, 10) : 0;
      await AsyncStorage.setItem('userCount', (count + 1).toString());
      
      router.replace('/waiting-room');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <Lightbulb size={36} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Help Us Build</Text>
          <Text style={styles.headerSubtitle}>Touch Grass</Text>
        </LinearGradient>

        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.accent]}
          style={[styles.contentContainer, { paddingBottom: insets.bottom }]}
        >
          <View style={styles.missionCard}>
            <Sparkles size={24} color={Colors.dark.primaryLight} />
            <Text style={styles.missionText}>
              You&apos;re not just testing — you&apos;re <Text style={styles.bold}>co-creating</Text> the anti-social media movement.
            </Text>
            <Text style={styles.missionSubtext}>
              Your insights will shape every feature, interaction, and experience.
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.type === 'multiple-choice' ? (
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      answers[currentIndex] === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleMultipleChoice(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        answers[currentIndex] === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                <TextInput
                  style={styles.textInput}
                  placeholder="Share your thoughts..."
                  placeholderTextColor={Colors.dark.textTertiary}
                  value={answers[currentIndex] || ''}
                  onChangeText={(text) =>
                    setAnswers({ ...answers, [currentIndex]: text })
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleShortResponse}
                  disabled={!answers[currentIndex]}
                >
                  <LinearGradient
                    colors={
                      answers[currentIndex]
                        ? ['#8B5CF6', '#7C3AED']
                        : [Colors.dark.backgroundSecondary, Colors.dark.backgroundSecondary]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.nextButtonGradient}
                  >
                    <Text
                      style={[
                        styles.nextButtonText,
                        !answers[currentIndex] && styles.nextButtonTextDisabled,
                      ]}
                    >
                      {isLastQuestion ? 'Complete & Unlock' : 'Next Question'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
  },
  missionCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 12,
  },
  missionText: {
    fontSize: 15,
    color: Colors.dark.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
  },
  missionSubtext: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressContainer: {
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primaryLight,
  },
  progressText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  questionCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 20,
  },
  questionText: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  optionButtonSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  optionText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 21,
  },
  optionTextSelected: {
    color: '#8B5CF6',
    fontWeight: '700' as const,
  },
  textInput: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark.text,
    minHeight: 120,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: Colors.dark.textTertiary,
  },
});
