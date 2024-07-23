import { View, Text, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

const Pagination = ({
  totalNumberOfPages,
  pageNumber,
}: {
  totalNumberOfPages: number;
  pageNumber: string;
}) => {
  return (
    <View style={tw`flex-row gap-x-4 justify-center mt-4 items-center`}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/participants",
            params: { pageNumber: parseInt(pageNumber) - 1 },
          })
        }
        disabled={pageNumber === "1"}
      >
        <Entypo
          name="chevron-left"
          size={24}
          color={pageNumber === "1" ? "gray" : "white"}
        />
      </Pressable>
      <Text style={tw`text-white text-base font-semibold`}>
        {pageNumber}/{totalNumberOfPages}
      </Text>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/participants",
            params: { pageNumber: parseInt(pageNumber) + 1 },
          })
        }
      >
        <Entypo
          name="chevron-right"
          size={24}
          color={
            pageNumber === totalNumberOfPages.toString() ? "gray" : "white"
          }
        />
      </Pressable>
    </View>
  );
};

export default Pagination;
