import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Star, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { personalityTypes } from '@/mocks/personalityTypes';

export const compatibilityMatrix: Record<string, string[]> = {
  'The Explorer': ['The Adventurer', 'The Creator', 'The Maverick', 'The Catalyst'],
  'The Connector': ['The Nurturer', 'The Harmonizer', 'The Thinker', 'The Creator'],
  'The Creator': ['The Visionary', 'The Explorer', 'The Maverick', 'The Connector'],
  'The Thinker': ['The Visionary', 'The Harmonizer', 'The Connector', 'The Creator'],
  'The Adventurer': ['The Explorer', 'The Catalyst', 'The Maverick', 'The Nurturer'],
  'The Nurturer': ['The Connector', 'The Harmonizer', 'The Adventurer', 'The Catalyst'],
  'The Visionary': ['The Creator', 'The Thinker', 'The Catalyst', 'The Maverick'],
  'The Catalyst': ['The Adventurer', 'The Visionary', 'The Explorer', 'The Nurturer'],
  'The Harmonizer': ['The Nurturer', 'The Connector', 'The Thinker', 'The Explorer'],
  'The Maverick': ['The Creator', 'The Explorer', 'The Visionary', 'The Adventurer'],
};

export default function PersonalityExplorerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleClose = () => {
    router.back();
  };

  const typesList = Object.keys(personalityTypes);

  const renderCompatibility = (typeName: string) => {
    const compatible = compatibilityMatrix[typeName] || [];
    return (
      <View style={styles.compatibilitySection}>
        <View style={styles.compatibilityHeader}>
          <Heart size={20} color={Colors.dark.primaryLight} />
          <Text style={styles.compatibilityTitle}>Most Compatible With</Text>
        </View>
        <View style={styles.compatibilityList}>
          {compatible.map((compatibleType) => {
            const details = personalityTypes[compatibleType];
            return (
              <TouchableOpacity
                key={compatibleType}
                style={[styles.compatibilityChip, { borderColor: details.color }]}
                onPress={() => setSelectedType(compatibleType)}
              >
                <View style={[styles.compatibilityDot, { backgroundColor: details.color }]} />
                <Text style={styles.compatibilityName}>{compatibleType}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.accent]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Personality Types</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={28} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Discover the unique personalities you&apos;ll meet and who you&apos;ll connect with best
          </Text>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.typesGrid}>
              {typesList.map((typeName) => {
                const type = personalityTypes[typeName];
                return (
                  <TouchableOpacity
                    key={typeName}
                    style={styles.typeCard}
                    onPress={() => setSelectedType(typeName)}
                  >
                    <LinearGradient
                      colors={type.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.typeCardGradient}
                    >
                      <Text style={styles.typeName}>{type.name}</Text>
                      <Text style={styles.typeTagline}>{type.tagline}</Text>
                      <View style={styles.typeFooter}>
                        <Star size={16} color="rgba(255, 255, 255, 0.9)" />
                        <Text style={styles.tapToLearn}>Tap to learn more</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.infoCard}>
              <Zap size={32} color={Colors.dark.primaryLight} />
              <Text style={styles.infoTitle}>AI-Powered Matching</Text>
              <Text style={styles.infoText}>
                Touch Grass uses advanced personality science to help you connect with people who complement your strengths and share your values.
              </Text>
            </View>

            <View style={styles.excitementCard}>
              <Text style={styles.excitementTitle}>What Makes This Special</Text>
              <View style={styles.excitementList}>
                <Text style={styles.excitementItem}>
                  🌟 10 unique personality types based on cutting-edge psychology
                </Text>
                <Text style={styles.excitementItem}>
                  💫 Smart compatibility matching to find your ideal connections
                </Text>
                <Text style={styles.excitementItem}>
                  🎯 Meet people who truly understand and complement you
                </Text>
                <Text style={styles.excitementItem}>
                  ✨ Build diverse friendships across different personality types
                </Text>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>

        <Modal
          visible={selectedType !== null}
          animationType="fade"
          onRequestClose={() => setSelectedType(null)}
          transparent={true}
        >
          {selectedType && (
            <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
              <LinearGradient
                colors={personalityTypes[selectedType].gradient}
                style={styles.modalHeader}
              >
                <TouchableOpacity
                  onPress={() => setSelectedType(null)}
                  style={styles.modalCloseButton}
                >
                  <X size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{personalityTypes[selectedType].name}</Text>
                <Text style={styles.modalTagline}>{personalityTypes[selectedType].tagline}</Text>
              </LinearGradient>

              <ScrollView 
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>About</Text>
                  <Text style={styles.modalDescription}>
                    {personalityTypes[selectedType].description}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Key Strengths</Text>
                  <View style={styles.strengthsList}>
                    {personalityTypes[selectedType].strengths.slice(0, 4).map((strength, index) => (
                      <View key={index} style={styles.strengthItem}>
                        <View style={[styles.strengthDot, { backgroundColor: personalityTypes[selectedType].color }]} />
                        <Text style={styles.strengthText}>{strength}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {renderCompatibility(selectedType)}

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Ideal Activities</Text>
                  <View style={styles.activitiesList}>
                    {personalityTypes[selectedType].idealActivities.slice(0, 4).map((activity, index) => (
                      <View key={index} style={styles.activityChip}>
                        <Text style={styles.activityText}>{activity}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Famous Examples</Text>
                  <Text style={styles.famousPeople}>
                    {personalityTypes[selectedType].famousPeople.join(', ')}
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 20,
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  typesGrid: {
    gap: 16,
  },
  typeCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  typeCardGradient: {
    padding: 24,
    gap: 8,
  },
  typeName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  typeTagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 21,
  },
  typeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  tapToLearn: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic' as const,
  },
  infoCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  infoText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  excitementCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 16,
  },
  excitementTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  excitementList: {
    gap: 12,
  },
  excitementItem: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  modalHeader: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    right: 24,
    top: 20,
    padding: 4,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
  },
  modalTagline: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 28,
  },
  modalSection: {
    gap: 12,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  strengthsList: {
    gap: 12,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  strengthText: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  compatibilitySection: {
    gap: 12,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compatibilityTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  compatibilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  compatibilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    borderWidth: 2,
  },
  compatibilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  compatibilityName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  activityText: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500' as const,
  },
  famousPeople: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
});
