import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";

interface Highscore {
  username: string;
  score: number;
}

const HighScorePage: React.FC = () => {
  const [highscores, setHighscores] = useState<Highscore[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil daftar skor global dari AsyncStorage
        const highscoreStringList = await AsyncStorage.getItem("GlobalHighscores");

        // Jika ada data, parsing stringnya menjadi array of objects
        let highscoreList: Highscore[] = highscoreStringList
          ? JSON.parse(highscoreStringList)
          : [];

        // Buat objek untuk menyimpan skor tertinggi dari setiap pengguna
        const userHighestScores: { [username: string]: number } = {};

        // Loop untuk menentukan skor tertinggi dari setiap user
        highscoreList.forEach((item) => {
          if (
            !userHighestScores[item.username] || 
            userHighestScores[item.username] < item.score
          ) {
            userHighestScores[item.username] = item.score;
          }
        });

        // Ubah objek menjadi array highscore yang valid
        const uniqueHighscores = Object.keys(userHighestScores).map(
          (username) => ({
            username,
            score: userHighestScores[username],
          })
        );

        // Urutkan berdasarkan skor, dari yang tertinggi ke terendah
        uniqueHighscores.sort((a, b) => b.score - a.score);

        // Ambil hanya 3 skor teratas
        const top3Highscores = uniqueHighscores.slice(0, 3);

        // Set hasil ke state highscores
        setHighscores(top3Highscores);
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>Top 3 High Scores</Text>
        <Card>
          {highscores.length === 0 ? (
            <Text>No high scores yet!</Text>
          ) : (
            highscores.map((item, index) => (
              <Text key={index} style={styles.scoreText}>
                {index + 1}. {item.username}: {item.score}
              </Text>
            ))
          )}
        </Card>
      </View>
    </Card>
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
  scoreText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default HighScorePage;
