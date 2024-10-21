import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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

        const highscoreStringList = await AsyncStorage.getItem(
          "GlobalHighscores"
        );

        let highscoreList: Highscore[] = highscoreStringList
          ? JSON.parse(highscoreStringList)
          : [];

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

        const uniqueHighscores = Object.keys(userHighestScores).map(
          (username) => ({
            username,
            score: userHighestScores[username],
          })
        );

        uniqueHighscores.sort((a, b) => b.score - a.score);

        // Ambil 3 skor teratas
        const topScores = uniqueHighscores.slice(0, 3);

        // Set hasil ke state highscores
        setHighscores(topScores);
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchData();
  }, []);

  const getImage = (index: number) => {
    switch (index) {
      case 0:
        return require("../../assets/images/medali-emas.png");
      case 1:
        return require("../../assets/images/medali-perak.png"); 
      case 2:
        return require("../../assets/images/medali-perunggu.png");
      default:
        return null;
    }
  };

  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>Top 3 Highscores</Text>
        <Card>
          {highscores.length === 0 ? (
            <Text>No high scores yet!</Text>
          ) : (
            highscores.map((item, index) => (
              <View key={index} style={styles.scoreItem}>
                <Image source={getImage(index)} style={styles.image} />
                <Text style={styles.scoreText}>
                  {index + 1}. {item.username}: {item.score}
                </Text>
              </View>
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
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 18,
  },
});

export default HighScorePage;
