import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";

const Participants = () => {
  return (
    <SafeView>
      <Header url="" />

      <Title>Participants</Title>
    </SafeView>
  );
};

export default Participants;