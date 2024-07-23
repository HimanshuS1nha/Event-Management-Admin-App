import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";
import LoadingModal from "@/components/LoadingModal";
import ParticipantCard from "@/components/ParticipantCard";
import { useLocalSearchParams } from "expo-router";
import Pagination from "@/components/Pagination";

const Participants = () => {
  const participants = [
    {
      id: "1",
      name: "Random Guy",
      branch: "CSE",
      year: "3rd",
      image:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const searchParams = useLocalSearchParams();
  const pageNumber = (searchParams.pageNumber as string) ?? "1";
  const perPage = 10;

  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-users"],
    queryFn: async () => {
      return { totalNumberOfUsers: 13 };
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
    mutationKey: ["delete-user"],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/delete/user`,
        { token, id }
      );

      return data as { message: string };
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

  useEffect(() => {
    if (data?.totalNumberOfUsers) {
      setTotalNumberOfPages(Math.ceil(data.totalNumberOfUsers / 10));
    }
  }, [data]);
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading || isPending} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <Title>Participants</Title>

        <View style={tw`mt-8 px-4`}>
          <FlashList
            data={participants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <ParticipantCard participant={item} onDelete={handleDelete} />
              );
            }}
            estimatedItemSize={40}
            numColumns={2}
          />
        </View>

        <Pagination
          totalNumberOfPages={totalNumberOfPages}
          pageNumber={pageNumber}
        />
      </ScrollView>
    </SafeView>
  );
};

export default Participants;
