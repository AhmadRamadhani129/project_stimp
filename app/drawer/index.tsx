import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../authContext";

export default function Home() {

  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const { logout } = useAuth();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
      } else {
        setUsername("");
        logout();
      }
    } catch (e) {
      console.error("Error reading username from AsyncStorage", e);
      setUsername("");
      logout();
    }
  };

  useEffect(() => {
    cekLogin();
  }, [username]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={{ color: "red", fontSize: 30 }}>Memory Pattern</Text>
      <Button title="Go to Game" onPress={() => router.push("/game")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "80%",
  },
});
