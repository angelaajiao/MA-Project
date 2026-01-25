import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import TripScreen from "../screens/TripScreen";
import MainTabs from "./MainTabs";
import ProfileScreen from "../screens/ProfileScreen";
import BookingScreen from "../screens/BookingScreen";
import EditBookingScreen from "../screens/EditBookingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ 
          headerShown: true,
          headerStyle :{
            backgroundColor: "#of14220",
          },
          headerTintColor: "#e8eaed",
          headerShadowVisible: false, 
           headerTitleAlign: "center",
         }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: "Login" }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false, headerBackVisible: false }}
        />

        <Stack.Screen 
          name="Explore" 
          component={ExploreScreen} 
          options={{ title: "Explore" }}
        />
        <Stack.Screen 
          name="ListingDetails" 
          component={ListingDetailsScreen} 
        />
        <Stack.Screen
          name="Trips"
          component={TripScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: "Booking" }}
        />
        <Stack.Screen
          name="EditBooking"
          component={EditBookingScreen}
          options={{ title: "EditBooking" }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
