import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

const Event = () => {
  const { selectedEvent } = useSelectedEvent();

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
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
    </SafeView>
  );
};

export default Event;
