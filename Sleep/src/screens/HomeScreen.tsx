import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
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

const API_BASE = "https://TU_API";

type Listing = {
  id: number;
  title: string;
  city: string;
  pricePerNight: number;
  rating: number;
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/listings?featured=true`);
        const data = await res.json();
        setFeatured(Array.isArray(data) ? data : []);
      } catch {
        setFeatured([
          {
            id: 1,
            title: "Cozy Studio",
            city: "Barcelona",
            pricePerNight: 79,
            rating: 4.7,
          },
          {
            id: 2,
            title: "Beach Apartment",
            city: "Valencia",
            pricePerNight: 120,
            rating: 4.9,
          },
          {
            id: 3,
            title: "Mountain Cabin",
            city: "Andorra",
            pricePerNight: 95,
            rating: 4.6,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.logo}>
            <Ionicons name="home-outline" size={28} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Sleep</Text>
            <Text style={styles.subtitle}>Find your perfect stay</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick actions</Text>
          <View style={styles.actionsRow}>
            <Action
              icon="search-outline"
              label="Explore"
              onPress={() => navigation.navigate("Explore")}
            />
            <Action
              icon="calendar-outline"
              label="Trips"
              onPress={() => navigation.navigate("Trips" as never)}
            />
            <Action
              icon="person-circle-outline"
              label="Profile"
              onPress={() => navigation.navigate("Profile" as never)}
            />
          </View>
        </View>

        {/* Featured */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Featured stays</Text>
            <Pressable onPress={() => navigation.navigate("Explore" as never)}>
              <Text style={styles.link}>See all</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
              <Text style={{ color: COLORS.subtext, marginTop: 8 }}>
                Loading...
              </Text>
            </View>
          ) : (
            featured.map((l) => (
              <Pressable
                key={l.id}
                style={styles.rowPress}
                android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                onPress={() =>
                  navigation.navigate(
                    "ListingDetails" as never,
                    { listing: l } as never,
                  )
                }
              >
                <View style={styles.rowLeft}>
                  <IconBadge name="bed-outline" />
                  <View>
                    <Text style={styles.rowLabel}>{l.title}</Text>
                    <Text style={styles.rowValue}>
                      {l.city} • €{l.pricePerNight}/night • ⭐ {l.rating}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.subtext}
                />
              </Pressable>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Action({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function IconBadge({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.iconBadge}>
      <Ionicons name={name} size={18} color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },

  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: "900" },
  subtitle: { color: COLORS.subtext, marginTop: 2 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    overflow: "hidden",
  },
  cardTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingHorizontal: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 12,
  },
  link: { color: COLORS.primary, fontWeight: "800" },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  action: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { color: COLORS.text, fontWeight: "800" },

  rowPress: {
    minHeight: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(76,154,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
  },
  rowLabel: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  rowValue: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

  center: { alignItems: "center", padding: 16 },

  tipCard: {
    backgroundColor: "rgba(76,154,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.18)",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  tipText: { color: COLORS.text, flex: 1, lineHeight: 18 },
});
