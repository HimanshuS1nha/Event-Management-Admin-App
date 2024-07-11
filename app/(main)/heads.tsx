import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";

const Heads = () => {
  return (
    <SafeView>
      <Header url="" />

      <Title>Event Heads</Title>
    </SafeView>
  );
};

export default Heads;
