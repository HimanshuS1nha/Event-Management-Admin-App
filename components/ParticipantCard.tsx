import { View, Text } from "react-native";
import React, { memo } from "react";

const ParticipantCard = ({
  participant,
}: {
  participant: {
    id: string;
    image: string;
    namae: string;
    branch: string;
    year: string;
  };
}) => {
  return (
    <View>
      <Text>ParticipantCard</Text>
    </View>
  );
};

export default memo(ParticipantCard);
