// src/screens/EditBookingScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
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

const API_BASE = "http://10.0.2.2:4000"; // json-server

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}
function nightsBetween(start: string, end: string) {
  const a = parseDate(start);
  const b = parseDate(end);
  if (!a || !b) return 0;
  const diff = b.getTime() - a.getTime();
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
}

type Booking = {
  id: number;
  userId: number;
  listingId: number;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: "active" | "cancelled";
  createdAt: number;
};

export default function EditBookingScreen() {
  const navigation = useNavigation<any>();
  const route: any = useRoute();
  const { state } = useAppContext();

  const booking: Booking | undefined = route.params?.booking;

  const [startDate, setStartDate] = useState(booking?.startDate ?? "2026-02-01");
  const [endDate, setEndDate] = useState(booking?.endDate ?? "2026-02-04");
  const [guests, setGuests] = useState(String(booking?.guests ?? 2));
  const [loading, setLoading] = useState(false);

  const nights = useMemo(() => nightsBetween(startDate, endDate), [startDate, endDate]);

  const guestsNum = useMemo(() => {
    const n = Number(guests);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.floor(n));
  }, [guests]);

  const validationError = useMemo(() => {
    if (!booking) return "No booking selected.";
    if (!startDate || !endDate) return "Dates are required.";
    if (!parseDate(startDate) || !parseDate(endDate)) return "Use format YYYY-MM-DD.";
    if (nights <= 0) return "End date must be after start date.";
    if (guestsNum <= 0) return "Guests must be at least 1.";
    return "";
  }, [booking, startDate, endDate, nights, guestsNum]);

  const save = async () => {
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }
    if (!booking) return;

    // Recomendado: solo si está logueado
    if (!state.user) {
      Alert.alert("Login required", "Please login first.");
      navigation.navigate("Login");
      return;
    }

    try {
      setLoading(true);

      // ✅ PUT (requisito)
      const res = await fetch(`${API_BASE}/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          startDate,
          endDate,
          guests: guestsNum,
          // mantenemos totalPrice existente (si quieres recalcular, dímelo)
          updatedAt: Date.now(),
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }

      Alert.alert("Saved", "Booking updated!");
      navigation.goBack();
    } catch (e) {
      // demo fallback
      Alert.alert("Offline demo", "Update simulated (API not available).");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!booking) return;

    Alert.alert("Cancel booking?", "This will mark the booking as cancelled.", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            // ✅ PUT (otra vez) para cambiar status
            const res = await fetch(`${API_BASE}/bookings/${booking.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...booking,
                status: "cancelled",
                updatedAt: Date.now(),
              }),
            });

            if (!res.ok) {
              const t = await res.text();
              throw new Error(t || `HTTP ${res.status}`);
            }

            Alert.alert("Done", "Booking cancelled.");
            navigation.goBack();
          } catch {
            Alert.alert("Offline demo", "Cancel simulated (API not available).");
            navigation.goBack();
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <View style={{ padding: 16, gap: 10 }}>
          <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "900" }}>
            Edit booking
          </Text>
          <Text style={{ color: COLORS.subtext }}>
            No booking received. Go back and select a booking.
          </Text>
          <Pressable
            style={[styles.button, styles.buttonGhost, { marginTop: 10 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.logo}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Edit booking</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              Booking #{booking.id} • status: {booking.status}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update dates & guests</Text>

          <Field
            icon="log-in-outline"
            label="Start date"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
          <Divider />

          <Field
            icon="log-out-outline"
            label="End date"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
          />
          <Divider />

          <Field
            icon="people-outline"
            label="Guests"
            value={guests}
            onChangeText={setGuests}
            placeholder="e.g. 2"
            keyboardType="numeric"
          />

          {validationError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          ) : null}
        </View>

        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Info</Text>
          <Row icon="bed-outline" label="Nights" value={`${nights}`} />
          <Divider />
          <Row icon="cash-outline" label="Total (current)" value={`€${booking.totalPrice}`} />
          <Divider />
          <Row icon="calendar-outline" label="Created" value={new Date(booking.createdAt).toLocaleString()} />
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Pressable
            style={[styles.button, styles.buttonPrimary, loading ? { opacity: 0.75 } : null]}
            onPress={save}
            disabled={loading}
            android_ripple={{ color: "rgba(0,0,0,0.12)" }}
          >
            <Ionicons name="save-outline" size={18} color="#0b0e13" />
            <Text style={[styles.buttonText, { color: "#0b0e13" }]}>
              {loading ? "Saving..." : "Save changes (PUT)"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonGhost]}
            onPress={() => navigation.goBack()}
            android_ripple={{ color: "rgba(255,255,255,0.06)" }}
          >
            <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>

          {booking.status !== "cancelled" ? (
            <Pressable
              style={[styles.button, styles.buttonDanger, loading ? { opacity: 0.75 } : null]}
              onPress={cancel}
              disabled={loading}
              android_ripple={{ color: "rgba(0,0,0,0.12)" }}
            >
              <Ionicons name="close-circle-outline" size={18} color="#fff" />
              <Text style={[styles.buttonText, { color: "#fff" }]}>Cancel booking</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field(props: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.rowLeft}>
        <IconBadge name={props.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>{props.label}</Text>
          <TextInput
            style={styles.input}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={COLORS.subtext}
            keyboardType={props.keyboardType ?? "default"}
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBadge name={icon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
    marginBottom: 6,
    marginTop: 6,
  },

  fieldRow: { paddingHorizontal: 12, paddingVertical: 10 },
  fieldLabel: { color: COLORS.subtext, fontSize: 12, marginBottom: 6 },

  input: {
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
  },

  row: {
    minHeight: 54,
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
    backgroundColor: COLORS.chip,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
  },
  rowLabel: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  rowValue: { color: COLORS.subtext, fontSize: 14 },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },

  errorBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,82,82,0.35)",
    backgroundColor: "rgba(255,82,82,0.10)",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  errorText: { color: COLORS.text, flex: 1 },

  actionsCard: { gap: 10 },

  button: {
    minHeight: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: "transparent",
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.18)",
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderColor: "transparent",
  },
  buttonText: { color: COLORS.text, fontWeight: "800" },
});
