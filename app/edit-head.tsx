import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { editHeadValidator } from "@/validators/edit-head-validator";

const EditHead = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-head-details"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-head-details`,
        { id }
      );
      return data as {
        head: { name: string; image: string; phoneNumber: string };
      };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = useCallback(
    (type: "name" | "phoneNumber", value: string) => {
      if (type === "name") {
        setName(value);
      } else if (type === "phoneNumber") {
        setPhoneNumber(value);
      }
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

  const { mutate: handleEditHead, isPending } = useMutation({
    mutationKey: ["edit-head"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const parsedData = await editHeadValidator.parseAsync({
        name,
        image,
        phoneNumber,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/edit-head`,
        { ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-heads"] });
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
    },
  });

  useEffect(() => {
    if (data?.head) {
      setName(data?.head?.name);
      setImage(data?.head?.image);
      setPhoneNumber(data?.head?.phoneNumber);
    }
  }, [data?.head]);
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading || isPending} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        <Header showBackButton />

        <Title>Edit Head</Title>

        <View style={tw`gap-y-6 w-full items-center mt-10`}>
          {image && (
            <View style={tw`items-center`}>
              <View>
                <Image
                  source={{
                    uri: image,
                  }}
                  style={tw`w-32 h-32 rounded-full`}
                />
                <Pressable
                  style={tw`absolute bottom-0 right-0`}
                  onPress={pickImage}
                >
                  <MaterialIcons name="change-circle" size={40} color="white" />
                </Pressable>
              </View>
            </View>
          )}
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Name
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your name"
              placeholderTextColor={"#fff"}
              value={name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Phone Number
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your phone number"
              placeholderTextColor={"#fff"}
              value={phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              keyboardType="number-pad"
            />
          </View>
          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleEditHead()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Add</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default EditHead;
