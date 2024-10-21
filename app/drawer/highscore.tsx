import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HighScorePage: React.FC = () => {
  const [highscores, setHighscores] = useState<number[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const storedUsername = await AsyncStorage.getItem("UsernameShared");

        if (storedUsername) {
          setUsername(storedUsername);

          const highscoreStringList = await AsyncStorage.getItem(
            `Highscore_${storedUsername}`
          );
          
          const highscoreList = highscoreStringList
            ? highscoreStringList.split(",").map(Number)
            : [];

          const uniqueHighscores = Array.from(new Set(highscoreList)).sort(
            (a, b) => b - a
          );

          setHighscores(uniqueHighscores);
        } else {

          console.log(
            "User belum login, tidak ada highscore untuk ditampilkan."
          );
        }
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {username && <Text style={styles.username}>{username}</Text>}
      <Text style={styles.title}>High Scores</Text>
      {highscores.length === 0 ? (
        <Text>No high scores yet!</Text>
      ) : (
        highscores.map((score, index) => (
          <Text key={index} style={styles.scoreText}>
            {index + 1}. {score}
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default HighScorePage;
