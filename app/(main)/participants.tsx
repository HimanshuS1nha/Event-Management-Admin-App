import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { ZodError } from "zod";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import Header from "@/components/Header";
import LoadingModal from "@/components/LoadingModal";
import ParticipantCard from "@/components/ParticipantCard";
import { useLocalSearchParams } from "expo-router";
import Pagination from "@/components/Pagination";
import { getUsersValidator } from "@/validators/get-users-validator";
import { UserType } from "@/types";
import FilterModal from "@/components/FilterModal";

const Participants = () => {
  const searchParams = useLocalSearchParams();
  const pageNumber = (searchParams.pageNumber as string) ?? "1";
  const perPage = 10;

  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-users"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const parsedData = await getUsersValidator.parseAsync({
        pageNumber: parseInt(pageNumber) - 1,
        perPage,
        branch,
        year,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-users`,
        { token, ...parsedData }
      );

      return data as {
        totalNumberOfUsers: number;
        users: UserType[];
      };
    },
  });
  if (error) {
    if (error instanceof ZodError) {
      Alert.alert("Error", error.errors[0].message);
    } else if (error instanceof AxiosError && error.response?.data.error) {
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
      setTotalNumberOfPages(Math.ceil(data.totalNumberOfUsers / perPage));
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [pageNumber]);
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading || isPending} />
      <FilterModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        year={year}
        setYear={setYear}
        branch={branch}
        setBranch={setBranch}
        getUsers={refetch}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        <Header setIsVisible={setIsModalVisible} />

        <Title>Participants</Title>

        <View style={tw`mt-8 px-4 w-full h-full`}>
          {data?.users?.length === 0 && (
            <Text style={tw`text-base font-medium text-center text-rose-600`}>
              No data to show.
            </Text>
          )}
          <FlashList
            data={data?.users}
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
      </ScrollView>
      <View
        style={tw`absolute bottom-0 w-full pb-4 items-center bg-black h-16`}
      >
        <Pagination
          totalNumberOfPages={totalNumberOfPages}
          pageNumber={pageNumber}
        />
      </View>
    </SafeView>
  );
};

export default Participants;
