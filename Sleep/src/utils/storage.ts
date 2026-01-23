import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../context/AppContext";
// Key under which we save data on the phone
const STORAGE_KEY = "SLEEP_APP_DATA_V1";

type SavedData = {
  user: User | null;
};

export const saveAppData = async (data: SavedData) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const loadAppData = async (): Promise<SavedData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load data", e);
    return null;
  }
};
