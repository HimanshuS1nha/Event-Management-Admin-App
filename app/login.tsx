import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
} from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import { Entypo } from "@expo/vector-icons";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = useCallback(
    (type: "email" | "password", value: string) => {
      if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      }
    },
    []
  );

  const changePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, [isPasswordVisible]);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <ImageBackground
        source={require("../assets/images/login-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-12`}
      >
        <Title>Login as Admin</Title>

        <View style={tw`gap-y-6 w-full items-center`}>
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
              Password
            </Text>
            <View>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your password"
                placeholderTextColor={"#fff"}
                value={password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable
                style={tw`absolute right-3 top-[30%]`}
                onPress={changePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <Entypo name="eye-with-line" size={24} color="white" />
                ) : (
                  <Entypo name="eye" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleLogin()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Login</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeView>
  );
};

export default Login;
