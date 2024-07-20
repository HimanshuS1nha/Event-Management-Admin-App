import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Entypo, FontAwesome } from "@expo/vector-icons";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { addHeadValidator } from "@/validators/add-head-validator";

const AddHead = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = useCallback(
    (
      type: "name" | "email" | "phoneNumber" | "password" | "confirmPassword",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "email") {
        setEmail(value);
      } else if (type === "phoneNumber") {
        setPhoneNumber(value);
      } else if (type === "password") {
        setPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
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

  const { mutate: handleAddHead, isPending } = useMutation({
    mutationKey: ["add-head"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const parsedData = await addHeadValidator.parseAsync({
        email,
        password,
        confirmPassword,
        name,
        image,
        phoneNumber,
      });
      if (parsedData.password !== parsedData.confirmPassword) {
        throw new Error("Passwrds do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/add-head`,
        { token, ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-heads"] });
      Alert.alert("Success", data.message);
      setName("");
      setEmail("");
      setImage("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
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
      <LoadingModal isVisible={isPending} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        <Header showBackButton />

        <Title>Add Head</Title>

        <View style={tw`gap-y-6 w-full items-center mt-10`}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={tw`w-[100px] h-[100px] rounded-full`}
            />
          ) : (
            <View
              style={tw`bg-gray-700 rounded-full w-[100px] h-[100px] items-center justify-center`}
            >
              <FontAwesome name="user" size={70} color="white" />

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
              placeholder="Enter your name"
              placeholderTextColor={"#fff"}
              value={name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Email
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your email"
              placeholderTextColor={"#fff"}
              value={email}
              onChangeText={(text) => handleChange("email", text)}
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
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Password
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your password"
              placeholderTextColor={"#fff"}
              value={password}
              secureTextEntry
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Confirm Password
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your password"
              placeholderTextColor={"#fff"}
              value={confirmPassword}
              secureTextEntry
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
          </View>
          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleAddHead()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Add</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default AddHead;
