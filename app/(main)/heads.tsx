import { View, Text, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";
import LoadingModal from "@/components/LoadingModal";
import HeadCard from "@/components/HeadCard";
import { HeadType } from "@/types";

const Heads = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-all-heads"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-all-heads`,
        { token }
      );
      return data as { allHeads: HeadType[] };
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
    mutationKey: ["delete-head"],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/delete/head`,
        { token, id }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-heads"] });
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
      <Header url="/add-head" />

      <Title>Event Heads</Title>

      <View style={tw`mt-8 w-full h-full px-4`}>
        {data?.allHeads?.length === 0 && (
          <Text style={tw`text-center text-base font-semibold`}>
            No data to show.
          </Text>
        )}
        <FlashList
          data={data?.allHeads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <HeadCard head={item} onDelete={handleDelete} />;
          }}
          estimatedItemSize={30}
          numColumns={2}
        />
      </View>
    </SafeView>
  );
};

export default Heads;
