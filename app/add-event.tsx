import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";

const AddEvent = () => {
  const { mutate: handleAddEvent, isPending } = useMutation({
    mutationKey: ["add-event"],
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        <Header showBackButton />

        <Title>Add Event</Title>
      </ScrollView>
    </SafeView>
  );
};

export default AddEvent;
