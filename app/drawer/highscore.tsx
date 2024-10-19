import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HighScorePage: React.FC = () => {
  const [highscores, setHighscores] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const highscoreStringList = await AsyncStorage.getItem('HighscoreShared');
        const highscoreList = highscoreStringList ? highscoreStringList.split(',').map(Number) : [];
        
        setHighscores(highscoreList);
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };
    
    fetchHighScores();
  }, []);

  return (
    <View style={styles.container}>
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
  scoreText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default HighScorePage;
