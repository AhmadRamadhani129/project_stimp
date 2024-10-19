import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResultPage = ({ route, navigation }: any) => {
  const { score } = route.params;
  const [username, setUsername] = useState("Player");

  // Ambil username dari AsyncStorage
  const getUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error("Error retrieving username: ", error);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.usernameText}>Player: {username}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Play Again"
          onPress={() => navigation.navigate("Game")} // Ganti dengan nama route 'Game'
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="High Score"
          onPress={() => navigation.navigate("HighScore")} // Ganti dengan nama route 'HighScore'
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Main Menu"
          onPress={() => navigation.navigate("MainMenu")} // Ganti dengan nama route 'MainMenu'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSpacing: {
    width: 10, // Jarak antara tombol
  },
});

export default ResultPage;
