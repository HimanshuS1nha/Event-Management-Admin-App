import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";

const Scanners = () => {
  return (
    <SafeView>
      <Header />

      <Title>Scanners</Title>
    </SafeView>
  );
};

export default Scanners;
