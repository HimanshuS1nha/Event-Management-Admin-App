import { View, Image, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useUser } from "@/hooks/useUser";

const Header = ({
  showBackButton = false,
}: {
  showBackButton?: boolean;
}) => {
  const { setIsLoggedIn } = useUser();

  const handleLogout = useCallback(async () => {
    await SecureStore.deleteItemAsync("is-logged-in");
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
    router.replace("/login");
  }, []);
  return (
    <View style={tw`px-4 pt-2 mb-5 flex-row items-center justify-between`}>
      {showBackButton ? (
        <Pressable onPress={router.back}>
          <AntDesign name="left" size={20} color="white" />
        </Pressable>
      ) : (
        <Image
          source={require("../assets/images/logo.webp")}
          style={tw`w-10 h-10 rounded-full`}
        />
      )}

      <View style={tw`flex-row gap-x-4 items-center`}>
        <Pressable
          onPress={() => {
            Alert.alert("Warning", "Do you want to logout?", [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: async () => {
                  await handleLogout();
                  router.replace("/login");
                },
              },
            ]);
          }}
        >
          <MaterialCommunityIcons name="logout" size={27} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
