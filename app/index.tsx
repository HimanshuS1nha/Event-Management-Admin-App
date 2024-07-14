import { useUser } from "@/hooks/useUser";
import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (isLoggedIn) {
        router.replace("/participants");
      } else {
        router.replace("/login");
      }
    }
  }, [rootNavigationState?.key]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
