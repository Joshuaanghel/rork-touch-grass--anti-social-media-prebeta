import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PersonalityType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/contexts/AppContext';

const colorOptions = [
  '#2ECC71',
  '#3498DB',
  '#9B59B6',
  '#E74C3C',
  '#F39C12',
  '#1ABC9C',
  '#E91E63',
  '#FF5722',
];

export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { personality } = useLocalSearchParams<{ personality: PersonalityType }>();
  const { saveProfile } = useApp();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleComplete = async () => {
    if (!name.trim()) {
      return;
    }

    console.log('CompleteProfile: Saving profile with personality:', personality);
    console.log('CompleteProfile: Saving profile with name:', name.trim());

    const profile = {
      id: Date.now().toString(),
      name: name.trim(),
      bio: bio.trim(),
      personalityType: personality,
      hobbies: [],
      color: selectedColor,
      trophies: [],
      handshakes: 0,
      grassPoints: 0,
      totalNetworkingTime: 0,
      networkingStats: {
        averageFriendsPerDay: 0,
        totalTimeThisWeek: 0,
        totalTimeThisMonth: 0,
        topLocations: [],
        sessionsCompleted: 0,
      },
      onboardingCompleted: true,
    };

    await AsyncStorage.setItem('friends', JSON.stringify([]));
    await AsyncStorage.setItem('events', JSON.stringify([]));
    
    await saveProfile(profile);
    
    console.log('CompleteProfile: Profile saved successfully');
    router.replace('/about-mission');
  };

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <User size={48} color={Colors.dark.primaryLight} />
            </View>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Let others know who you are when you connect
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.dark.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio (Optional)</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.dark.textTertiary}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Choose Your Color</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.completeButton, !name.trim() && styles.completeButtonDisabled]}
            onPress={handleComplete}
            disabled={!name.trim()}
          >
            <LinearGradient
              colors={
                name.trim()
                  ? [Colors.dark.primary, Colors.dark.primaryLight]
                  : [Colors.dark.backgroundTertiary, Colors.dark.backgroundTertiary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeButtonGradient}
            >
              <Text
                style={[
                  styles.completeButtonText,
                  !name.trim() && styles.completeButtonTextDisabled,
                ]}
              >
                Complete Profile
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  input: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark.text,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: Colors.dark.text,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  completeButtonTextDisabled: {
    color: Colors.dark.textTertiary,
  },
});
