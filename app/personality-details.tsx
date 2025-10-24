import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  X, 
  Heart, 
  TrendingUp, 
  Brain,
  Zap,
  BarChart3,
  Users,
  Star
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { personalityTypes } from '@/mocks/personalityTypes';
import { compatibilityMatrix } from './personality-explorer';

function getTraitIntensities(typeName: string) {
  const intensities: Record<string, Array<{ name: string; intensity: number }>> = {
    'The Explorer': [
      { name: 'Spontaneity', intensity: 95 },
      { name: 'Adaptability', intensity: 90 },
      { name: 'Risk-Taking', intensity: 85 },
      { name: 'Social Energy', intensity: 75 },
      { name: 'Structure Preference', intensity: 20 },
    ],
    'The Connector': [
      { name: 'Empathy', intensity: 95 },
      { name: 'Social Harmony', intensity: 90 },
      { name: 'Emotional Awareness', intensity: 95 },
      { name: 'People Focus', intensity: 90 },
      { name: 'Independence', intensity: 40 },
    ],
    'The Creator': [
      { name: 'Creativity', intensity: 98 },
      { name: 'Originality', intensity: 95 },
      { name: 'Artistic Vision', intensity: 90 },
      { name: 'Non-conformity', intensity: 85 },
      { name: 'Practicality', intensity: 35 },
    ],
    'The Thinker': [
      { name: 'Analytical Thinking', intensity: 95 },
      { name: 'Intellectual Curiosity', intensity: 98 },
      { name: 'Logic Focus', intensity: 90 },
      { name: 'Depth Seeking', intensity: 95 },
      { name: 'Emotional Expression', intensity: 30 },
    ],
    'The Adventurer': [
      { name: 'Physical Courage', intensity: 95 },
      { name: 'Competitive Drive', intensity: 90 },
      { name: 'Resilience', intensity: 95 },
      { name: 'Action Orientation', intensity: 92 },
      { name: 'Caution', intensity: 15 },
    ],
    'The Nurturer': [
      { name: 'Compassion', intensity: 98 },
      { name: 'Patience', intensity: 95 },
      { name: 'Supportiveness', intensity: 95 },
      { name: 'Loyalty', intensity: 90 },
      { name: 'Assertiveness', intensity: 35 },
    ],
    'The Visionary': [
      { name: 'Strategic Thinking', intensity: 95 },
      { name: 'Innovation', intensity: 90 },
      { name: 'Ambition', intensity: 92 },
      { name: 'Future Focus', intensity: 95 },
      { name: 'Present Awareness', intensity: 40 },
    ],
    'The Catalyst': [
      { name: 'Authenticity', intensity: 98 },
      { name: 'Intensity', intensity: 95 },
      { name: 'Transformation Drive', intensity: 90 },
      { name: 'Truth-Seeking', intensity: 95 },
      { name: 'Diplomacy', intensity: 25 },
    ],
    'The Harmonizer': [
      { name: 'Balance', intensity: 95 },
      { name: 'Diplomacy', intensity: 92 },
      { name: 'Fairness', intensity: 95 },
      { name: 'Perspective-Taking', intensity: 90 },
      { name: 'Decisiveness', intensity: 50 },
    ],
    'The Maverick': [
      { name: 'Independence', intensity: 98 },
      { name: 'Originality', intensity: 95 },
      { name: 'Non-Conformity', intensity: 95 },
      { name: 'Self-Direction', intensity: 92 },
      { name: 'Conformity', intensity: 10 },
    ],
  };
  return intensities[typeName] || [];
}

function getStressTriggers(typeName: string) {
  const triggers: Record<string, string[]> = {
    'The Explorer': ['Routine and repetition', 'Being confined or restricted', 'Micromanagement', 'Lack of variety'],
    'The Connector': ['Conflict and disharmony', 'Feeling disconnected', 'Being unable to help', 'Social isolation'],
    'The Creator': ['Creative constraints', 'Rigid structures', 'Being told "that\'s not how it\'s done"', 'Lack of aesthetic beauty'],
    'The Thinker': ['Illogical decisions', 'Superficial conversations', 'Time pressure on complex problems', 'Anti-intellectualism'],
    'The Adventurer': ['Physical inactivity', 'Feeling weak or incapable', 'Losing competitions', 'Being sedentary'],
    'The Nurturer': ['Seeing others suffer', 'Chaos and instability', 'Being unable to provide care', 'Harsh criticism'],
    'The Visionary': ['Short-term thinking', 'Lack of ambition in others', 'Bureaucratic obstacles', 'Limited possibilities'],
    'The Catalyst': ['Inauthenticity', 'Stagnation', 'People avoiding truth', 'Surface-level interactions'],
    'The Harmonizer': ['Extreme conflict', 'Forced to take sides', 'Injustice and unfairness', 'Polarization'],
    'The Maverick': ['Conformity pressure', 'Following trends', 'Lack of autonomy', 'Being like everyone else'],
  };
  return triggers[typeName] || [];
}

function getRechargeMethods(typeName: string) {
  const methods: Record<string, string[]> = {
    'The Explorer': ['Trying something new', 'Outdoor adventures', 'Spontaneous trips', 'Physical activity'],
    'The Connector': ['Deep conversations', 'Helping a friend', 'Group activities', 'Building community'],
    'The Creator': ['Creative projects', 'Artistic expression', 'Beautiful environments', 'Solo creative time'],
    'The Thinker': ['Reading and learning', 'Solo contemplation', 'Complex problems', 'Intellectual discussions'],
    'The Adventurer': ['Intense workouts', 'Competing', 'Pushing physical limits', 'Outdoor challenges'],
    'The Nurturer': ['Caring for loved ones', 'Quiet home time', 'Acts of service', 'Cozy environments'],
    'The Visionary': ['Strategic planning', 'Brainstorming big ideas', 'Learning new concepts', 'Inspiring others'],
    'The Catalyst': ['Authentic conversations', 'Personal growth work', 'Challenging status quo', 'Transformative experiences'],
    'The Harmonizer': ['Peaceful environments', 'Meditation', 'Bringing people together', 'Resolving conflicts'],
    'The Maverick': ['Solo creative time', 'Breaking rules', 'Expressing uniqueness', 'Unconventional activities'],
  };
  return methods[typeName] || [];
}

export default function PersonalityDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();

  if (!profile) {
    return null;
  }

  const personalityType = personalityTypes[profile.personalityType];

  if (!personalityType) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.accent]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => router.back()}
            >
              <View style={styles.closeButtonInner}>
                <X size={24} color={Colors.dark.text} />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 40 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.typeCard}>
              <LinearGradient
                colors={personalityType.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.typeCardGradient}
              >
                <Brain size={48} color="#FFFFFF" />
                <Text style={styles.typeName}>{personalityType.name}</Text>
                <Text style={styles.typeTagline}>{personalityType.tagline}</Text>
              </LinearGradient>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About You</Text>
              <Text style={styles.aboutDescription}>{personalityType.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Strengths</Text>
              <View style={styles.strengthsList}>
                {personalityType.strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How You Communicate</Text>
              <Text style={styles.relationshipDescription}>
                {personalityType.name === 'The Explorer' && 'You communicate with energy and excitement, sharing stories of experiences and possibilities. You prefer action-oriented conversations and may grow restless with overly theoretical discussions. Your enthusiasm is infectious, and you naturally inspire others to take action.'}
                {personalityType.name === 'The Connector' && 'Your communication style is warm, empathetic, and inclusive. You excel at asking meaningful questions and making others feel heard. You have a gift for reading between the lines and understanding unspoken emotions, creating safe spaces for authentic dialogue.'}
                {personalityType.name === 'The Creator' && 'You express yourself through vivid imagery and creative metaphors. Your communication is often non-linear, jumping between ideas as inspiration strikes. You prefer showing over telling, and your unique perspective brings fresh angles to every conversation.'}
                {personalityType.name === 'The Thinker' && 'You communicate with precision and depth, carefully choosing your words. You appreciate intellectual discourse and enjoy exploring ideas thoroughly. While you may take time to process before responding, your insights are always thoughtful and well-reasoned.'}
                {personalityType.name === 'The Adventurer' && 'Your communication is direct, confident, and energizing. You prefer getting straight to the point and value action over lengthy discussion. You lead by example and your words carry the weight of lived experience and proven capability.'}
                {personalityType.name === 'The Nurturer' && 'You communicate with patience, kindness, and genuine care. You create space for others to express themselves fully and respond with compassion. Your words are carefully chosen to support and uplift, and you excel at making others feel valued and understood.'}
                {personalityType.name === 'The Visionary' && 'You communicate in big-picture terms, painting compelling visions of what could be. You excel at connecting diverse concepts and articulating complex ideas clearly. Your forward-thinking perspective challenges others to think beyond present constraints.'}
                {personalityType.name === 'The Catalyst' && 'Your communication is direct, passionate, and transformative. You cut through superficiality and speak uncomfortable truths when necessary. Your intensity and authenticity inspire others to be genuine and courageous in their own expression.'}
                {personalityType.name === 'The Harmonizer' && 'You communicate with balance and diplomacy, carefully considering multiple perspectives. You have a talent for finding common ground and expressing ideas in ways that bring people together. Your calm, measured approach helps others find clarity and peace.'}
                {personalityType.name === 'The Maverick' && 'You communicate with originality and boldness, unafraid to share unconventional ideas. You value authenticity over politeness and express yourself in unique ways. Your independent thinking challenges others to question assumptions and think differently.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Work Style</Text>
              <Text style={styles.relationshipDescription}>
                {personalityType.name === 'The Explorer' && 'You thrive in dynamic environments with variety and autonomy. Routine tasks drain your energy, while new challenges energize you. You excel in roles that involve problem-solving, travel, or constant change. Best in: Field work, sales, emergency response, entrepreneurship.'}
                {personalityType.name === 'The Connector' && 'You excel in collaborative environments where relationships matter. You naturally build teams and create positive cultures. You\'re motivated by helping others succeed and creating harmony. Best in: Human resources, counseling, team leadership, community building.'}
                {personalityType.name === 'The Creator' && 'You need creative freedom and flexible structures to do your best work. Rigid systems stifle you, while open-ended projects inspire you. You bring innovation and fresh perspectives to every endeavor. Best in: Design, arts, marketing, content creation, product development.'}
                {personalityType.name === 'The Thinker' && 'You excel when given time for deep analysis and complex problem-solving. You prefer working independently or with fellow intellectuals. Quality trumps speed in your work. Best in: Research, strategy, analysis, academia, technical fields, consulting.'}
                {personalityType.name === 'The Adventurer' && 'You thrive under pressure and in high-stakes situations. Physical challenges and competition bring out your best. You lead by example and inspire through action. Best in: Athletics, military, emergency services, competitive fields, physical training.'}
                {personalityType.name === 'The Nurturer' && 'You excel in supportive roles where you can directly impact others\' wellbeing. You create stable, caring environments. Patient, detail-oriented work suits you well. Best in: Healthcare, education, social work, hospitality, childcare, therapy.'}
                {personalityType.name === 'The Visionary' && 'You need big challenges and long-term projects that require strategic thinking. You excel at seeing opportunities and creating roadmaps to reach them. Best in: Executive leadership, entrepreneurship, strategy consulting, innovation roles, venture capital.'}
                {personalityType.name === 'The Catalyst' && 'You thrive in transformation-focused roles where you can drive change. You excel at motivating others and disrupting stagnant systems. Best in: Activism, organizational development, coaching, consulting, public speaking, change management.'}
                {personalityType.name === 'The Harmonizer' && 'You excel in roles requiring diplomacy, balance, and bringing diverse groups together. You create peaceful, productive environments. Best in: Mediation, diplomacy, project management, facilitation, human rights, conflict resolution.'}
                {personalityType.name === 'The Maverick' && 'You need independence and freedom to innovate. Traditional structures constrain you. You excel when blazing new trails and challenging conventions. Best in: Entrepreneurship, freelancing, innovative startups, artistic fields, disruptive industries.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>In Relationships</Text>
              <Text style={styles.relationshipDescription}>{personalityType.inRelationships}</Text>
            </View>

            <View style={styles.compatibilitySection}>
              <View style={styles.compatibilityHeader}>
                <Heart size={24} color={Colors.dark.primaryLight} />
                <Text style={styles.sectionTitle}>Most Compatible With</Text>
              </View>
              <View style={styles.compatibilityList}>
                {(compatibilityMatrix[personalityType.name] || []).map((compatibleType) => {
                  const details = personalityTypes[compatibleType];
                  if (!details) return null;
                  return (
                    <View
                      key={compatibleType}
                      style={[styles.compatibilityChip, { borderColor: details.color }]}
                    >
                      <View style={[styles.compatibilityDot, { backgroundColor: details.color }]} />
                      <Text style={styles.compatibilityName}>{compatibleType}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ideal Activities</Text>
              <View style={styles.activitiesList}>
                {personalityType.idealActivities.map((activity, index) => (
                  <View key={index} style={styles.activityChip}>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Growth Areas</Text>
              <View style={styles.growthList}>
                {personalityType.growthAreas.map((area, index) => (
                  <View key={index} style={styles.growthItem}>
                    <TrendingUp size={16} color={Colors.dark.primaryLight} />
                    <Text style={styles.growthText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Famous Examples</Text>
              <Text style={styles.famousPeople}>
                {personalityType.famousPeople.join(', ')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What Makes You Unique</Text>
              <Text style={styles.relationshipDescription}>
                {personalityType.name === 'The Explorer' && 'Your rare combination of courage and curiosity sets you apart. While others hesitate, you leap. You transform ordinary experiences into adventures and inspire others to live more boldly. Your adaptability and resilience make you thrive where others struggle.'}
                {personalityType.name === 'The Connector' && 'Your emotional intelligence and genuine care for others is exceptional. You possess an almost magical ability to make everyone feel important and understood. You don\'t just build networks—you create families. Your presence makes communities stronger and more cohesive.'}
                {personalityType.name === 'The Creator' && 'Your imagination and artistic vision see possibilities others miss entirely. You transform ideas into reality through sheer creative force. Your unique perspective doesn\'t just add beauty to the world—it challenges others to see differently and express their own creativity.'}
                {personalityType.name === 'The Thinker' && 'Your intellectual depth and analytical precision are remarkable. You see patterns and connections that elude others. Your quest for understanding isn\'t just academic—it\'s a profound drive to comprehend existence itself. Your insights illuminate paths for others.'}
                {personalityType.name === 'The Adventurer' && 'Your physical courage and mental toughness are extraordinary. You embody what\'s possible when someone refuses to accept limits. Your example shows others their own untapped potential. You don\'t just talk about pushing boundaries—you redefine them daily.'}
                {personalityType.name === 'The Nurturer' && 'Your capacity for unconditional care and patience is a rare gift. You create safe havens where others can heal and grow. Your consistent presence and gentle strength provide the foundation others need to become their best selves. You make the world softer and safer.'}
                {personalityType.name === 'The Visionary' && 'Your ability to see future possibilities and inspire others toward them is extraordinary. You don\'t just dream—you create compelling roadmaps to make dreams real. Your strategic mind combined with inspirational communication makes you a natural architect of change.'}
                {personalityType.name === 'The Catalyst' && 'Your fearless authenticity and transformative energy are powerful forces. You spark awakening in others simply by being yourself. Your willingness to challenge and disrupt creates space for genuine growth. You don\'t accept mediocrity—you ignite excellence.'}
                {personalityType.name === 'The Harmonizer' && 'Your ability to see all perspectives and create balance is a precious gift. In a polarized world, you build bridges. Your diplomacy doesn\'t come from avoiding conflict but from understanding that peace requires acknowledging all voices. You make unity possible.'}
                {personalityType.name === 'The Maverick' && 'Your fierce independence and original thinking make you a true trailblazer. You don\'t follow trends—you create them. Your courage to be completely yourself, regardless of social pressure, gives others permission to embrace their own uniqueness. You prove that different is powerful.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Core Values</Text>
              <View style={styles.strengthsList}>
                {personalityType.name === 'The Explorer' && ['Freedom and autonomy', 'New experiences', 'Authenticity', 'Growth through challenge'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Connector' && ['Deep relationships', 'Community and belonging', 'Empathy and understanding', 'Creating harmony'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Creator' && ['Self-expression', 'Originality', 'Beauty and aesthetics', 'Creative freedom'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Thinker' && ['Truth and knowledge', 'Intellectual integrity', 'Deep understanding', 'Logical consistency'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Adventurer' && ['Physical excellence', 'Courage and bravery', 'Personal achievement', 'Living fully'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Nurturer' && ['Care and compassion', 'Safety and comfort', 'Loyalty and devotion', 'Helping others thrive'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Visionary' && ['Innovation and progress', 'Strategic thinking', 'Future possibilities', 'Inspiring change'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Catalyst' && ['Authenticity', 'Transformation', 'Truth over comfort', 'Driving change'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Harmonizer' && ['Balance and fairness', 'Peace and understanding', 'Unity in diversity', 'Diplomatic resolution'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
                {personalityType.name === 'The Maverick' && ['Independence', 'Originality', 'Personal freedom', 'Breaking conventions'].map((value, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <View style={[styles.strengthDot, { backgroundColor: personalityType.color }]} />
                    <Text style={styles.strengthText}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <BarChart3 size={24} color={Colors.dark.primaryLight} />
                <Text style={styles.sectionTitle}>Trait Intensity Profile</Text>
              </View>
              <Text style={styles.sectionSubtext}>How strongly these traits show up in you</Text>
              <View style={styles.traitsContainer}>
                {getTraitIntensities(personalityType.name).map((trait, index) => (
                  <View key={index} style={styles.traitRow}>
                    <Text style={styles.traitLabel}>{trait.name}</Text>
                    <View style={styles.traitBarContainer}>
                      <View 
                        style={[
                          styles.traitBarFill, 
                          { 
                            width: `${trait.intensity}%`,
                            backgroundColor: personalityType.color 
                          }
                        ]} 
                      />
                      <Text style={styles.traitPercent}>{trait.intensity}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={24} color={Colors.dark.primaryLight} />
                <Text style={styles.sectionTitle}>Social Preferences</Text>
              </View>
              <Text style={styles.relationshipDescription}>
                {personalityType.name === 'The Explorer' && 'You prefer spontaneous social interactions and thrive in dynamic group settings. You enjoy meeting new people but need alone time to recharge after intense socializing. Small talk bores you—you prefer authentic, action-oriented connections.'}
                {personalityType.name === 'The Connector' && 'You thrive on deep, meaningful one-on-one connections and intimate group settings. You prefer quality over quantity in relationships. Large crowds can be draining unless you\'re facilitating connections between others. You need frequent social interaction to feel energized.'}
                {personalityType.name === 'The Creator' && 'You prefer smaller, intimate gatherings where deep creative conversations can flow. You enjoy inspiring social settings but need significant alone time for creative work. You connect best with those who appreciate your artistic perspective.'}
                {personalityType.name === 'The Thinker' && 'You prefer meaningful discussions with intellectually stimulating people over casual socializing. Large gatherings drain you quickly. You excel in small groups or one-on-one settings where ideas can be explored deeply. Alone time is essential for your wellbeing.'}
                {personalityType.name === 'The Adventurer' && 'You enjoy active, competitive social settings. You prefer doing things together rather than just talking. Team sports, group adventures, and physical challenges are your ideal social scenarios. You respect those who can keep up with your intensity.'}
                {personalityType.name === 'The Nurturer' && 'You prefer stable, intimate social circles where you can offer consistent care and support. You excel in supportive roles within groups. While you enjoy helping larger communities, you need smaller, closer relationships to feel fulfilled.'}
                {personalityType.name === 'The Visionary' && 'You enjoy networking and connecting with diverse, ambitious individuals. You prefer purpose-driven gatherings over casual hangouts. You\'re energized by people who think big and challenge your vision to make it even better.'}
                {personalityType.name === 'The Catalyst' && 'You prefer authentic, intense interactions over surface-level socializing. You connect best with those ready for transformation and growth. You\'re not afraid of conflict if it leads to deeper truth. Small talk feels like a waste of your energy.'}
                {personalityType.name === 'The Harmonizer' && 'You enjoy bringing diverse groups together and facilitating understanding. You thrive in balanced social settings where everyone feels included. You prefer harmony over intensity and excel at creating comfortable spaces for all personality types.'}
                {personalityType.name === 'The Maverick' && 'You prefer authentic connections with fellow non-conformists. Large traditional gatherings feel stifling. You thrive in alternative social settings where originality is celebrated. You connect deeply but selectively, valuing quality over quantity.'}
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Star size={24} color={Colors.dark.primaryLight} />
                <Text style={styles.sectionTitle}>Stress & Recharge</Text>
              </View>
              <View style={styles.stressRechargeContainer}>
                <View style={styles.stressBox}>
                  <Text style={styles.stressTitle}>What Drains You</Text>
                  {getStressTriggers(personalityType.name).map((trigger, index) => (
                    <Text key={index} style={styles.stressBullet}>• {trigger}</Text>
                  ))}
                </View>
                <View style={styles.rechargeBox}>
                  <Text style={styles.rechargeTitle}>How to Recharge</Text>
                  {getRechargeMethods(personalityType.name).map((method, index) => (
                    <Text key={index} style={styles.rechargeBullet}>• {method}</Text>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.personalityInsight}>
              <Zap size={32} color={Colors.dark.primaryLight} />
              <Text style={styles.insightTitle}>Understanding Your Type</Text>
              <Text style={styles.insightText}>
                Your personality type is a guide to understanding your natural strengths and tendencies. It&apos;s not a limitation but a foundation for growth and authentic self-expression. Use these insights to make deeper connections with others and live more fully as yourself.
              </Text>
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
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 28,
  },
  typeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
  },
  typeCardGradient: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  typeName: {
    fontSize: 36,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  typeTagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  aboutSection: {
    gap: 12,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  aboutDescription: {
    fontSize: 17,
    color: Colors.dark.text,
    lineHeight: 26,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.dark.text,
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
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  relationshipDescription: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  compatibilitySection: {
    gap: 12,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  growthList: {
    gap: 12,
  },
  growthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  growthText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  famousPeople: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  personalityInsight: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  insightText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  personalityQuote: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quoteGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  quoteAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: -8,
    marginBottom: 4,
  },
  traitsContainer: {
    gap: 16,
  },
  traitRow: {
    gap: 8,
  },
  traitLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  traitBarContainer: {
    height: 32,
    backgroundColor: Colors.dark.glass,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  traitBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 7,
    opacity: 0.8,
  },
  traitPercent: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textAlignVertical: 'center',
    lineHeight: 32,
  },
  stressRechargeContainer: {
    gap: 16,
  },
  stressBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  stressTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#ef4444',
    marginBottom: 8,
  },
  stressBullet: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
    marginTop: 4,
  },
  rechargeBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  rechargeTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#22c55e',
    marginBottom: 8,
  },
  rechargeBullet: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
    marginTop: 4,
  },
});
