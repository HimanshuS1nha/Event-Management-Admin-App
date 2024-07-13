import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";

const Events = () => {
  const { category } = useLocalSearchParams();
  return (
    <SafeView>
      <ScrollView>
        <Header showBackButton />

        <Title>{category} Events</Title>
      </ScrollView>
    </SafeView>
  );
};

export default Events;
