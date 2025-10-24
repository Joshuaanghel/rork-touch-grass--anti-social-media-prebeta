import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Sparkles, Users, Zap, Award, MapPin, TrendingUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const SOCIAL_HOTSPOTS = [
  { name: 'Central Park', bonus: '2x', icon: '🌳' },
  { name: 'Coffee District', bonus: '2x', icon: '☕' },
  { name: 'University Campus', bonus: '2x', icon: '🎓' },
  { name: 'Downtown Plaza', bonus: '2x', icon: '🏛️' },
  { name: 'Beach Boardwalk', bonus: '2x', icon: '🏖️' },
];

export default function TouchGrassScreen() {
  const { isNetworkingMode, toggleNetworkingMode, profile } = useApp();
  const insets = useSafeAreaInsets();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [sessionTime, setSessionTime] = useState(0);
  const [currentHotspot] = useState(SOCIAL_HOTSPOTS[Math.floor(Math.random() * SOCIAL_HOTSPOTS.length)]);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const weeklyTime = profile?.networkingStats?.totalTimeThisWeek || 0;

  useEffect(() => {
    if (isNetworkingMode) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
      rotateAnim.setValue(0);
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      setSessionTime(0);
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isNetworkingMode, pulseAnim, glowAnim, rotateAnim]);

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    toggleNetworkingMode();
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(46, 204, 113, 0)', 'rgba(46, 204, 113, 0.3)'],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handshakes = profile?.handshakes || 0;
  const grassPoints = profile?.grassPoints || 0;
  const lockedTrophies = profile?.trophies?.filter(t => !t.isUnlocked) || [];

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.missionCard}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.15)', 'rgba(46, 204, 113, 0.15)', 'rgba(0, 255, 136, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.missionGradient}
          >
            <Sparkles size={18} color={Colors.dark.primaryLight} />
            <Text style={styles.missionTitle}>Real Friends are made In-Person. Get Outside and Gain Handshakes!</Text>
          </LinearGradient>
        </View>

        <Text style={styles.welcomeText}>
          Welcome back, <Text style={styles.welcomeHighlight}>{profile?.name?.split(' ')[0] || 'Friend'}</Text>
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Users size={28} color={Colors.dark.primaryLight} />
            <Text style={styles.statValue}>{handshakes}</Text>
            <Text style={styles.statLabel}>Handshakes</Text>
          </View>

          <View style={styles.statBox}>
            <Zap size={28} color={Colors.dark.primaryLight} />
            <Text style={styles.statValue}>{grassPoints}</Text>
            <Text style={styles.statLabel}>Grass Points</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.networkingCard}>
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.glowRing,
                  {
                    backgroundColor: glowColor,
                    transform: [{ scale: glowScale }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.rotatingRing,
                  {
                    transform: [{ rotate: rotation }],
                  },
                ]}
              >
                {isNetworkingMode && (
                  <>
                    <View style={[styles.ringSegment, styles.ringSegment1]} />
                    <View style={[styles.ringSegment, styles.ringSegment2]} />
                    <View style={[styles.ringSegment, styles.ringSegment3]} />
                    <View style={[styles.ringSegment, styles.ringSegment4]} />
                  </>
                )}
              </Animated.View>
              <View style={styles.networkingButton}>
                <LinearGradient
                  colors={
                    isNetworkingMode
                      ? [Colors.dark.primary, Colors.dark.primaryLight]
                      : [Colors.dark.backgroundTertiary, Colors.dark.backgroundSecondary]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {isNetworkingMode ? (
                    <Eye size={64} color={Colors.dark.background} />
                  ) : (
                    <EyeOff size={64} color={Colors.dark.textSecondary} />
                  )}
                </LinearGradient>
              </View>
            </Animated.View>

            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.statusEmoji}>{isNetworkingMode ? '🍃' : '🏠'}</Text>
                <Text style={styles.statusText}>
                  {isNetworkingMode ? "You're Visible!" : "You're Hidden"}
                </Text>
              </View>
              <Text style={styles.statusSubtext}>
                {isNetworkingMode
                  ? 'Other grass-touchers can discover you and connect'
                  : 'Ready to step outside and meet amazing people nearby?'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isNetworkingMode ? ['#E74C3C', '#C0392B'] : ['#059669', '#10B981', '#2ECC71', '#00FF88']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>
                  {isNetworkingMode ? 'Go Invisible' : 'Start Networking'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {isNetworkingMode && (
              <View style={styles.timeCardsRow}>
                <View style={styles.timeCard}>
                  <Text style={styles.timeCardLabel}>Session</Text>
                  <Text style={styles.timeCardValue}>{formatTime(sessionTime)}</Text>
                </View>
                <View style={styles.timeCard}>
                  <Text style={styles.timeCardLabel}>This Week</Text>
                  <Text style={styles.timeCardValue}>{Math.floor(weeklyTime / 60)}h {weeklyTime % 60}m</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.aiExplainerCard}>
            <View style={styles.aiExplainerHeader}>
              <Sparkles size={20} color={Colors.dark.primaryLight} />
              <Text style={styles.aiExplainerTitle}>AI-Powered Friend Finder</Text>
            </View>
            <Text style={styles.aiExplainerText}>When someone amazing is nearby, you&apos;ll get a notification. Look up, gesture, and make a real connection!</Text>
          </View>

          <View style={styles.hotspotCard}>
            <LinearGradient
              colors={['#7C3AED', '#9333EA', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hotspotGradient}
            >
              <View style={styles.hotspotHeader}>
                <MapPin size={24} color="#E9D5FF" />
                <Text style={styles.hotspotTitle}>Social Hotspot</Text>
                <View style={styles.bonusBadge}>
                  <TrendingUp size={14} color="#7C3AED" />
                  <Text style={styles.bonusText}>{currentHotspot.bonus}</Text>
                </View>
              </View>
              <View style={styles.hotspotContent}>
                <Text style={styles.hotspotEmoji}>{currentHotspot.icon}</Text>
                <View style={styles.hotspotInfo}>
                  <Text style={styles.hotspotName}>{currentHotspot.name}</Text>
                  <Text style={styles.hotspotDescription}>
                    Connect here to earn double Grass Points!
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {lockedTrophies.length > 0 && (
          <View style={styles.trophiesSection}>
            <View style={styles.sectionHeader}>
              <Award size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.sectionTitle}>Locked Trophies</Text>
            </View>
            <View style={styles.trophiesGrid}>
              {lockedTrophies.map((trophy) => {
                const getRarityColor = (rarity: string) => {
                  switch (rarity) {
                    case 'common': return '#95A5A6';
                    case 'rare': return '#3498DB';
                    case 'epic': return '#9B59B6';
                    case 'legendary': return '#F39C12';
                    default: return Colors.dark.border;
                  }
                };
                const rarityColor = getRarityColor(trophy.rarity);
                return (
                  <View key={trophy.id} style={[styles.trophyCard, { borderColor: rarityColor }]}>
                    <View style={styles.rarityBadge}>
                      <Text style={[styles.rarityText, { color: rarityColor }]}>{trophy.rarity.toUpperCase()}</Text>
                    </View>
                    <View style={styles.trophyIconContainer}>
                      <Award size={32} color={Colors.dark.textTertiary} />
                    </View>
                    <Text style={styles.trophyTitle}>{trophy.title}</Text>
                    <Text style={styles.trophyDescription}>{trophy.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  welcomeHighlight: {
    color: Colors.dark.primaryLight,
    fontSize: 32,
    fontWeight: '800' as const,
  },
  missionCard: {
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    elevation: 4,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  missionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
  },
  missionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    flexShrink: 1,
    letterSpacing: 0.3,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  hotspotCard: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    elevation: 8,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  hotspotGradient: {
    padding: 20,
    gap: 16,
  },
  hotspotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hotspotTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#F3E8FF',
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#7C3AED',
  },
  hotspotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  hotspotEmoji: {
    fontSize: 48,
  },
  hotspotInfo: {
    flex: 1,
    gap: 4,
  },
  hotspotName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  hotspotDescription: {
    fontSize: 14,
    color: '#E9D5FF',
    lineHeight: 20,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  networkingCard: {
    width: '100%',
    backgroundColor: Colors.dark.glass,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusEmoji: {
    fontSize: 20,
  },
  buttonContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -10,
    left: -10,
  },
  rotatingRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    top: -5,
    left: -5,
  },
  ringSegment: {
    position: 'absolute',
    width: 50,
    height: 6,
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  ringSegment1: {
    top: 0,
    left: 80,
  },
  ringSegment2: {
    right: 0,
    top: 80,
    transform: [{ rotate: '90deg' }],
  },
  ringSegment3: {
    bottom: 0,
    left: 80,
  },
  ringSegment4: {
    left: 0,
    top: 80,
    transform: [{ rotate: '90deg' }],
  },
  networkingButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  statusSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  timeCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  actionButton: {
    width: '100%',
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  aiExplainerCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  aiExplainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiExplainerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  aiExplainerText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 19,
  },
  timeCard: {
    flex: 1,
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    alignItems: 'center',
    gap: 8,
  },
  timeCardLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '600' as const,
  },
  timeCardValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
    fontVariant: ['tabular-nums'] as any,
  },
  trophiesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  trophiesGrid: {
    gap: 12,
  },
  trophyCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    opacity: 0.7,
    gap: 12,
  },
  trophyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  trophyDescription: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
    lineHeight: 18,
    textAlign: 'center',
  },
  rarityBadge: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
});
