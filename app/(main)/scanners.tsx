import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";
import Header from "@/components/Header";
import ScannerCard from "@/components/ScannerCard";
import { useMutation } from "@tanstack/react-query";

const Scanners = () => {
  const scanners = [
    {
      id: "1",
      email: "random@email.com",
    },
  ];

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["delete-scanner"],
    mutationFn: async (id: string) => {},
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <Title>Scanners</Title>

        <View style={tw`mt-7 px-5`}>
          <FlashList
            data={scanners}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <ScannerCard scanner={item} onDelete={handleDelete} />
            )}
            estimatedItemSize={40}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Scanners;
