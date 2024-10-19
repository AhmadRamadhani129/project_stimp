import { StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout() {
    const { logout } = useAuth();
  
    const doLogout = async () => {
      try {
        await AsyncStorage.removeItem("username");
        logout();
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