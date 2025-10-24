import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QrCode, UserPlus, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { Friend, PersonalityType } from '@/types';

export default function AddFriendScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addFriend, profile } = useApp();
  const [friendCode, setFriendCode] = useState('');
  const [showMyCode, setShowMyCode] = useState(false);

  const myCode = profile?.id.slice(-6).toUpperCase() || 'XXXXXX';

  const handleAddFriend = async () => {
    if (!friendCode.trim() || !profile) {
      console.log('AddFriend: Missing friend code or profile');
      return;
    }

    console.log('AddFriend: Adding friend with code:', friendCode);

    try {
      const mockFriend: Friend = {
        id: Date.now().toString(),
        name: `Friend ${friendCode.slice(0, 3)}`,
        personalityType: 'The Connector' as PersonalityType,
        color: '#3498DB',
        connectedAt: new Date().toISOString(),
        bio: 'Met through Touch Grass!',
      };

      await addFriend(mockFriend);
      console.log('AddFriend: Friend added successfully');

      setFriendCode('');

      if (Platform.OS === 'web') {
        alert('Friend added successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Friend added successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('AddFriend: Error adding friend:', error);
      if (Platform.OS === 'web') {
        alert('Failed to add friend. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to add friend. Please try again.');
      }
    }
  };

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={28} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Friend</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <QrCode size={32} color={Colors.dark.primaryLight} />
            <Text style={styles.sectionTitle}>Your Friend Code</Text>
          </View>

          <TouchableOpacity
            style={styles.codeCard}
            onPress={() => setShowMyCode(!showMyCode)}
          >
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{showMyCode ? myCode : '••••••'}</Text>
            </View>
            <Text style={styles.codeHint}>
              {showMyCode ? 'Tap to hide' : 'Tap to reveal'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            Share this code with someone nearby to connect
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserPlus size={32} color={Colors.dark.primaryLight} />
            <Text style={styles.sectionTitle}>Enter Friend Code</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            placeholderTextColor={Colors.dark.textTertiary}
            value={friendCode}
            onChangeText={(text) => setFriendCode(text.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.addButton, !friendCode.trim() && styles.addButtonDisabled]}
            onPress={handleAddFriend}
            disabled={!friendCode.trim()}
          >
            <LinearGradient
              colors={
                friendCode.trim()
                  ? [Colors.dark.primary, Colors.dark.primaryLight]
                  : [Colors.dark.backgroundTertiary, Colors.dark.backgroundTertiary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Text
                style={[
                  styles.addButtonText,
                  !friendCode.trim() && styles.addButtonTextDisabled,
                ]}
              >
                Add Friend
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            1. Meet someone in person{'\n'}
            2. Share your friend codes{'\n'}
            3. Enter their code to connect{'\n'}
            4. Watch your friendship forest grow!
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  codeCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  codeDisplay: {
    backgroundColor: Colors.dark.backgroundTertiary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
    letterSpacing: 4,
  },
  codeHint: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  input: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 20,
    color: Colors.dark.text,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  addButtonTextDisabled: {
    color: Colors.dark.textTertiary,
  },
  infoCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginTop: 'auto',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
});
