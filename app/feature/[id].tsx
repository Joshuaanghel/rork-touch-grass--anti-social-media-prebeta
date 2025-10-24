import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, Eye, Users, MapPin, Calendar, Send, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FeatureDetail {
  id: string;
  name: string;
  icon: any;
  colors: string[];
  description: string;
  details: string[];
  benefits: string[];
}

const featureDetails: Record<string, FeatureDetail> = {
  'ai-matching': {
    id: 'ai-matching',
    name: 'AI-Powered Matching',
    icon: Sparkles,
    colors: ['#8B5CF6', '#7C3AED'],
    description: 'Our intelligent algorithm understands who you are and finds compatible people nearby in real-time.',
    details: [
      'Advanced personality analysis based on your quiz results',
      'Real-time proximity detection to find people around you',
      'Smart compatibility scoring based on interests and values',
      'Privacy-first approach - you control what you share',
    ],
    benefits: [
      'Meet people who truly match your vibe',
      'Save time by connecting with the right people',
      'Discover unexpected connections',
      'Build meaningful friendships faster',
    ],
  },
  'go-visible': {
    id: 'go-visible',
    name: 'Go Visible',
    icon: Eye,
    colors: ['#EC4899', '#DB2777'],
    description: 'Toggle your visibility to let others know you are open to meeting new people right now.',
    details: [
      'One-tap toggle to become discoverable',
      'Only visible when you want to be',
      'See who else is visible nearby',
      'Perfect for when you are at cafes, parks, or events',
    ],
    benefits: [
      'Meet people when you are in the mood',
      'Full control over your discoverability',
      'Connect spontaneously with others',
      'No pressure - toggle off anytime',
    ],
  },
  'handshakes': {
    id: 'handshakes',
    name: 'Real Handshakes',
    icon: Users,
    colors: ['#F59E0B', '#D97706'],
    description: 'Get notified when someone compatible is nearby. Look up, gesture, and make a real connection!',
    details: [
      'Smart notifications for compatible matches nearby',
      'Physical gesture recognition to confirm connections',
      'Exchange profiles instantly after greeting',
      'Keep a record of everyone you have met',
    ],
    benefits: [
      'Make genuine face-to-face connections',
      'Break the ice with mutual interest',
      'Build your network organically',
      'Remember everyone you meet',
    ],
  },
  'hotspots': {
    id: 'hotspots',
    name: 'Social Hotspots',
    icon: MapPin,
    colors: ['#06B6D4', '#0891B2'],
    description: 'Discover popular locations where grass-touchers gather and earn bonus points!',
    details: [
      'Real-time map of popular meeting spots',
      'See how many people are at each location',
      'Discover trending cafes, parks, and venues',
      'Earn 2x points when connecting at hotspots',
    ],
    benefits: [
      'Find the best places to meet new people',
      'Join existing communities',
      'Support local businesses',
      'Maximize your grass points',
    ],
  },
  'events': {
    id: 'events',
    name: 'Events',
    icon: Calendar,
    colors: ['#A855F7', '#9333EA'],
    description: 'Create and discover local events. Organize meetups, activities, and gatherings to bring your community together IRL!',
    details: [
      'Create custom events in minutes',
      'Browse local meetups and activities',
      'Invite friends and compatible matches',
      'Track attendance and RSVPs',
    ],
    benefits: [
      'Build community in real life',
      'Meet multiple people at once',
      'Organize around shared interests',
      'Turn online connections into real friendships',
    ],
  },
  'ripple-invites': {
    id: 'ripple-invites',
    name: 'Ripple Invites',
    icon: Send,
    colors: ['#EC4899', '#DB2777'],
    description: 'Send invites that spread through your network like ripples in water. Watch your events grow organically!',
    details: [
      'Invite friends who can invite their friends',
      'Track how your event spreads through the network',
      'Visual ripple effect showing invite chains',
      'Maintain quality control with approval settings',
    ],
    benefits: [
      'Grow events exponentially',
      'Meet friends of friends naturally',
      'Build stronger communities',
      'Create authentic social circles',
    ],
  },
  'trophies': {
    id: 'trophies',
    name: 'Points & Trophies',
    icon: Zap,
    colors: ['#10B981', '#059669'],
    description: 'Earn grass points for every connection and collect rare trophies as you network!',
    details: [
      'Earn 10 points for each new connection',
      'Bonus points at hotspots and events',
      'Unlock trophies from common to legendary',
      'Climb the leaderboard and compete with friends',
    ],
    benefits: [
      'Gamify your social life',
      'Track your networking progress',
      'Achieve meaningful milestones',
      'Show off your social achievements',
    ],
  },
};

export default function FeatureDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const feature = featureDetails[id || ''];

  if (!feature) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Feature not found</Text>
      </View>
    );
  }

  const Icon = feature.icon;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent]}
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <LinearGradient
              colors={feature.colors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Icon size={64} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>{feature.name}</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.list}>
              {feature.details.map((detail, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{detail}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why You Will Love It</Text>
            <View style={styles.list}>
              {feature.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bullet, styles.bulletGreen]} />
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.backToListButton} onPress={() => router.back()}>
            <LinearGradient
              colors={[Colors.dark.primary, Colors.dark.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.backToListButtonGradient}
            >
              <Text style={styles.backToListButtonText}>Back to Features</Text>
            </LinearGradient>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 32,
  },
  heroSection: {
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  list: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primaryLight,
    marginTop: 6,
  },
  bulletGreen: {
    backgroundColor: '#10B981',
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  backToListButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  backToListButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  backToListButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
