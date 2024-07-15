import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#6b7280",
        },
      }}
    >
      <Tabs.Screen
        name="participants"
        options={{
          title: "Participants",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heads"
        options={{
          title: "Heads",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-graduate" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="all-events"
        options={{
          title: "All Events",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanners"
        options={{
          title: "Scanners",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
