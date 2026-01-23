import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
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
  danger: "#ff5252",
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { login } = useAppContext();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = useMemo(() => {
    if (!displayName) return "U";
    const parts = displayName.trim().split(" ");
    return (
      (parts[0]?.[0]?.toUpperCase() || "U") +
      (parts[1]?.[0]?.toUpperCase() || "")
    );
  }, [displayName]);

  const handleRegister = async () => {
    if (!email || !displayName || !password || !confirm) {
      Alert.alert("Error", "Complete all fields");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://TU_API/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          password,
        }),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();

      await login({
        token: data.token,
        user: data.user,
      });

      navigation.navigate("Home" as never);
    } catch (err) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>Create account</Text>
          <Text style={styles.handle}>
            Join us and start your journey!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User information</Text>

          <Input
            icon="person-outline"
            placeholder="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <Divider />

          <Input
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Divider />

          <Input
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Divider />

          <Input
            icon="lock-closed-outline"
            placeholder="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
        </View>

        <View style={styles.card}>
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Ionicons name="person-add-outline" size={18} color="#0b0e13" />
            <Text style={[styles.buttonText, { color: "#0b0e13" }]}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonGhost]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="log-in-outline" size={18} color={COLORS.text} />
            <Text style={styles.buttonText}>Already have an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({ icon, ...props }: any) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBadge name={icon} />
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.subtext}
          {...props}
        />
      </View>
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
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(76,154,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(76,154,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: { color: COLORS.primary, fontSize: 28, fontWeight: "800" },
  name: { color: COLORS.text, fontSize: 20, fontWeight: "800" },
  handle: { color: COLORS.subtext },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    gap: 4,
  },

  cardTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  row: {
    minHeight: 54,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },

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

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },

  button: {
    minHeight: 44,
    marginHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    marginBottom: 10,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: "transparent",
  },

  buttonGhost: {
    borderColor: "rgba(255,255,255,0.2)",
  },

  buttonText: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
