import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Friend, Event, Trophy } from '@/types';
import { availableTrophies } from '@/mocks/trophies';

export const [AppProvider, useApp] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isNetworkingMode, setIsNetworkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(async () => {
    try {
      console.log('AppContext: Loading data from AsyncStorage');
      setIsLoading(true);
      const [profileData, friendsData, eventsData] = await Promise.all([
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('friends'),
        AsyncStorage.getItem('events'),
      ]);

      console.log('AppContext: Profile data loaded:', profileData ? 'exists' : 'null');

      const [feedbackData, countData] = await Promise.all([
        AsyncStorage.getItem('userFeedback'),
        AsyncStorage.getItem('userCount'),
      ]);

      setFeedbackSubmitted(!!feedbackData);
      setUserCount(countData ? parseInt(countData, 10) : 0);

      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        console.log('AppContext: Parsed profile name:', parsedProfile.name);
        console.log('AppContext: Parsed profile personality:', parsedProfile.personalityType);
        const friendsList = friendsData ? JSON.parse(friendsData) : [];
        const trophies = checkTrophies(parsedProfile, friendsList);
        
        const updatedProfile = {
          ...parsedProfile,
          trophies,
          handshakes: parsedProfile.handshakes ?? friendsList.length,
          grassPoints: parsedProfile.grassPoints ?? friendsList.length * 10,
          totalNetworkingTime: parsedProfile.totalNetworkingTime ?? 0,
          networkingStats: parsedProfile.networkingStats ?? {
            averageFriendsPerDay: 0,
            totalTimeThisWeek: 0,
            totalTimeThisMonth: 0,
            topLocations: [],
            sessionsCompleted: 0,
          },
        };
        
        setProfile(updatedProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } else {
        setProfile(null);
      }
      if (friendsData) setFriends(JSON.parse(friendsData));
      if (eventsData) {
        const parsedEvents = JSON.parse(eventsData);
        const now = new Date();
        const activeEvents = parsedEvents.filter((event: Event) => {
          if (!event.expiresAt) return true;
          return new Date(event.expiresAt) > now;
        });
        setEvents(activeEvents);
        if (activeEvents.length !== parsedEvents.length) {
          await AsyncStorage.setItem('events', JSON.stringify(activeEvents));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (mounted) {
        await loadData();
      }
    };
    
    setTimeout(() => {
      init();
    }, 0);
    
    return () => {
      mounted = false;
    };
  }, [loadData]);

  const checkTrophies = (userProfile: UserProfile, userFriends: Friend[]): Trophy[] => {
    const trophies = availableTrophies.map(trophy => {
      const existing = userProfile.trophies?.find(t => t.id === trophy.id);
      if (existing?.isUnlocked) {
        return {
          ...trophy,
          ...existing,
          isUnlocked: true,
        };
      }

      let shouldUnlock = false;

      switch (trophy.id) {
        case '1':
          shouldUnlock = userFriends.length >= 1;
          break;
        case '6':
          shouldUnlock = userFriends.length >= 10;
          break;
        case '7':
          shouldUnlock = true;
          break;
        default:
          shouldUnlock = false;
      }

      if (shouldUnlock && !existing?.isUnlocked) {
        return {
          ...trophy,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return {
        ...trophy,
        isUnlocked: false,
      };
    });

    return trophies;
  };

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  }, [profile]);

  const saveProfile = useCallback(async (newProfile: UserProfile) => {
    console.log('AppContext: Saving new profile:', newProfile.name, newProfile.personalityType);
    setProfile(newProfile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
    console.log('AppContext: Profile saved and state updated');
  }, []);

  const addFriend = useCallback(async (friend: Friend) => {
    console.log('AppContext: Adding friend:', friend);
    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);
    await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));

    if (profile) {
      const updatedTrophies = checkTrophies(profile, updatedFriends);
      const newHandshakes = updatedFriends.length;
      const newGrassPoints = (profile.grassPoints || 0) + 10;
      
      const updatedProfile = {
        ...profile,
        trophies: updatedTrophies,
        handshakes: newHandshakes,
        grassPoints: newGrassPoints,
      };
      
      setProfile(updatedProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      console.log('AppContext: Friend added, updated profile');
    }
  }, [friends, profile]);

  const removeFriend = useCallback(async (friendId: string) => {
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
  }, [friends]);

  const addEvent = useCallback(async (event: Event) => {
    console.log('AppContext: Adding event:', event);
    try {
      const eventWithExpiry = {
        ...event,
        expiresAt: event.expiresAt || calculateExpiry(event.date, event.time),
      };
      
      const updatedEvents = [...events, eventWithExpiry];
      setEvents(updatedEvents);
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      console.log('AppContext: Event added successfully');
    } catch (error) {
      console.error('AppContext: Error adding event:', error);
      throw error;
    }
  }, [events]);

  const calculateExpiry = (date: string, time: string): string => {
    try {
      if (!date) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        return futureDate.toISOString();
      }
      
      const eventDate = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':');
        eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      }
      return eventDate.toISOString();
    } catch (error) {
      console.error('Error calculating expiry:', error);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      return futureDate.toISOString();
    }
  };

  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>) => {
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    );
    setEvents(updatedEvents);
    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
  }, [events]);

  const deleteEvent = useCallback(async (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
  }, [events]);

  const toggleNetworkingMode = useCallback(() => {
    setIsNetworkingMode(prev => !prev);
  }, []);

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    await loadData();
  }, [loadData]);

  return useMemo(
    () => ({
      profile,
      friends,
      events,
      isNetworkingMode,
      isLoading,
      isInitialized,
      userCount,
      feedbackSubmitted,
      updateProfile,
      saveProfile,
      addFriend,
      removeFriend,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleNetworkingMode,
      reloadData,
    }),
    [
      profile,
      friends,
      events,
      isNetworkingMode,
      isLoading,
      isInitialized,
      userCount,
      feedbackSubmitted,
      updateProfile,
      saveProfile,
      addFriend,
      removeFriend,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleNetworkingMode,
      reloadData,
    ]
  );
});
