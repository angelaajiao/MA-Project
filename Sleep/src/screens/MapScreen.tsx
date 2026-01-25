import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Callout, Region } from "react-native-maps";
import * as Location from "expo-location";
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
  danger: "#ff5252",
};

const API_BASE = "http://10.0.2.2:4000";

type Listing = {
  id: number;
  title: string;
  city: string;
  pricePerNight: number;
  rating: number;
  rooms: number;
  lat: number;
  lng: number;
};

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(x));
}

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const { state } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [onlyNear, setOnlyNear] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);

  const region: Region = useMemo(() => {
    if (loc) {
      return {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return {
      latitude: 40.4168,
      longitude: -3.7038,
      latitudeDelta: 7,
      longitudeDelta: 7,
    };
  }, [loc]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Enable location to see stays near you.");
        } else {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLoc({ lat: current.coords.latitude, lng: current.coords.longitude });
        }

        // 2) GET listings
        const res = await fetch(`${API_BASE}/listings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: state.token ? `Bearer ${state.token}` : "",
          },
        });

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        setListings(
          arr.filter((l: any) => Number.isFinite(l.lat) && Number.isFinite(l.lng))
        );
      } catch (e) {
        setListings([
          {
            id: 1,
            title: "Demo Stay (Center)",
            city: "Madrid",
            pricePerNight: 90,
            rating: 4.6,
            rooms: 1,
            lat: 40.4168,
            lng: -3.7038,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [state.token]);

  const visibleListings = useMemo(() => {
    if (!onlyNear || !loc) return listings;
    return listings.filter((l) => distanceKm(loc.lat, loc.lng, l.lat, l.lng) <= radiusKm);
  }, [listings, onlyNear, loc, radiusKm]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: COLORS.subtext, marginTop: 10 }}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Ionicons name="map-outline" size={18} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.title}>Map</Text>
            <Text style={styles.subtitle}>
              {onlyNear && loc ? `Near me (≤ ${radiusKm} km)` : "All stays"}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.chipBtn, onlyNear ? styles.chipBtnOn : null]}
          onPress={() => setOnlyNear((v) => !v)}
        >
          <Ionicons name="navigate-outline" size={16} color={COLORS.text} />
          <Text style={styles.chipBtnText}>Near me</Text>
        </Pressable>
      </View>

      <MapView style={styles.map} initialRegion={region} showsUserLocation={!!loc}>
        {visibleListings.map((l) => (
          <Marker
            key={l.id}
            coordinate={{ latitude: l.lat, longitude: l.lng }}
            title={l.title}
            description={`${l.city} • €${l.pricePerNight}/night`}
            onPress={() => {}}
          >
            <Callout
              onPress={() => navigation.navigate("ListingDetails", { listing: l })}
            >
              <View style={{ maxWidth: 220 }}>
                <Text style={{ fontWeight: "900" }}>{l.title}</Text>
                <Text>{l.city}</Text>
                <Text>€{l.pricePerNight}/night • ⭐ {l.rating}</Text>
                <Text style={{ marginTop: 6, color: "#2e6db3" }}>
                  Tap to open details
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {visibleListings.length} stay(s)
        </Text>

        <Pressable
          style={styles.footerBtn}
          onPress={() => {
            if (!loc) {
              Alert.alert("Location off", "Enable location to use Near me.");
              return;
            }
            setRadiusKm((r) => (r === 10 ? 25 : r === 25 ? 50 : 10));
          }}
        >
          <Ionicons name="options-outline" size={16} color={COLORS.text} />
          <Text style={styles.footerBtnText}>Radius: {radiusKm}km</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.chip,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: COLORS.text, fontSize: 18, fontWeight: "900" },
  subtitle: { color: COLORS.subtext, marginTop: 2, fontSize: 12 },

  chipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  chipBtnOn: {
    backgroundColor: COLORS.chip,
    borderColor: COLORS.chipBorder,
  },
  chipBtnText: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  map: { flex: 1 },

  footer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: { color: COLORS.subtext, fontWeight: "700" },
  footerBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  footerBtnText: { color: COLORS.text, fontWeight: "800", fontSize: 12 },
});
