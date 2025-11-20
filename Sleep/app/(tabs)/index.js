import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
export default function App() {
  const [count, setCount] = useState(0);
  const incrementCounter = () => {
    setCount((prevCount) => prevCount + 1);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Simple Counter</Text>
        <Text style={styles.counterText}>Value: {count}</Text>
        <Button
          title="Increase by 1"
          onPress={incrementCounter}
          color="#841584"
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  counterText: {
    fontSize: 22,
    marginBottom: 30,
    color: "#333",
  },
});
