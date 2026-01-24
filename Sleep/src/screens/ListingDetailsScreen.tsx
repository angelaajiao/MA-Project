import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
};

export default function ListingDetailsScreen({ route, navigation }: any) {
  const listing = route?.params?.listing;

  if (!listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <View style={styles.container}>
          <Text style={styles.title}>No listing data</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.btn}>
            <Text style={styles.btnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.subtitle}>{listing.city}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Price/night</Text>
            <Text style={styles.value}>€{listing.pricePerNight}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Rating</Text>
            <Text style={styles.value}>⭐ {listing.rating}</Text>
          </View>

          <Pressable
            style={styles.btnPrimary}
            onPress={() => {
              navigation.navigate("Booking", {listing})
            }}
          >
            <Text style={styles.btnPrimaryText}>Book now</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 8,
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: "900" },
  subtitle: { color: COLORS.subtext, marginBottom: 8 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  label: { color: COLORS.subtext },
  value: { color: COLORS.text, fontWeight: "800" },

  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  btnPrimaryText: { color: "#0b0e13", fontWeight: "900" },

  btn: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: COLORS.text, fontWeight: "800" },
});
