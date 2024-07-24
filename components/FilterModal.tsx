import { View, Text, Modal, Pressable } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

import Title from "./Title";
import { years } from "@/constants/years";
import { branches } from "@/constants/branches";

const FilterModal = ({
  isVisible,
  setIsVisible,
  year,
  setYear,
  branch,
  setBranch,
  getUsers,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  branch: string;
  setBranch: React.Dispatch<React.SetStateAction<string>>;
  getUsers: () => void;
}) => {
  const handleChange = useCallback((type: "year" | "branch", value: string) => {
    if (type === "year") {
      setYear(value);
    } else if (type === "branch") {
      setBranch(value);
    }
  }, []);
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={tw`bg-black h-[50%] pt-5 px-5 gap-y-7`}>
        <Title>Filters</Title>
        <View style={tw`border border-white rounded-full`}>
          <Picker
            dropdownIconColor={"#fff"}
            style={tw`text-white`}
            selectedValue={year}
            onValueChange={(value) => handleChange("year", value)}
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
            selectedValue={branch}
            onValueChange={(value) => handleChange("branch", value)}
          >
            <Picker.Item label="Select branch" value={""} />
            {branches.map((branch) => {
              return (
                <Picker.Item
                  key={branch.value}
                  label={branch.label}
                  value={branch.value}
                />
              );
            })}
          </Picker>
        </View>

        <View style={tw`gap-y-3`}>
          <Pressable
            style={tw`bg-violet-600 items-center justify-center py-3 rounded-full`}
            onPress={() => {
              getUsers();
              setIsVisible(false);
            }}
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
      <View style={tw`bg-gray-100/25 h-[50%]`}></View>
    </Modal>
  );
};

export default FilterModal;
