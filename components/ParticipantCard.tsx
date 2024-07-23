import { View, Text, Image, Pressable, Alert } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

const ParticipantCard = ({
  participant,
  onDelete,
}: {
  participant: {
    id: string;
    image: string;
    name: string;
    branch: string;
    year: string;
  };
  onDelete: (id: string) => void;
}) => {
  return (
    <View
      style={tw`bg-gray-700 rounded-lg py-4 w-[95%] mb-2.5 items-center justify-center gap-y-3.5`}
    >
      <Image
        source={{ uri: participant.image }}
        style={tw`w-24 h-24 rounded-full`}
      />

      <View style={tw`gap-y-1 items-center`}>
        <Text style={tw`text-xl font-medium text-white px-2 text-center`}>
          {participant.name}
        </Text>
        <Text style={tw`font-medium text-gray-300`}>
          {participant.branch} {participant.year} year
        </Text>
      </View>

      <Pressable
        style={tw`bg-rose-600 p-1.5 rounded-full items-center justify-center absolute top-1.5 right-1.5`}
        onPress={() => {
          Alert.alert("Warning", "Do you want to delete this event?", [
            {
              text: "No",
            },
            {
              text: "Yes",
              onPress: () => onDelete(participant.id),
            },
          ]);
        }}
      >
        <FontAwesome name="trash" size={20} color="white" />
      </Pressable>
    </View>
  );
};

export default memo(ParticipantCard);
