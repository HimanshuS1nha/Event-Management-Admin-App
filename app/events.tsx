import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { EventType } from "@/types";
import EventCard from "@/components/EventCard";

const Events = () => {
  const { category } = useLocalSearchParams();
  const { selectedEvent, setSelectedEvent } = useSelectedEvent();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-events"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-events`,
        { category }
      );
      return data as { events: EventType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response?.data.error);
    } else if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header showBackButton />

        <Title>{category} Events</Title>

        {data?.events?.length === 0 && (
          <Text style={tw`text-rose-500 text-center text-2xl mt-10`}>
            No events to show
          </Text>
        )}

        <View style={tw`w-full h-full mt-10`}>
          <FlashList
            data={data?.events}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    setSelectedEvent({ ...item, category: category as string });
                    router.navigate("/event");
                  }}
                >
                  <EventCard event={item} />
                </Pressable>
              );
            }}
            estimatedItemSize={15}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Events;
