import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";
import LoadingModal from "@/components/LoadingModal";
import ParticipantCard from "@/components/ParticipantCard";
import { useMutation } from "@tanstack/react-query";

const Participants = () => {
  const participants = [
    {
      id: "1",
      name: "Random Guy",
      branch: "CSE",
      year: "3rd",
      image:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id: string) => {},
  });
  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <Title>Participants</Title>

        <View style={tw`mt-8 w-full h-full px-4`}>
          <FlashList
            data={participants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <ParticipantCard participant={item} onDelete={handleDelete} />
              );
            }}
            estimatedItemSize={40}
            numColumns={2}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Participants;
