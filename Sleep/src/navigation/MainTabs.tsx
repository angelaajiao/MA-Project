import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import TripScreen from "../screens/TripScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#0f1420" },
        headerTintColor: "#e8eaed",
        tabBarStyle: { backgroundColor: "#121a2a", borderTopColor: "#1f2b40" },
        tabBarActiveTintColor: "#4c9aff",
        tabBarInactiveTintColor: "#a8b0bd",
        tabBarIcon: ({ color, size }) => {
          let icon: any = "home-outline";
          if (route.name === "HomeTab") icon = "home-outline";
          if (route.name === "ExploreTab") icon = "search-outline";
          if (route.name === "TripsTab") icon = "calendar-outline";
          if (route.name === "ProfileTab") icon = "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} options={{ title: "Explore" }} />
      <Tab.Screen name="TripsTab" component={TripScreen} options={{ title: "Trips" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
