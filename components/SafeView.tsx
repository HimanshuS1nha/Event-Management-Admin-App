import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const SafeView = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SafeAreaView
        style={[
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            flex: 1,
            backgroundColor: "#000",
          },
        ]}
      >
        {children}
      </SafeAreaView>

      <ExpoStatusBar style="light" />
    </>
  );
};

export default SafeView;
