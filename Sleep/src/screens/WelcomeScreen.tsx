import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
};

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Ionicons name="home-outline" size={36} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Sleep</Text>
        <Text style={styles.subtitle}>Find your perfect stay</Text>

        <View style={styles.card}>
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => navigation.navigate("Login" as never)}
          >
            <Ionicons name="log-in-outline" size={18} color="#0b0e13" />
            <Text style={[styles.buttonText, { color: "#0b0e13" }]}>
              Login
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonGhost]}
            onPress={() => navigation.navigate("Register" as never)}
          >
            <Ionicons name="person-add-outline" size={18} color={COLORS.text} />
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    gap: 14,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  button: {
    minHeight: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: "transparent",
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.18)",
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "800",
  },
});
