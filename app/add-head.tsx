import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";

const AddHead = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = useCallback(
    (
      type: "name" | "email" | "phoneNumber" | "password" | "confirmPassword",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "email") {
        setEmail(value);
      } else if (type === "phoneNumber") {
        setPhoneNumber(value);
      } else if (type === "password") {
        setPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );

  const { mutate: handleAddHead, isPending } = useMutation({
    mutationKey: ["add-head"],
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <Header showBackButton />

      <Title>Add Head</Title>
    </SafeView>
  );
};

export default AddHead;
