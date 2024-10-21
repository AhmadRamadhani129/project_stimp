import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../authContext";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  // const { logout } = useAuth();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
      } else {
        setUsername("");
        // logout();
      }
    } catch (e) {
      console.error("Error reading username from AsyncStorage", e);
      setUsername("");
      // logout();
    }
  };

  useEffect(() => {
    cekLogin();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 1 second fade-in duration
      useNativeDriver: true,
    }).start();
  }, [username]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={{ color: "red", fontSize: 30 }}>Memory Pattern</Text>
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.text}>1. Klik Game pada menu dikiri</Text>
        <Text style={styles.text}>2. Hafalkan kotak yang berwarna Hijau</Text>
        <Text style={styles.text}>3. Pilih kotak berdasarkan urutan yang ada</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonRow, { opacity: fadeAnim }]}>
        <Button title="Go to Game" onPress={() => router.push("/game")} />
      </Animated.View>
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
  header: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "6%",
  },
  text: {
    color: "black",
    fontSize: 20,
    marginBottom: 10, // Added space between text items
  },
  textContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
