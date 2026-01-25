import React, { useMemo } from "react";
import { View, Text, StyleSheet,Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { API_BASE } from "../config/api";
import { useNavigation } from "@react-navigation/native";


const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
  danger: "#ff5252",
};



export default function TripScreen() {
      const { state } = useAppContext();
      const user = state.user;
      const navigation = useNavigation<any>();


      const [loading, setLoading] = useState(true);
      const [bookings, setBookings] = useState([]);
      const [listings, setListings] = useState([]);
      const listingById = useMemo(() => {
       const map = new Map();
                   listings.forEach((l) => map.set(Number(l.id), l));

                    return map;
                  }, [listings]);



  useEffect(() => {


    const loadBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        const [bRes, lRes] = await Promise.all([
          fetch(`${API_BASE}/bookings?userId=${user.id}`),
          fetch(`${API_BASE}/listings`),
        ]);

        const bData = await bRes.json();
        const lData = await lRes.json();

        setBookings(Array.isArray(bData) ? bData : []);
        setListings(Array.isArray(lData) ? lData : []);

      } catch (e) {
        console.log("Error loading bookings", e);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);
  const cancelBooking = async (booking) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          status: "cancelled",
        }),
      });

      if (!res.ok) throw new Error("Cancel failed");


      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );

      Alert.alert("Done", "Booking cancelled.");
    } catch (e) {
      console.log("Cancel error", e);
      Alert.alert("Error", "Could not cancel booking.");
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor: COLORS.bg}}>
      <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : bookings.length === 0 ? (
        <Text style={styles.text}>You don’t have any trips yet.</Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title}>My Trips</Text>

          {bookings.map((b) => {
            const listing = listingById.get(Number(b.listingId));
            return (
              <View key={b.id} style={styles.card}>
                <Text style={styles.tripTitle}>
                  {listing ? listing.title : `Listing #${b.listingId}`}
                </Text>

                {listing && <Text style={styles.text}>{listing.city}</Text>}

                <Text style={styles.text}>{b.startDate} → {b.endDate}</Text>
                <Text style={styles.text}>Total: €{b.totalPrice}</Text>

                <Text style={styles.status}>{b.status.toUpperCase()}</Text>
                
                <View style={styles.actionsRow}>
                  <Pressable
                      style={styles.editBtn}
                      onPress={() => navigation.navigate("EditBooking", { booking: b })}
                  >
                    <Ionicons name="create-outline" size={18} color="#0b0e13" />
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>


                  {b.status !== "cancelled" && (
                    <Pressable style={styles.cancelBtn} onPress={() => cancelBooking(b)}>
                      <Ionicons name="close-circle-outline" size={18} color="#fff" />
                      <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      </View>
    </SafeAreaView>

  );

}

const styles = StyleSheet.create({
 container: {
   flex: 1,
    padding: 16,
    gap:16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    color: COLORS.text,
  },
  text: {
    fontSize: 16,
    color: COLORS.subtext,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  status: {
    marginTop: 6,
    fontWeight: "800",
    color: COLORS.primary,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
  actionsRow: {
  flexDirection: "row",
  gap: 10,
  marginTop: 10,
},

editBtn: {
  flex: 1,
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
},

editText: {
  color: "#0b0e13",
  fontWeight: "900",
},

});
