import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../context/AppContext";
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

export default function ProfileScreen() {
  const { state, setDisplayName, setAvatarUri, logout } = useAppContext();
  const user = state.user;
  const navigation = useNavigation<any>();

  const [name, setName] = useState(user?.displayName ?? "");

  const initials = useMemo(() => {
    const n = (user?.displayName || "U").trim();
    const parts = n.split(" ");
    return (
      (parts[0]?.[0]?.toUpperCase() || "U") +
      (parts[1]?.[0]?.toUpperCase() || "")
    );
  }, [user?.displayName]);

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setDisplayName(trimmed);
    Alert.alert("Saved", "Profile updated");
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow gallery permission to pick a photo.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!res.canceled) {
      const uri = res.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow camera permission to take a photo.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!res.canceled) {
      const uri = res.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    }
  };

  const removePhoto = () => {
    setAvatarUri(null);
  };

  const doLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <Text style={{ color: COLORS.text, textAlign: "center", marginBottom: 12 }}>
            You are not logged in.
          </Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigation.reset({
                index:0,
                routes:[{ name: "Login"}],
              })
            }
          >
            <Text style ={styles.primaryBtnText}>Go to Login</Text>
            </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>

          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {user.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.displayName}</Text>
              <Text style={styles.email}>{user.email}</Text>

              <View style={styles.actionsRow}>
                <Pressable style={styles.smallBtn} onPress={takePhoto}>
                  <Ionicons name="camera-outline" size={18} color={COLORS.text} />
                  <Text style={styles.smallBtnText}>Camera</Text>
                </Pressable>

                <Pressable style={styles.smallBtn} onPress={pickFromGallery}>
                  <Ionicons name="images-outline" size={18} color={COLORS.text} />
                  <Text style={styles.smallBtnText}>Gallery</Text>
                </Pressable>

                <Pressable style={[styles.smallBtn, styles.smallBtnDanger]} onPress={removePhoto}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={[styles.smallBtnText, { color: "#fff" }]}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit name</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color={COLORS.primary} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Display name"
              placeholderTextColor={COLORS.subtext}
              style={styles.input}
            />
          </View>

          <Pressable style={styles.primaryBtn} onPress={saveName}>
            <Text style={styles.primaryBtnText}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable style={styles.logoutBtn} onPress={doLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  profileRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: {
    flex: 1,
    backgroundColor: "rgba(76,154,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.primary, fontSize: 28, fontWeight: "900" },

  name: { color: COLORS.text, fontSize: 18, fontWeight: "900" },
  email: { color: COLORS.subtext, marginTop: 2 },

  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  smallBtnDanger: {
    backgroundColor: COLORS.danger,
    borderColor: "transparent",
  },
  smallBtnText: { color: COLORS.text, fontWeight: "800" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },

  primaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#0b0e13", fontWeight: "900" },

  logoutBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: { color: "#fff", fontWeight: "900" },
});
