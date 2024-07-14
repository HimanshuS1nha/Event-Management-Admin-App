import { Text, ImageBackground, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useLocalSearchParams, router } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
      router.replace("/all-participants");
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <ImageBackground
        source={require("../..//assets/images/login-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-8`}
      >
        <Title>Verify</Title>

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
          disabled={isPending}
        >
          <Text style={tw`text-white text-base font-semibold`}>Login</Text>
        </Pressable>
      </ImageBackground>
    </SafeView>
  );
};

export default Verify;
