import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trees, UserPlus, Users as UsersIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function FriendsScreen() {
  const router = useRouter();
  const { friends } = useApp();
  const insets = useSafeAreaInsets();
  
  const handleAddFriend = useCallback(() => {
    router.push('/add-friend');
  }, [router]);
  const [scaleAnim] = useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const treeCount = Math.min(friends.length, 20);
  const forestStage = friends.length === 0 ? 'sapling' : friends.length < 5 ? 'growing' : 'forest';

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.forestSection}>
          <Text style={styles.forestTitle}>Your Friendship Forest</Text>
          <Text style={styles.forestSubtitle}>
            {friends.length === 0
              ? 'Plant your first tree by making a connection'
              : `${friends.length} ${friends.length === 1 ? 'tree' : 'trees'} planted`}
          </Text>

          <View style={styles.forestContainer}>
            <Animated.View
              style={[
                styles.forestVisualization,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {friends.length === 0 ? (
                <View style={styles.saplingContainer}>
                  <View style={styles.sapling}>
                    <View style={styles.saplingLeaf} />
                    <View style={styles.saplingStem} />
                  </View>
                  <Text style={styles.saplingText}>Your forest awaits...</Text>
                </View>
              ) : (
                <View style={styles.treesGrid}>
                  {Array.from({ length: treeCount }).map((_, index) => (
                    <View key={index} style={styles.treeIcon}>
                      <Trees
                        size={forestStage === 'growing' ? 32 : 40}
                        color={friends[index]?.color || Colors.dark.primary}
                      />
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={handleAddFriend}
        >
          <LinearGradient
            colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addFriendGradient}
          >
            <UserPlus size={24} color={Colors.dark.background} />
            <Text style={styles.addFriendText}>Add Friend</Text>
          </LinearGradient>
        </TouchableOpacity>

        {friends.length > 0 && (
          <View style={styles.friendsList}>
            <View style={styles.friendsHeader}>
              <UsersIcon size={24} color={Colors.dark.primaryLight} />
              <Text style={styles.friendsTitle}>Your Connections</Text>
            </View>

            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={[styles.friendAvatar, { backgroundColor: friend.color }]}>
                  <Text style={styles.friendAvatarText}>
                    {friend.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendPersonality}>{friend.personalityType}</Text>
                  {friend.bio && (
                    <Text style={styles.friendBio} numberOfLines={2}>
                      {friend.bio}
                    </Text>
                  )}
                  <Text style={styles.friendDate}>
                    Connected {new Date(friend.connectedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
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
    paddingBottom: 40,
  },
  forestSection: {
    paddingTop: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  forestTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  forestSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  forestContainer: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forestVisualization: {
    width: '100%',
    alignItems: 'center',
  },
  saplingContainer: {
    alignItems: 'center',
    gap: 20,
  },
  sapling: {
    alignItems: 'center',
  },
  saplingLeaf: {
    width: 30,
    height: 30,
    backgroundColor: Colors.dark.primary,
    borderRadius: 15,
    marginBottom: -5,
  },
  saplingStem: {
    width: 4,
    height: 60,
    backgroundColor: Colors.dark.primaryDark,
    borderRadius: 2,
  },
  saplingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic' as const,
  },
  treesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  treeIcon: {
    padding: 8,
  },
  addFriendButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  addFriendGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  addFriendText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  friendsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  friendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  friendsTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  friendCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    flexDirection: 'row',
    gap: 16,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatarText: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  friendInfo: {
    flex: 1,
    gap: 4,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  friendPersonality: {
    fontSize: 14,
    color: Colors.dark.primaryLight,
    fontWeight: '600' as const,
  },
  friendBio: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  friendDate: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
    marginTop: 4,
  },
});
