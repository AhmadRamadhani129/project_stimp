import { StyleSheet, View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout() {
  const { logout } = useAuth();

  const doLogout = async () => {
    try {
      const username = await AsyncStorage.getItem("UsernameShared");

      if (username) {

        await AsyncStorage.removeItem("UsernameShared");
        console.log(`User ${username} has logged out but other data remains.`);

        logout();
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (e) {
      console.error("Error logging out", e);
    }
  };

  useEffect(() => {
    doLogout();
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
}
