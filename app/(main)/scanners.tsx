import { View, Text, ScrollView, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";
import Header from "@/components/Header";
import ScannerCard from "@/components/ScannerCard";

const Scanners = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-all-scanners"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-all-scanners`,
        { token }
      );

      return data as { allScanners: { email: string; id: string }[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response?.data.error);
    } else if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["delete-scanner"],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/delete/scanner`,
        { token, id }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-scanners"] });
      Alert.alert("Success", data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading || isPending} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header url="/add-scanner" />

        <Title>Scanners</Title>

        <View style={tw`mt-8 px-4 w-full h-full`}>
          {data?.allScanners?.length === 0 && (
            <Text style={tw`text-center text-base font-semibold`}>
              No data to show.
            </Text>
          )}
          <FlashList
            data={data?.allScanners}
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
