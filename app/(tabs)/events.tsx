import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Plus, Users, Waves, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { Event } from '@/types';

export default function EventsScreen() {
  const { events, addEvent, profile } = useApp();
  const insets = useSafeAreaInsets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleCreateEvent = async () => {
    if (!title.trim() || !profile) {
      console.log('Events: Missing title or profile');
      return;
    }

    console.log('Events: Creating event');

    try {
      const calculateExpiry = (): string => {
        if (!date.trim()) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          return futureDate.toISOString();
        }
        
        try {
          const eventDate = new Date(date.trim());
          if (time.trim()) {
            const [hours, minutes] = time.trim().split(':');
            eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          } else {
            eventDate.setHours(23, 59, 59);
          }
          return eventDate.toISOString();
        } catch (error) {
          console.error('Error parsing date:', error);
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          return futureDate.toISOString();
        }
      };

      const newEvent: Event = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date: date.trim(),
        time: time.trim(),
        creatorId: profile.id,
        creatorName: profile.name,
        attendees: [profile.id],
        rippleLevel: 0,
        expiresAt: calculateExpiry(),
      };

      await addEvent(newEvent);
      console.log('Events: Event created successfully');
      
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Events: Error creating event:', error);
      if (Platform.OS === 'web') {
        alert('Failed to create event. Please try again.');
      }
    }
  };

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Calendar size={40} color={Colors.dark.primaryLight} />
          <Text style={styles.headerTitle}>Events</Text>
          <Text style={styles.headerSubtitle}>
            Create events and watch them ripple through your network
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <LinearGradient
            colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createButtonGradient}
          >
            <Plus size={24} color={Colors.dark.background} />
            <Text style={styles.createButtonText}>Create Event</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.rippleInfo}>
          <Waves size={24} color={Colors.dark.primaryLight} />
          <View style={styles.rippleTextContainer}>
            <Text style={styles.rippleTitle}>The Ripple Effect</Text>
            <Text style={styles.rippleDescription}>
              When you create an event, your friends get notified. When they RSVP, their friends
              get notified too, creating a ripple of connections.
            </Text>
          </View>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color={Colors.dark.textTertiary} />
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first event to start bringing people together
            </Text>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.rippleBadge}>
                    <Waves size={14} color={Colors.dark.primaryLight} />
                    <Text style={styles.rippleLevel}>Level {event.rippleLevel}</Text>
                  </View>
                </View>

                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}

                <View style={styles.eventDetails}>
                  {event.location && (
                    <View style={styles.eventDetail}>
                      <MapPin size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                  )}
                  {event.date && (
                    <View style={styles.eventDetail}>
                      <Calendar size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.eventDetailText}>
                        {event.date} {event.time && `at ${event.time}`}
                      </Text>
                    </View>
                  )}
                  <View style={styles.eventDetail}>
                    <Users size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.eventDetailText}>
                      {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.eventCreator}>Created by {event.creatorName}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Event</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <X size={24} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Event Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="What's happening?"
                    placeholderTextColor={Colors.dark.textTertiary}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Tell people more about your event..."
                    placeholderTextColor={Colors.dark.textTertiary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Where is it?"
                    placeholderTextColor={Colors.dark.textTertiary}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor={Colors.dark.textTertiary}
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Time</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="HH:MM"
                      placeholderTextColor={Colors.dark.textTertiary}
                      value={time}
                      onChangeText={setTime}
                    />
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
                onPress={handleCreateEvent}
                disabled={!title.trim()}
              >
                <LinearGradient
                  colors={
                    title.trim()
                      ? ['#059669', '#10B981', '#2ECC71', '#00FF88']
                      : [Colors.dark.backgroundTertiary, Colors.dark.backgroundTertiary]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}
                >
                  <Text
                    style={[
                      styles.submitButtonText,
                      !title.trim() && styles.submitButtonTextDisabled,
                    ]}
                  >
                    Create Event
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  rippleInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 16,
  },
  rippleTextContainer: {
    flex: 1,
    gap: 8,
  },
  rippleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  rippleDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  eventsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  eventCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  rippleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.primaryDark,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rippleLevel: {
    fontSize: 12,
    color: Colors.dark.primaryLight,
    fontWeight: '600' as const,
  },
  eventDescription: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  eventCreator: {
    fontSize: 13,
    color: Colors.dark.textTertiary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  modalForm: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  submitButtonTextDisabled: {
    color: Colors.dark.textTertiary,
  },
});
