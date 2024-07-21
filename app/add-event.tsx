import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import DateTimePicker from "@react-native-community/datetimepicker";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { eventCategories } from "@/constants/event-categories";
import { addEventValidator } from "@/validators/add-event-validator";

const AddEvent = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [rules, setRules] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [date, setDate] = useState(new Date().toDateString());
  const [time, setTime] = useState("");
  const [heads, setHeads] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const items2 = [
    {
      id: 1,
      name: "Yo",
    },
    {
      id: 2,
      name: "Go",
    },
  ];

  const handleChange = useCallback(
    (
      type:
        | "name"
        | "category"
        | "rules"
        | "description"
        | "location"
        | "roomNo"
        | "date"
        | "time",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "category") {
        setCategory(value);
      } else if (type === "rules") {
        setRules(value);
      } else if (type === "description") {
        setDescription(value);
      } else if (type === "location") {
        setLocation(value);
      } else if (type === "roomNo") {
        setRoomNo(value);
      } else if (type === "date") {
        setDate(value);
      } else if (type === "time") {
        setTime(value);
      }
    },
    []
  );

  const handleChangeDate = useCallback(
    ({ type }: any, selectedDate: Date | undefined) => {
      if (type === "set") {
        if (selectedDate) {
          setDate(selectedDate.toDateString());
        }
      }
      setShowDatePicker(false);
    },
    []
  );

  const pickImage = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
      });
      if (res.canceled) {
        return;
      }
      const base64 = `data:image/png;base64,${res.assets?.[0].base64}`;
      setImage(base64);
    } catch (error) {
      Alert.alert("Error", "Some error occured.");
    }
  }, []);

  const handleSelectHeads = useCallback((items: string[]) => {
    setHeads(items);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-unassigned-heads"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-unassigned-heads`,
        { token }
      );

      return data as { unassignedHeads: { id: string; name: string }[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }

  const { mutate: handleAddEvent, isPending } = useMutation({
    mutationKey: ["add-event"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const parsedData = await addEventValidator.parseAsync({
        name,
        image,
        category,
        rules: rules.split("\n"),
        description,
        location,
        roomNo: parseInt(roomNo),
        date,
        time,
        heads,
      });

      return true;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading || isPending} />
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date(date)}
          onChange={handleChangeDate}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        <Header showBackButton />

        <Title>Add Event</Title>

        <View style={tw`gap-y-6 w-full items-center mt-10`}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={tw`w-[100px] h-[100px] rounded-full`}
            />
          ) : (
            <View
              style={tw`bg-gray-700 rounded-full w-[130px] h-[130px] items-center justify-center`}
            >
              <FontAwesome name="photo" size={70} color="white" />

              <Pressable
                style={tw`absolute rounded-full bottom-0 bg-green-500 p-1 right-0`}
                onPress={pickImage}
              >
                <Entypo name="plus" size={28} color="white" />
              </Pressable>
            </View>
          )}

          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Name
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter event name"
              placeholderTextColor={"#fff"}
              value={name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Category
            </Text>
            <View style={tw`border border-white rounded-lg`}>
              <Picker
                style={tw`text-white`}
                dropdownIconColor={"#fff"}
                onValueChange={(value) =>
                  handleChange("category", value as string)
                }
                selectedValue={category}
              >
                <Picker.Item label="Select a category" value={""} />
                {eventCategories.map((eventCategory) => {
                  return (
                    <Picker.Item
                      key={eventCategory}
                      label={eventCategory}
                      value={eventCategory}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Rules
              </Text>
              <Text style={tw`text-rose-500`}>
                (Separate two rules with a new line)
              </Text>
            </View>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter rules of the event"
              placeholderTextColor={"#fff"}
              value={rules}
              onChangeText={(text) => handleChange("rules", text)}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Description
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter description of the event"
              placeholderTextColor={"#fff"}
              value={description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Location
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter event's location"
              placeholderTextColor={"#fff"}
              value={location}
              onChangeText={(text) => handleChange("location", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Room Number
              </Text>
              <Text style={tw`text-rose-500`}>(Optional)</Text>
            </View>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter event's room number"
              placeholderTextColor={"#fff"}
              value={roomNo}
              onChangeText={(text) => handleChange("roomNo", text)}
              keyboardType="number-pad"
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Date
              </Text>
              <Text style={tw`text-rose-500`}>(Optional)</Text>
            </View>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter date"
                placeholderTextColor={"#fff"}
                value={date}
                editable={false}
              />
            </Pressable>
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <View style={tw`flex-row items-center gap-x-2`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Time
              </Text>
              <Text style={tw`text-rose-500`}>(with AM or PM)</Text>
            </View>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter time"
              placeholderTextColor={"#fff"}
              value={time}
              onChangeText={(text) => handleChange("time", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Heads
            </Text>
            <SectionedMultiSelect
              items={data?.unassignedHeads}
              IconRenderer={MaterialIcons as any}
              uniqueKey="id"
              selectText="Select heads"
              showDropDowns={true}
              onSelectedItemsChange={handleSelectHeads}
              selectedItems={heads}
              colors={{ selectToggleTextColor: "#fff" }}
              hideSearch
              showCancelButton
            />
          </View>

          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleAddEvent()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Add</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default AddEvent;
