import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';

export default function AboutMissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.replace('/waiting-room');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.rainbowHeader, { marginTop: -insets.top }]}
          />
          
          <Text style={styles.title}>Touch Grass</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardText}>Touch Grass isn&apos;t another social app — it&apos;s the <Text style={styles.magicText}>anti-social media movement.</Text></Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardText}>It&apos;s built to get you off your phone and back into <Text style={styles.magicText}>real life</Text> — where connection actually happens.</Text>
          </View>

          <View style={styles.pillsContainer}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>No feeds</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>No followers</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>No filters</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardText}>Just people — nearby, curious, and open to meeting someone new.</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.card}>
            <Text style={styles.cardText}>Our AI learns your vibe — your humor, your energy, your interests — and helps you cross paths with people who actually get you.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardText}>A shared song, a glance, a friendly &ldquo;hey.&rdquo; That&apos;s how every real connection starts.</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.card}>
            <Text style={styles.cardText}>This is your space to rediscover what social was meant to be: spontaneous, human, and alive.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardText}>Every event, every handshake, every smile — it&apos;s all one step closer to a world that values <Text style={styles.magicText}>presence over pixels.</Text></Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.finalCard}>
            <Text style={styles.finalText}>Touch Grass is more than an app. It&apos;s a reminder to look up, reach out, and reconnect with what&apos;s real.</Text>
          </View>

          <View style={{ paddingBottom: insets.bottom }}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <LinearGradient
                colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  rainbowHeader: {
    width: '120%',
    height: 140,
    marginLeft: '-10%',
    marginBottom: 24,
  },
  scrollContent: {
    gap: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '900' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardText: {
    fontSize: 17,
    color: Colors.dark.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
  },
  magicText: {
    fontSize: 17,
    fontWeight: '800' as const,
    lineHeight: 26,
    color: '#F59E0B',
  },

  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 8,
  },
  pill: {
    backgroundColor: Colors.dark.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  pillText: {
    fontSize: 15,
    color: Colors.dark.primaryLight,
    fontWeight: '600' as const,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.dark.border,
    width: '40%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  finalCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.dark.primaryDark,
    gap: 16,
    marginTop: 8,
  },
  finalText: {
    fontSize: 19,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  continueButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
});
