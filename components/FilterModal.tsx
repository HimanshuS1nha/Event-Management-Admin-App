import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

import Title from "./Title";
import { years } from "@/constants/years";

const FilterModal = ({
  isVisible,
  setIsVisible,
  year,
  setYear,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={tw`bg-black h-[50%] pt-5 px-5 gap-y-7`}>
        <Title>Filters</Title>
        <View style={tw`border border-white rounded-full`}>
          <Picker
            dropdownIconColor={"#fff"}
            style={tw`text-white`}
            selectedValue={year}
          >
            <Picker.Item label="Select a year" value={""} />
            {years.map((year) => {
              return <Picker.Item key={year} label={year} value={year} />;
            })}
          </Picker>
        </View>
        <View style={tw`border border-white rounded-full`}>
          <Picker
            dropdownIconColor={"#fff"}
            style={tw`text-white`}
            selectedValue={year}
          >
            <Picker.Item label="Select a year" value={""} />
            {years.map((year) => {
              return <Picker.Item key={year} label={year} value={year} />;
            })}
          </Picker>
        </View>

        <View style={tw`gap-y-3`}>
          <Pressable
            style={tw`bg-violet-600 items-center justify-center py-3 rounded-full`}
          >
            <Text style={tw`text-white text-base font-medium`}>Apply</Text>
          </Pressable>
          <Pressable
            style={tw`bg-rose-600 items-center justify-center py-3 rounded-full`}
            onPress={() => setIsVisible(false)}
          >
            <Text style={tw`text-white text-base font-medium`}>Cancel</Text>
          </Pressable>
        </View>
      </View>
      <View style={tw`bg-gray-100/40 h-[50%]`}></View>
    </Modal>
  );
};

export default FilterModal;
