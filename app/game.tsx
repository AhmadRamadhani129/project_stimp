import React, { useState, useEffect, Component } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Button, LinearProgress } from "@rneui/themed";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak: number[];
  onLevelComplete: () => void;
  onGameOver: () => void;
  score: number;
}

const Grid: React.FC<GridProps> = ({
  rows,
  columns,
  highlightedKotak,
  onLevelComplete,
  onGameOver,
  score,
}) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState(0);

  useEffect(() => {
    setActiveKotak(highlightedKotak);
    setIncorrectKotak([]);
    setIncorrectAnswer(0);

    const timer = setTimeout(() => {
      setActiveKotak([]);
      setIncorrectKotak([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedKotak]);

  const handleBoxPress = (index: number) => {
    if (highlightedKotak.includes(index)) {
      setActiveKotak((prevKotak) => [...prevKotak, index]);

      if (activeKotak.length + 1 === highlightedKotak.length) {
        onLevelComplete();
      }
    } else {
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
      onGameOver();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              width: 150 / columns - 10,
              height: 150 / rows - 10,
              backgroundColor: activeKotak.includes(index)
                ? "green"
                : incorrectKotak.includes(index)
                ? "red"
                : "gray",
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <Button
              size="lg"
              title=""
              onPress={() => handleBoxPress(index)}
              color="transparent"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

//Membuat Timer
function toHHMMSS(v: any) {
  const time = parseInt(v, 10);
  if (isNaN(time)) {
    return "Invalid input"; 
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;
  const hours_str = hours < 10 ? "0" + hours : hours.toString();
  const minutes_str = minutes < 10 ? "0" + minutes : minutes.toString();
  const seconds_str = seconds < 10 ? "0" + seconds : seconds.toString();
  return hours_str + ":" + minutes_str + ":" + seconds_str; 
}

const App: React.FC = () => {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [highlightedKotak, setHighlightedKotak] = useState<number[]>([]);
  const [score, setScore] = useState(0); 
  const [gameOver, setGameOver] = useState(false);
  const columns = 3; 
  const [count, setCount] = useState(60);
  const batas = 60;

  useEffect(() => {
    const generateHighlightedKotak = () => {
      const numberOfKotakToHighlight = level + 2; 
      const kotakToHighlight: number[] = [];

      while (kotakToHighlight.length < numberOfKotakToHighlight) {
        const randomKotak = Math.floor(Math.random() * (rows * columns));
        if (!kotakToHighlight.includes(randomKotak)) {
          kotakToHighlight.push(randomKotak);
        }
      }
      setHighlightedKotak(kotakToHighlight);
    };

    generateHighlightedKotak();
  }, [level]);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer); 
    } else {
      handleGameOver(); 
    }
  }, [count]);

  const nextLevel = () => {
    if (level < 5) {
      setLevel((prevLevel) => prevLevel + 1);
      setScore((prevScore) => prevScore + 1);
      setCount(60);
    } else {
      setScore((prevScore) => prevScore + 1); 
      setTimeout(() => {
        Alert.alert("Selamat!", "Anda telah menyelesaikan semua level!");
        handleGameOver(); 
      }, 0); 
    }
  };
  
  const handleGameOver = async () => {
    try {
      //Mengambil Username dari Async Storage
      const storedUsername = await AsyncStorage.getItem("UsernameShared");    
      if (storedUsername) { 
        const globalHighscore = await AsyncStorage.getItem("GlobalHighscores");
        let highscoreList = globalHighscore ? JSON.parse(globalHighscore) : []; //Mengubah data yang didapat jadi json
        highscoreList.push({ username: storedUsername, score });
        await AsyncStorage.setItem(
          "GlobalHighscores",
          JSON.stringify(highscoreList) //Mengubah json jadi string
        );
        router.push({ pathname: "/result", params: { score } });
      } else {
        console.error("No user is logged in. Unable to save high score.");
      }
  
      setGameOver(true);
    } catch (error) {
      console.error("Error saving high score:", error);
    }
  };
     
  const rows = 3 + level - 1; 

  if (gameOver) {
    return null;
  }

  return (
    <View style={styles.appContainer}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.levelText}>Level: {level}</Text>
      <Text>Timer: {toHHMMSS(count)}</Text>
      <Grid
        rows={rows}
        columns={columns} 
        highlightedKotak={highlightedKotak}
        onLevelComplete={nextLevel} 
        onGameOver={handleGameOver} 
        score={score} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  container: {
    width: 150,
    height: 150,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ADD8E6",
    padding: 5,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  box: {
    margin: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  levelText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default App;
