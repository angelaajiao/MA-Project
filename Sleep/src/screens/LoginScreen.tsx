import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

const API_BASE = "http://10.0.2.2:4000"; //para angela

const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
};

export default function LoginScreen({ navigation }: any) {
  const { login } = useAppContext();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const canLogin =
    email.trim().length > 3 && displayName.trim().length > 1 && pwd.length >= 3;

  const onLogin = async () => {
    if (email.trim().length < 3 || pwd.length < 3) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/users?email=${encodeURIComponent(email.trim().toLowerCase())}&password=${encodeURIComponent(pwd)}`,
      );
      const users = await res.json();
      if (!Array.isArray(users) || users.length === 0) {
        Alert.alert("Error", "Invalid email or password");
        return;
      }

      const fakeToken = `token_${Date.now()}`;
      const user = users[0];

      await login({ token: fakeToken, user });

      navigation.reset({
        index: 0,
        routes: [{name: "Home"}],
        });
    } catch (e) {
      Alert.alert("Error", "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons
              name="sparkles-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.subtext} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#7c8799"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Display name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color={COLORS.subtext} />
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#7c8799"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.subtext}
            />
            <TextInput
              style={styles.input}
              value={pwd}
              onChangeText={setPwd}
              placeholder="••••••••"
              placeholderTextColor="#7c8799"
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowPwd((v) => !v)}
              style={styles.iconBtn}
            >
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={COLORS.subtext}
              />
            </Pressable>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#3a455a", true: "#2e6db3" }}
                thumbColor={rememberMe ? COLORS.primary : "#dfe3ea"}
              />
              <Text style={styles.remember}>Remember me</Text>
            </View>

            <Pressable
              onPress={() => Alert.alert("Info", "Not implemented yet")}
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onLogin}
            android_ripple={{ color: "rgba(0,0,0,0.12)" }}
            style={[styles.btn, !canLogin && { opacity: 0.5 }]}
          >
            <Text style={styles.btnText}>Enter app</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Register")}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            style={styles.btnGhost}
          >
            <Ionicons name="person-add-outline" size={16} color={COLORS.text} />
            <Text style={styles.btnGhostText}>no account? Register</Text>
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              style={styles.socialBtn}
              onPress={() => Alert.alert("Info", "Not implemented yet")}
            >
              <Ionicons name="logo-google" size={18} color={COLORS.text} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              style={styles.socialBtn}
              onPress={() => Alert.alert("Info", "Not implemented yet")}
            >
              <Ionicons name="logo-github" size={18} color={COLORS.text} />
              <Text style={styles.socialText}>GitHub</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  header: { alignItems: "center", gap: 6, marginTop: 12, marginBottom: 6 },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  subtitle: { color: COLORS.subtext, fontSize: 14 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  label: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  iconBtn: { padding: 4, borderRadius: 8 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  remember: { color: COLORS.subtext, fontSize: 13 },
  forgot: { color: COLORS.primary, fontSize: 13, fontWeight: "700" },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginTop: 8,
  },
  btnText: { color: "#0b0e13", fontWeight: "800", fontSize: 15 },

  btnGhost: {
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnGhostText: { color: COLORS.text, fontWeight: "700" },

  orRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  orText: { color: COLORS.subtext, fontSize: 12 },

  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  socialText: { color: COLORS.text, fontWeight: "700" },
});
