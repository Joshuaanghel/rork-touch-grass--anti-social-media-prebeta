import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Sparkles, 
  Eye, 
  Users, 
  MapPin, 
  Calendar, 
  Send, 
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  Lightbulb,
  Heart,
  Brain
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TARGET_USERS = 5000;

const features = [
  {
    id: 'ai-matching',
    name: 'AI Matching',
    icon: Sparkles,
    colors: ['#8B5CF6', '#7C3AED'] as const,
  },
  {
    id: 'go-visible',
    name: 'Go Visible',
    icon: Eye,
    colors: ['#EC4899', '#DB2777'] as const,
  },
  {
    id: 'handshakes',
    name: 'Handshakes',
    icon: Users,
    colors: ['#F59E0B', '#D97706'] as const,
  },
  {
    id: 'hotspots',
    name: 'Social Hotspots',
    icon: MapPin,
    colors: ['#06B6D4', '#0891B2'] as const,
  },
  {
    id: 'events',
    name: 'Events',
    icon: Calendar,
    colors: ['#A855F7', '#9333EA'] as const,
  },
  {
    id: 'ripple-invites',
    name: 'Ripple Invites',
    icon: Send,
    colors: ['#EC4899', '#DB2777'] as const,
  },
  {
    id: 'trophies',
    name: 'Points & Trophies',
    icon: Zap,
    colors: ['#10B981', '#059669'] as const,
  },
] as const;

export default function WaitingRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const [userCount, setUserCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasCompletedFeedback, setHasCompletedFeedback] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('WaitingRoom: Focus effect triggered, profile:', profile?.personalityType);
      loadUserCount();
      checkFeedbackStatus();
    }, [profile])
  );

  const checkFeedbackStatus = async () => {
    try {
      const feedback = await AsyncStorage.getItem('userFeedback');
      setHasCompletedFeedback(!!feedback);
    } catch (error) {
      console.error('Error checking feedback status:', error);
    }
  };

  const loadUserCount = async () => {
    try {
      const count = await AsyncStorage.getItem('userCount');
      const currentCount = count ? parseInt(count, 10) : 0;
      setUserCount(currentCount);
      setIsUnlocked(currentCount >= TARGET_USERS);
    } catch (error) {
      console.error('Error loading user count:', error);
    }
  };

  const progressPercentage = Math.min((userCount / TARGET_USERS) * 100, 100);

  const handleFeaturePress = (featureId: string) => {
    router.push(`/feature/${featureId}` as any);
  };

  const handleUnlock = () => {
    router.replace('/(tabs)/touch-grass');
  };

  const handleProfilePress = () => {
    router.push('/personality-details');
  };

  const handleResetOnboarding = async () => {
    try {
      console.log('Resetting all onboarding data...');
      await AsyncStorage.clear();
      console.log('All data cleared, navigating to onboarding');
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent]}
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hello</Text>
              <Text style={styles.greetingName}>{profile.name}</Text>
            </View>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            
            <TouchableOpacity style={styles.personalityCircle} onPress={handleProfilePress}>
              <LinearGradient
                colors={['#EC4899', '#8B5CF6', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.personalityCircleGradient}
              >
                <View style={styles.personalityCircleInner}>
                  <Brain size={48} color="#FFFFFF" />
                  <Text style={styles.personalityLabel}>YOUR TYPE</Text>
                  <Text style={styles.personalityType}>{profile.personalityType}</Text>
                  <Text style={styles.tapToLearn}>Tap to Learn More</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.explorerButton}
            onPress={() => router.push('/personality-explorer')}
          >
            <LinearGradient
              colors={['#EC4899', '#8B5CF6', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.explorerGradient}
            >
              <Heart size={28} color="#FFFFFF" />
              <View style={styles.explorerContent}>
                <Text style={styles.explorerTitle}>Explore Personality Types</Text>
                <Text style={styles.explorerSubtext}>
                  Discover who you&apos;ll connect with
                </Text>
              </View>
              <ChevronRight size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.counterSection}>
            <View style={styles.counterCard}>
              {isUnlocked ? (
                <Unlock size={48} color={Colors.dark.primaryLight} />
              ) : (
                <Lock size={48} color={Colors.dark.textSecondary} />
              )}
              
              <Text style={styles.counterTitle}>
                {isUnlocked ? 'App Unlocked!' : 'Unlocking Soon'}
              </Text>
              
              <View style={styles.counterDisplay}>
                <Text style={styles.counterNumber}>{userCount}</Text>
                <Text style={styles.counterDivider}>/</Text>
                <Text style={styles.counterTarget}>{TARGET_USERS}</Text>
              </View>

              <Text style={styles.counterSubtitle}>
                {isUnlocked 
                  ? 'Thank you for being part of our community!' 
                  : 'users needed to unlock'}
              </Text>

              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                />
              </View>

              {!isUnlocked && (
                <Text style={styles.shareMessage}>
                  Share Touch Grass with your friends to unlock faster!
                </Text>
              )}

              {isUnlocked && (
                <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
                  <LinearGradient
                    colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.unlockButtonGradient}
                  >
                    <Text style={styles.unlockButtonText}>Enter Touch Grass</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Explore Features</Text>
            <Text style={styles.sectionSubtitle}>
              Learn what makes Touch Grass special
            </Text>

            <View style={styles.featuresGrid}>
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <TouchableOpacity
                    key={feature.id}
                    style={styles.featureIcon}
                    onPress={() => handleFeaturePress(feature.id)}
                  >
                    <LinearGradient
                      colors={feature.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.featureIconGradient}
                    >
                      <Icon size={32} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.featureIconLabel}>{feature.name}</Text>
                    <ChevronRight size={20} color={Colors.dark.textTertiary} style={styles.chevron} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {!hasCompletedFeedback && (
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => router.push('/feedback')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.feedbackGradient}
              >
                <Lightbulb size={48} color="#FFFFFF" />
                <Text style={styles.feedbackTitle}>Help Us Build Touch Grass</Text>
                <Text style={styles.feedbackSubtext}>
                  Share your insights to unlock the app faster
                </Text>
                <View style={styles.feedbackCta}>
                  <Text style={styles.feedbackCtaText}>Start Building</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {hasCompletedFeedback && (
            <View style={styles.thankYouCard}>
              <Sparkles size={32} color={Colors.dark.primaryLight} />
              <Text style={styles.thankYouTitle}>Thank You for Building with Us!</Text>
              <Text style={styles.thankYouText}>
                Your feedback has been recorded. You&apos;ve helped shape the future of Touch Grass.
              </Text>
            </View>
          )}

          <Modal
            visible={showAIModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAIModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowAIModal(false)}
            >
              <TouchableOpacity
                style={styles.modalContent}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalHeader}
                >
                  <Brain size={40} color="#FFFFFF" />
                  <Text style={styles.modalTitle}>AI-Adaptive Assessment</Text>
                </LinearGradient>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
                  <Text style={styles.modalSectionTitle}>How It Works</Text>
                  <Text style={styles.modalText}>
                    Our personality test uses advanced artificial intelligence to truly understand who you are. Unlike traditional tests with fixed questions, our AI adapts in real-time based on your responses.
                  </Text>

                  <Text style={styles.modalSectionTitle}>Why This Matters</Text>
                  <Text style={styles.modalText}>
                    • The AI analyzes patterns in your answers to ask more relevant follow-up questions
                  </Text>
                  <Text style={styles.modalText}>
                    • Each question is designed to reveal different aspects of your personality
                  </Text>
                  <Text style={styles.modalText}>
                    • The test is completely unbiased - all personality types have equal probability
                  </Text>
                  <Text style={styles.modalText}>
                    • Results are based on your authentic responses, not predetermined paths
                  </Text>

                  <Text style={styles.modalSectionTitle}>Accurate Matching</Text>
                  <Text style={styles.modalText}>
                    Understanding your true personality allows Touch Grass to connect you with compatible people nearby. The more accurate your assessment, the better your real-world connections will be.
                  </Text>

                  <Text style={styles.modalSectionTitle}>Your Privacy</Text>
                  <Text style={styles.modalText}>
                    Your responses are analyzed securely and used only to determine your personality type. We never share your individual answers.
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAIModal(false)}
                >
                  <Text style={styles.modalCloseText}>Got it!</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <View style={styles.missionCard}>
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.missionGradient}
            >
              <Text style={styles.missionTitle}>Our Mission</Text>
              <Text style={styles.missionText}>
                Get you outside, meeting amazing people nearby.
              </Text>
              <View style={styles.missionDivider} />
              <Text style={styles.missionManifesto}>
                No endless scrolling. No fake followers.
              </Text>
              <Text style={styles.missionManifesto}>
                Just real connections with real people.
              </Text>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={handleResetOnboarding}>
            <Text style={styles.demoButtonText}>🔄 Restart Onboarding (Demo)</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  greetingContainer: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.5,
  },
  greetingName: {
    fontSize: 40,
    fontWeight: '900' as const,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  bio: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  personalityCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginTop: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  personalityCircleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    padding: 6,
  },
  personalityCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  personalityLabel: {
    fontSize: 11,
    color: Colors.dark.textTertiary,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  personalityType: {
    fontSize: 22,
    color: Colors.dark.text,
    fontWeight: '900' as const,
    textAlign: 'center',
    lineHeight: 28,
  },
  tapToLearn: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  counterSection: {
    alignItems: 'center',
  },
  counterCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  counterTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  counterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  counterNumber: {
    fontSize: 56,
    fontWeight: '900' as const,
    color: Colors.dark.primaryLight,
  },
  counterDivider: {
    fontSize: 40,
    color: Colors.dark.textTertiary,
  },
  counterTarget: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
  },
  counterSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  shareMessage: {
    fontSize: 14,
    color: Colors.dark.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  unlockButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  unlockButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  featuresSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresGrid: {
    gap: 12,
  },
  featureIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 16,
  },
  featureIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  chevron: {
    opacity: 0.5,
  },
  missionCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  missionGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  missionTitle: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  missionText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
  missionDivider: {
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  missionManifesto: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  demoButton: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  feedbackButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  feedbackGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  feedbackSubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  feedbackCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  feedbackCtaText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  thankYouCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  explorerButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  explorerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 16,
  },
  explorerContent: {
    flex: 1,
    gap: 4,
  },
  explorerTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  explorerSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
    maxHeight: 400,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  modalCloseButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  modalCloseText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
