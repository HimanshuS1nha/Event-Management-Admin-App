import { View, Text, TextInput, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";

const AddScanner = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = useCallback(
    (type: "email" | "password" | "confirmPassword", value: string) => {
      if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );

  const { mutate: handleAddScanner, isPending } = useMutation({});
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <Header showBackButton />

      <Title>Add Scanner</Title>

      <View style={tw`gap-y-6 w-full items-center mt-12`}>
        <View style={tw`gap-y-3 w-[80%]`}>
          <Text style={tw`text-white ml-1.5 font-medium text-base`}>Email</Text>
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
            Password
          </Text>
          <TextInput
            style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
            placeholder="Enter your password"
            placeholderTextColor={"#fff"}
            value={password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
        </View>
        <View style={tw`gap-y-3 w-[80%]`}>
          <Text style={tw`text-white ml-1.5 font-medium text-base`}>
            Confirm Password
          </Text>
          <TextInput
            style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
            placeholder="Confirm your password"
            placeholderTextColor={"#fff"}
            value={confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            secureTextEntry
          />
        </View>

        <Pressable
          style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
          onPress={() => handleAddScanner()}
          disabled={isPending}
        >
          <Text style={tw`text-white text-base font-semibold`}>Add</Text>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default AddScanner;
