import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert, Text } from "react-native";
import { Button } from "@rneui/themed";

const { width, height } = Dimensions.get("window");

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak: number[];
  onLevelComplete: () => void; // Fungsi untuk level up
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

      // Jika semua kotak yang benar sudah ditekan
      if (activeKotak.length + 1 === highlightedKotak.length) {
        onLevelComplete(); // Memanggil fungsi untuk menaikkan level
      }
    } else {
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
      setIncorrectAnswer((prevAnswer) => {
        const newAnswer = prevAnswer + 1;
        if (newAnswer >= 3) {
          onGameOver();
        }
        return incorrectAnswer;
      });
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

const App: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [highlightedKotak, setHighlightedKotak] = useState<number[]>([]);
  const [score, setScore] = useState(0); // Skor dimulai dari 0
  const [gameOver, setGameOver] = useState(false);
  const columns = 3; // Definisikan jumlah kolom tetap di sini

  useEffect(() => {
    const generateHighlightedKotak = () => {
      const numberOfKotakToHighlight = level + 2; // 3 untuk level 1, 4 untuk level 2, 5 untuk level 3
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

  const nextLevel = () => {
    if (level < 3) {
      // Maksimal level 3
      setLevel((prevLevel) => prevLevel + 1);
      setScore((prevScore) => prevScore + 1); // Tambah 10 poin per level
    } else {
      Alert.alert("Selamat!", "Anda telah menyelesaikan semua level!");
    }
  };

  const handleGameOver = () => {
    Alert.alert("Game Over", "Anda telah membuat terlalu banyak kesalahan", [
      {
        text: "Play Again",
        onPress: () => {
          setLevel(1);
          setScore(0);
          setGameOver(false);
        },
      },
      {
        text: "Main Menu",
        onPress: () => console.log("Pindah ke halaman lain"), // Ganti dengan navigasi ke halaman lain
      },
    ]);
    setGameOver(true);
  };

  const rows = 3 + level - 1; // 3 untuk level 1, 4 untuk level 2, 5 untuk level 3

  if (gameOver) {
    return null; // Ketika game over, hentikan rendering game
  }

  return (
    <View style={styles.appContainer}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Grid
        rows={rows}
        columns={columns} // Menggunakan nilai kolom yang sudah didefinisikan
        highlightedKotak={highlightedKotak}
        onLevelComplete={nextLevel} // Mengirim fungsi untuk level up
        onGameOver={handleGameOver} // Mengirim fungsi untuk game over
        score={score} // Kirim skor ke komponen grid
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
});

export default App;
