import {
  View,
  Text,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import React from "react";
import tw from "twrnc";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";

const Participants = () => {
  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <Title>Participants</Title>
      </ScrollView>
    </SafeView>
  );
};

export default Participants;
