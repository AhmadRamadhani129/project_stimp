import React, { useState, useEffect } from "react";
import {StyleSheet,View,Text,TouchableOpacity,Alert,FlatList,} from "react-native";

export default function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [userTurn, setUserTurn] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const getGridSize = () => 3 * (level + 2);

  const getPatternCount = () => level + 2;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setLevel(1);
    setScore(0);
    generatePattern();
  };

  const generatePattern = () => {
    setUserTurn(false);
    const gridSize = getGridSize();
    let newPattern: number[] = [];
    for (let i = 0; i < getPatternCount(); i++) {
      newPattern.push(Math.floor(Math.random() * gridSize));
    }
    setPattern(newPattern);
    showPattern(newPattern);
  };

  function showPattern(newPattern: number[]) {
    let i = 0;
    const showNextTile = () => {
      if (i < newPattern.length) {
        setActiveTile(newPattern[i]);
        setTimeout(() => {
          setActiveTile(null);
          i++;
          setTimeout(showNextTile, 300);
        }, 500);
      } else {
        setUserTurn(true);
        setUserPattern([]);
      }
    };
    showNextTile();
  }

  const onTileTapped = (index: number) => {
    if (!userTurn) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    setActiveTile(index);

    setTimeout(() => {
      setActiveTile(null);

      // Cek jika pola sudah sesuai
      if (newUserPattern.length === pattern.length) {
        checkPattern(newUserPattern);
      }
    }, 300);
  };

  const checkPattern = (newUserPattern: number[]) => {
    if (newUserPattern.join() === pattern.join()) {
      setScore(score + 1);
      if (level < 5) {
        nextLevel();
      } else {
        showWinDialog();
      }
    } else {
      showGameOverDialog();
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
    generatePattern();
  };

  const showGameOverDialog = () => {
    Alert.alert("Game Over", `Skor Anda: ${score}`, [
      { text: "Main Lagi", onPress: startNewGame },
    ]);
  };

  const showWinDialog = () => {
    Alert.alert("Anda Menang!", `Skor Anda: ${score}`, [
      { text: "Main Lagi", onPress: startNewGame },
    ]);
  };

  const renderTile = ({ index }: { index: number }) => (
    <TouchableOpacity
      style={[
        styles.tile,
        { backgroundColor: activeTile === index ? "red" : "blue" },
      ]}
      onPress={() => onTileTapped(index)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Skor: {score}</Text>
      <Text style={styles.level}>Level: {level}</Text>
      <FlatList
        data={Array.from({ length: getGridSize() }, (_, i) => i)}
        renderItem={renderTile}
        numColumns={3}
        keyExtractor={(item) => item.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  level: {
    fontSize: 24,
    marginBottom: 20,
  },
  grid: {
    justifyContent: "center",
  },
  tile: {
    width: 100,
    height: 100,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
