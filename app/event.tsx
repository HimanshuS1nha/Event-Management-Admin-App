import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

const Event = () => {
  const { selectedEvent } = useSelectedEvent();
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["delete-head"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/delete/event`,
        { token, id: selectedEvent.id }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-events"] });
      Alert.alert("Success", data.message);
      router.back();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-20`}
      >
        <ImageBackground
          source={{ uri: selectedEvent.image }}
          style={tw`w-full h-[350px]`}
          resizeMode="stretch"
        >
          <Pressable
            style={tw`absolute top-4 left-4 bg-sky-400 p-1 rounded-full`}
            onPress={router.back}
          >
            <AntDesign name="left" size={22} color="white" />
          </Pressable>
          <View
            style={tw`absolute bottom-0 bg-gray-900/50 h-16 w-full items-start px-3 justify-center`}
          >
            <Text style={tw`text-sky-400 font-bold text-2xl`}>
              {selectedEvent.name}
            </Text>
          </View>
        </ImageBackground>

        <View style={tw`mt-7 flex-row px-4 justify-between`}>
          <View style={tw`gap-y-2`}>
            <Text style={tw`text-white font-medium text-base`}>Date:</Text>
            <Text style={tw`text-gray-300`}>
              {selectedEvent.date?.split(" ")[0]},{" "}
              {selectedEvent.date?.split(" ")[2]}{" "}
              {selectedEvent.date?.split(" ")[1]}
            </Text>
            <Text style={tw`text-gray-300`}>{selectedEvent.time}</Text>
          </View>

          <View style={tw`bg-gray-700 w-[1.5px] h-full`} />

          <View style={tw`gap-y-2`}>
            <Text style={tw`text-white font-medium text-base`}>Location:</Text>
            <Text style={tw`text-gray-300`}>{selectedEvent.location}</Text>
          </View>

          <View style={tw`bg-gray-700 w-[1.5px] h-full`} />

          <View style={tw`gap-y-2`}>
            <Text style={tw`text-white font-medium text-base`}>
              Room Number:
            </Text>
            <Text style={tw`text-gray-300`}>{selectedEvent.roomNo}</Text>
          </View>
        </View>

        <View style={tw`mt-7 px-4 gap-y-2 mb-7`}>
          <Text style={tw`text-white text-lg font-medium`}>About Event</Text>
          <Text style={tw`text-white leading-7 text-justify`}>
            {selectedEvent.description}
          </Text>
        </View>

        {selectedEvent?.rules && (
          <View style={tw`px-4 gap-y-2`}>
            <Text style={tw`text-white text-lg font-medium`}>Rules</Text>
            {selectedEvent?.rules.map((rule, i) => {
              return (
                <View style={tw`flex-row gap-x-3`} key={i}>
                  <Text style={tw`text-white leading-6`}>{i + 1}.</Text>
                  <Text style={tw`text-white leading-6`}>{rule}</Text>
                </View>
              );
            })}
            <View style={tw`flex-row gap-x-3`}>
              <Text style={tw`text-red-500 font-medium leading-6`}>
                {selectedEvent.rules.length + 1}.
              </Text>
              <Text style={tw`text-red-500 font-medium leading-6`}>
                Violation of any rules may result in immediate disqualification
                from the event, at the discretion of the organizers.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={tw`absolute bottom-3 w-full justify-center flex-row gap-x-4`}
      >
        <Pressable
          style={tw`bg-green-600 w-40 items-center py-3 justify-center rounded-lg`}
          onPress={() => router.push("/edit-event-details")}
        >
          <Text style={tw`text-white text-base font-bold`}>Edit Details</Text>
        </Pressable>
        <Pressable
          style={tw`bg-red-600 w-40 items-center py-3 justify-center rounded-lg`}
          onPress={() => {
            Alert.alert("Warning", "Do you want to delete this event?", [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: () => handleDelete(),
              },
            ]);
          }}
        >
          <Text style={tw`text-white text-base font-bold`}>Delete Event</Text>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default Event;
