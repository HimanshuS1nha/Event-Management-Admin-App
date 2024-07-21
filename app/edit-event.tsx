import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";

const EditEvent = () => {
  const { selectedEvent } = useSelectedEvent();

  const { mutate: handleEditEvent, isPending } = useMutation({
    mutationKey: ["edit-event"],
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />
      <Header showBackButton />

      <Title>Edit Event</Title>
    </SafeView>
  );
};

export default EditEvent;
