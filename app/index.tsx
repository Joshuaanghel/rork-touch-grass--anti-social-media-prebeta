import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const router = useRouter();
  const { profile, isLoading, isInitialized, reloadData } = useApp();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Index screen focused, reloading data');
      reloadData();
    }, [reloadData])
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let mounted = true;
    
    const checkNavigation = async () => {
      if (isInitialized && !isLoading && mounted) {
        console.log('Index screen - initialized, profile:', profile);
        
        try {
          if (profile && profile.onboardingCompleted) {
            console.log('Profile exists and onboarding completed');
            
            const feedbackData = await AsyncStorage.getItem('userFeedback');
            
            if (!mounted) return;
            
            timeoutId = setTimeout(() => {
              if (!mounted) return;
              if (feedbackData) {
                console.log('Feedback completed, going to waiting room');
                router.replace('/waiting-room');
              } else {
                console.log('No feedback yet, going to waiting room');
                router.replace('/waiting-room');
              }
            }, 100);
          } else {
            console.log('No profile or onboarding not completed, going to onboarding');
            timeoutId = setTimeout(() => {
              if (!mounted) return;
              router.replace('/onboarding');
            }, 100);
          }
        } catch (error) {
          console.error('Navigation error:', error);
          if (!mounted) return;
          timeoutId = setTimeout(() => {
            if (!mounted) return;
            router.replace('/onboarding');
          }, 100);
        }
      }
    };
    
    checkNavigation();
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitialized, isLoading, profile, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.dark.primaryLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
});
