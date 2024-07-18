import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { ZodError } from "zod";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { editScannerValidator } from "@/validators/edit-scanner-validator";

const EditScanner = () => {
  const { scannerEmail } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState(scannerEmail as string);

  const handleChange = useCallback((value: string) => setEmail(value), []);

  const { mutate: handleEditScanner, isPending } = useMutation({
    mutationKey: ["edit-scanner"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const parsedData = await editScannerValidator.parseAsync({
        oldEmail: scannerEmail,
        newEmail: email,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/edit-scanner`,
        { token, ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-scanners"] });
      router.back();
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

      <Header showBackButton />

      <Title>Edit Scanner</Title>

      <View style={tw`gap-y-6 w-full items-center mt-12`}>
        <View style={tw`gap-y-3 w-[80%]`}>
          <Text style={tw`text-white ml-1.5 font-medium text-base`}>Email</Text>
          <TextInput
            style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
            placeholder="Enter your email"
            placeholderTextColor={"#fff"}
            value={email}
            onChangeText={(text) => handleChange(text)}
          />
        </View>

        <Pressable
          style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
          onPress={() => handleEditScanner()}
          disabled={isPending}
        >
          <Text style={tw`text-white text-base font-semibold`}>Edit</Text>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default EditScanner;
