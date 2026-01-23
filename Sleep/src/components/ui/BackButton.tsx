import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  border: "rgba(255,255,255,0.18)",
  text: "#e8eaed",
};

export default function BackButton({
  style,
  fallbackRouteName,
}: {
  style?: ViewStyle;
  fallbackRouteName?: string; // por si no hay back (raro)
}) {
  const navigation = useNavigation<any>();

  const onPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else if (fallbackRouteName) navigation.navigate(fallbackRouteName);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.btn, style]}
      android_ripple={{ color: "rgba(255,255,255,0.10)" }}
      hitSlop={10}
    >
      <Ionicons name="arrow-back-outline" size={20} color={COLORS.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
