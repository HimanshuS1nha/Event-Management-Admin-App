import { View, Text, Pressable, Alert } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

const ScannerCard = ({
  scanner,
  onDelete,
}: {
  scanner: { id: string; email: string };
  onDelete: (id: string) => void;
}) => {
  return (
    <View
      style={tw`px-4 py-6 bg-gray-700 rounded-lg flex-row justify-between items-center`}
    >
      <Text style={tw`text-white font-medium text-base w-[70%]`}>
        {scanner.email}
      </Text>
      <Pressable
        style={tw`bg-rose-600 p-2 rounded-full items-center justify-center`}
        onPress={() => {
          Alert.alert("Warning", "Do you want to delete this event?", [
            {
              text: "No",
            },
            {
              text: "Yes",
              onPress: () => onDelete(scanner.id),
            },
          ]);
        }}
      >
        <FontAwesome name="trash" size={20} color="white" />
      </Pressable>
    </View>
  );
};

export default memo(ScannerCard);
