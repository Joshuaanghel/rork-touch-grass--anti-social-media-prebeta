import { Tabs } from "expo-router";
import { User, Leaf, Users, Calendar } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primaryLight,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.dark.backgroundSecondary,
          borderTopColor: Colors.dark.border,
          borderTopWidth: 1,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: Colors.dark.backgroundSecondary,
        },
        headerTintColor: Colors.dark.text,
      }}
    >
      <Tabs.Screen
        name="touch-grass"
        options={{
          title: "Touch Grass",
          tabBarIcon: ({ color }) => <Leaf color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => <Users color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <Calendar color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tabs>
  );
}
