import { Text, ImageBackground, Pressable, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useLocalSearchParams, router } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";
import { useUser } from "@/hooks/useUser";
import { verifyValidator } from "@/validators/verify-validator";

const Verify = () => {
  const { email } = useLocalSearchParams();
  const { setIsLoggedIn } = useUser();

  const [otp, setOtp] = useState("");

  const handleChange = useCallback((text: string) => {
    setOtp(text);
  }, []);

  const { mutate: handleVerify, isPending } = useMutation({
    mutationKey: ["verify"],
    mutationFn: async () => {
      const parsedData = await verifyValidator.parseAsync({ email, otp });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/verify/admin`,
        { ...parsedData }
      );

      return data as { token: string };
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("is-logged-in", "true");
      await SecureStore.setItemAsync("token", data.token);
      setIsLoggedIn(true);
      router.replace("/participants");
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });

  const { mutate: handleResendOtp, isPending: otpResendPending } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/resend-otp/admin`,
        { email }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending || otpResendPending} />

      <ImageBackground
        source={require("../..//assets/images/login-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-8`}
      >
        <Title>Verify to Login</Title>

        <OTPTextInput
          inputCount={6}
          keyboardType="number-pad"
          tintColor={"#38bdf8"}
          textInputStyle={tw`text-white`}
          handleTextChange={handleChange}
        />

        <Pressable
          style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
          onPress={() => handleVerify()}
          disabled={isPending || otpResendPending}
        >
          <Text style={tw`text-white text-base font-semibold`}>Verify</Text>
        </Pressable>

        <Pressable
          onPress={() => handleResendOtp()}
          disabled={isPending || otpResendPending}
        >
          <Text style={tw`text-blue-400 text-center text-base font-bold`}>
            Resend OTP
          </Text>
        </Pressable>
      </ImageBackground>
    </SafeView>
  );
};

export default Verify;
