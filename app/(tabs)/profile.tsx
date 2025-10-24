import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Edit3, Sparkles, TrendingUp, Clock, MapPin, Users, Star, Zap, Crown, Heart, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { personalityResults } from '@/mocks/quizQuestions';
import { useRouter } from 'expo-router';
import { personalityTypes } from '@/mocks/personalityTypes';
import { compatibilityMatrix } from '@/app/personality-explorer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { profile, reloadData } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleResetDemo = async () => {
    try {
      console.log('Resetting demo - clearing all data');
      await AsyncStorage.clear();
      console.log('Storage cleared, navigating to onboarding');
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error resetting demo:', error);
    }
  };

  console.log('Profile Screen - Profile:', profile);

  if (!profile) {
    return (
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent]}
        style={styles.container}
      >
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </LinearGradient>
    );
  }

  const personalityInfo = personalityResults[profile.personalityType];
  
  if (!personalityInfo) {
    console.error('Personality type not found:', profile.personalityType);
    return (
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent]}
        style={styles.container}
      >
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Error loading personality info</Text>
          <TouchableOpacity onPress={reloadData} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const unlockedTrophies = profile.trophies?.filter(t => t.isUnlocked) || [];

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return {
          border: '#95A5A6',
          bg: 'rgba(149, 165, 166, 0.15)',
          icon: '#95A5A6',
          ribbon: '#7F8C8D',
        };
      case 'rare':
        return {
          border: '#3498DB',
          bg: 'rgba(52, 152, 219, 0.15)',
          icon: '#3498DB',
          ribbon: '#2980B9',
        };
      case 'epic':
        return {
          border: '#9B59B6',
          bg: 'rgba(155, 89, 182, 0.15)',
          icon: '#9B59B6',
          ribbon: '#8E44AD',
        };
      case 'legendary':
        return {
          border: '#F39C12',
          bg: 'rgba(243, 156, 18, 0.15)',
          icon: '#F39C12',
          ribbon: '#E67E22',
        };
      default:
        return {
          border: Colors.dark.border,
          bg: Colors.dark.glass,
          icon: Colors.dark.primaryLight,
          ribbon: Colors.dark.primary,
        };
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return Award;
      case 'rare':
        return Star;
      case 'epic':
        return Zap;
      case 'legendary':
        return Crown;
      default:
        return Award;
    }
  };
  const stats = profile.networkingStats || {
    averageFriendsPerDay: 0,
    totalTimeThisWeek: 0,
    totalTimeThisMonth: 0,
    topLocations: [],
    sessionsCompleted: 0,
  };

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: profile.color }]}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          
          <View style={styles.grassPointsCard}>
            <Zap size={24} color={Colors.dark.primaryLight} />
            <Text style={styles.grassPointsValue}>{profile.grassPoints || 0}</Text>
            <Text style={styles.grassPointsLabel}>Grass Points</Text>
          </View>
        </View>

        <View style={styles.personalitySection}>
          <View style={styles.personalityCard}>
            <View style={styles.personalityHeader}>
              <Sparkles size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.personalityTitle}>{profile.personalityType}</Text>
            </View>
            <Text style={styles.personalityDescription}>
              {personalityInfo.description}
            </Text>
            <View style={styles.traitsContainer}>
              {personalityInfo.traits.map((trait, index) => (
                <View key={index} style={styles.traitBadge}>
                  <Text style={styles.traitText}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.compatibilitySection}>
          <View style={styles.sectionHeader}>
            <Heart size={24} color={Colors.dark.primaryLight} />
            <Text style={styles.sectionTitle}>Your Compatibility</Text>
          </View>
          <Text style={styles.compatibilityDescription}>
            Based on your personality type, you connect best with these types:
          </Text>
          <View style={styles.compatibilityGrid}>
            {(compatibilityMatrix[profile.personalityType] || []).map((compatibleType) => {
              const typeDetails = personalityTypes[compatibleType];
              if (!typeDetails) return null;
              return (
                <TouchableOpacity
                  key={compatibleType}
                  style={[
                    styles.compatibilityCard,
                    { borderColor: typeDetails.color }
                  ]}
                  onPress={() => router.push('/personality-explorer')}
                >
                  <View style={[
                    styles.compatibilityDot,
                    { backgroundColor: typeDetails.color }
                  ]} />
                  <Text style={styles.compatibilityCardTitle}>{compatibleType}</Text>
                  <Text style={styles.compatibilityCardTagline}>{typeDetails.tagline}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color={Colors.dark.primaryLight} />
            <Text style={styles.sectionTitle}>Networking Stats</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Users size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.statValue}>{stats.averageFriendsPerDay.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Friends/Day</Text>
            </View>

            <View style={styles.statCard}>
              <Clock size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.statValue}>{Math.floor(stats.totalTimeThisWeek / 60)}h</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>

            <View style={styles.statCard}>
              <Clock size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.statValue}>{Math.floor(stats.totalTimeThisMonth / 60)}h</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>

            <View style={styles.statCard}>
              <Award size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.statValue}>{stats.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>

          {stats.topLocations.length > 0 && (
            <View style={styles.locationsCard}>
              <View style={styles.locationsHeader}>
                <MapPin size={20} color={Colors.dark.primaryLight} />
                <Text style={styles.locationsTitle}>Top Locations</Text>
              </View>
              {stats.topLocations.map((location, index) => (
                <View key={index} style={styles.locationItem}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationStats}>
                    {location.visits} visits • {location.connectionsCount} connections
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.trophiesSection}>
          <View style={styles.sectionHeader}>
            <Award size={24} color={Colors.dark.primaryLight} />
            <Text style={styles.sectionTitle}>Trophy Inventory</Text>
          </View>

          {unlockedTrophies.length > 0 ? (
            <View style={styles.trophiesGrid}>
              {unlockedTrophies.map((trophy) => {
                const colors = getRarityColors(trophy.rarity);
                const RarityIcon = getRarityIcon(trophy.rarity);
                return (
                  <View
                    key={trophy.id}
                    style={[
                      styles.trophyCard,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.bg,
                      },
                    ]}
                  >
                    <View style={styles.ribbonContainer}>
                      <View style={[styles.ribbon, { backgroundColor: colors.ribbon }]}>
                        <Text style={styles.ribbonText}>{trophy.rarity.toUpperCase()}</Text>
                      </View>
                      <View style={[styles.ribbonTail, styles.ribbonTailLeft, { borderTopColor: colors.ribbon }]} />
                      <View style={[styles.ribbonTail, styles.ribbonTailRight, { borderTopColor: colors.ribbon }]} />
                    </View>
                    <View style={[styles.trophyIconContainer, { backgroundColor: colors.bg }]}>
                      <RarityIcon size={32} color={colors.icon} />
                    </View>
                    <Text style={styles.trophyTitle}>{trophy.title}</Text>
                    <Text style={styles.trophyDescription}>{trophy.description}</Text>
                    {trophy.unlockedAt && (
                      <Text style={styles.trophyDate}>
                        Unlocked {new Date(trophy.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyTrophies}>
              <Award size={48} color={Colors.dark.textTertiary} />
              <Text style={styles.emptyTrophiesText}>No trophies unlocked yet</Text>
              <Text style={styles.emptyTrophiesSubtext}>Start networking to earn trophies!</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
          <LinearGradient
            colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.editButtonGradient}
          >
            <Edit3 size={20} color={Colors.dark.background} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.aboutSection}>
          <LinearGradient
            colors={['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.missionGradient}
          >
            <Heart size={40} color="#FFFFFF" />
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionDescription}>
              Get you outside, meeting amazing people nearby through AI-powered proximity matching.
            </Text>
            <View style={styles.missionDividerWhite} />
            <Text style={styles.missionManifesto}>
              No endless scrolling. No fake followers. No algorithmic feeds.
            </Text>
            <Text style={styles.missionManifesto}>
              Just real connections with people who share your interests, values, and energy.
            </Text>
          </LinearGradient>
        </View>

        <TouchableOpacity style={styles.demoButton} onPress={handleResetDemo}>
          <View style={styles.demoButtonInner}>
            <RotateCcw size={20} color="#EF4444" />
            <Text style={styles.demoButtonText}>Reset Demo</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  name: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  grassPointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dark.glass,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    marginTop: 16,
  },
  grassPointsValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  grassPointsLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  personalitySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  personalityCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 16,
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personalityTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  personalityDescription: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadge: {
    backgroundColor: Colors.dark.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  traitText: {
    fontSize: 13,
    color: Colors.dark.primaryLight,
    fontWeight: '600' as const,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  locationsCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginTop: 12,
    gap: 12,
  },
  locationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  locationItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  locationStats: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
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
    gap: 16,
  },
  trophyCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    gap: 8,
    overflow: 'hidden',
  },
  trophyCardLocked: {
    borderColor: Colors.dark.border,
    opacity: 0.6,
  },
  ribbonContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  ribbon: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  ribbonTail: {
    position: 'absolute',
    top: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  ribbonTailLeft: {
    left: 0,
  },
  ribbonTailRight: {
    right: 0,
  },
  trophyIconContainer: {
    marginBottom: 8,
  },
  trophyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  trophyTitleLocked: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
  },
  trophyDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  trophyDate: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
    marginTop: 4,
  },
  emptyTrophies: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyTrophiesText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  emptyTrophiesSubtext: {
    fontSize: 14,
    color: Colors.dark.textTertiary,
  },
  editButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  aboutSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
  },
  missionGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  missionTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  missionDescription: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    lineHeight: 26,
    textAlign: 'center',
  },
  missionDividerWhite: {
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  missionManifesto: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  demoButton: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  demoButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FCA5A5',
  },
  compatibilitySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  compatibilityDescription: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  compatibilityGrid: {
    gap: 12,
  },
  compatibilityCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    gap: 8,
  },
  compatibilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  compatibilityCardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  compatibilityCardTagline: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic' as const,
  },
});
