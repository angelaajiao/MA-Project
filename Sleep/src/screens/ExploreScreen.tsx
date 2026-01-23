import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../context/AppContext";

const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
  chip: "rgba(76,154,255,0.12)",
  chipBorder: "rgba(76,154,255,0.25)",
};

const API_BASE = "http://10.0.2.2:4000";

type Listing = {
  id: number;
  title: string;
  city: string;
  pricePerNight: number;
  rating: number;
  rooms: number;
};

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { state } = useAppContext();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Listing[]>([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorText("");

      try {
        const res = await fetch(`${API_BASE}/listings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: state.token ? `Bearer ${state.token}` : "",
          },
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErrorText("Using demo data (API not available).");
        setItems([
          { id: 1, title: "Cozy Studio near Center", city: "Barcelona", pricePerNight: 79, rating: 4.7, rooms: 1 },
          { id: 2, title: "Beach Apartment with View", city: "Valencia", pricePerNight: 120, rating: 4.9, rooms: 2 },
          { id: 3, title: "Modern Loft", city: "Madrid", pricePerNight: 95, rating: 4.6, rooms: 1 },
          { id: 4, title: "Mountain Cabin", city: "Andorra", pricePerNight: 110, rating: 4.8, rooms: 3 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [state.token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  }, [items, query]);

  const goDetails = (listing: Listing) => {
    navigation.navigate("ListingDetails", { listing });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.logo}>
              <Ionicons name="search-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Explore</Text>
              <Text style={styles.subtitle}>Find your perfect stay</Text>
            </View>

            <Pressable
              style={styles.smallIconBtn}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              onPress={() => navigation.navigate("Profile" as never)}
            >
              <Ionicons name="person-circle-outline" size={22} color={COLORS.text} />
            </Pressable>
          </View>

          {/* Search */}
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color={COLORS.subtext} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search city or title..."
              placeholderTextColor={COLORS.subtext}
              style={styles.searchInput}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={COLORS.subtext} />
              </Pressable>
            )}
          </View>

          {/* chips */}
          <View style={styles.chipsRow}>
            <Chip text="Top rated" icon="star-outline" />
            <Chip text="Budget" icon="pricetag-outline" />
            <Chip text="2+ rooms" icon="bed-outline" />
          </View>

          {errorText ? <Text style={styles.warn}>{errorText}</Text> : null}
        </View>

        {/* Listings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stays</Text>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
              <Text style={{ color: COLORS.subtext, marginTop: 8 }}>Loading...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="alert-circle-outline" size={22} color={COLORS.subtext} />
              <Text style={{ color: COLORS.subtext, marginTop: 8 }}>
                No results. Try another search.
              </Text>
            </View>
          ) : (
            filtered.map((l, idx) => (
              <View key={l.id}>
                <Pressable
                  style={styles.rowPress}
                  android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                  onPress={() => goDetails(l)}
                >
                  <View style={styles.rowLeft}>
                    <IconBadge name="home-outline" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowLabel} numberOfLines={1}>
                        {l.title}
                      </Text>
                      <Text style={styles.rowValue}>
                        {l.city} • €{l.pricePerNight}/night • ⭐ {l.rating} • {l.rooms} room(s)
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
                </Pressable>

                {idx !== filtered.length - 1 && <Divider />}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


function Chip({
  text,
  icon,
}: {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color={COLORS.primary} />
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

function IconBadge({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.iconBadge}>
      <Ionicons name={name} size={18} color={COLORS.primary} />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },

  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.chip,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  smallIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: "900" },
  subtitle: { color: COLORS.subtext, marginTop: 2 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.chip,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
  },
  chipText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

  warn: { color: COLORS.subtext, fontSize: 12 },

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
    marginBottom: 6,
    marginTop: 6,
  },

  rowPress: {
    minHeight: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.chip,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
  },
  rowLabel: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  rowValue: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },
  center: { alignItems: "center", padding: 16 },
});
