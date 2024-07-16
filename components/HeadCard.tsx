import { View, Text, Image, Pressable, Alert } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import { Feather, FontAwesome } from "@expo/vector-icons";

import { HeadType } from "@/types";

const HeadCard = ({
  head,
  onDelete,
}: {
  head: HeadType;
  onDelete: (id: string) => void;
}) => {
  return (
    <View
      style={tw`bg-gray-700 rounded-lg py-4 w-[95%] mb-2.5 items-center justify-center gap-y-3.5`}
    >
      <Image source={{ uri: head.image }} style={tw`w-24 h-24 rounded-full`} />

      <View style={tw`gap-y-1 items-center`}>
        <Text style={tw`text-xl font-medium text-white`}>{head.name}</Text>
        <Text style={tw`font-medium text-gray-300`}>{head.eventName}</Text>
      </View>

      <View style={tw`flex-row gap-x-3`}>
        <Pressable
          style={tw`bg-green-600 p-2 rounded-full items-center justify-center`}
        >
          <Feather name="edit-2" size={20} color="white" />
        </Pressable>
        <Pressable
          style={tw`bg-rose-600 p-2 rounded-full items-center justify-center`}
          onPress={() => {
            Alert.alert("Warning", "Do you want to delete this event?", [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: () => onDelete(head.id),
              },
            ]);
          }}
        >
          <FontAwesome name="trash" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(HeadCard);
