import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";

const EditHead = () => {
  const { id } = useLocalSearchParams();

  const { mutate: handleEditHead, isPending } = useMutation({
    mutationKey: ["edit-head"],
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header showBackButton />

        <Title>Edit Head</Title>
      </ScrollView>
    </SafeView>
  );
};

export default EditHead;
