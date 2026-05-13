import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ;

export default function HomeScreen() {
  const [status, setStatus] = useState("checking...");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then((r) => r.json())
      .then((d) => setStatus(JSON.stringify(d)))
      .catch(() => setStatus("Backend unreachable"));
  }, []);

  const sendMessage = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("Error sending message");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Azure Deploy Test</Text>
      <Text style={styles.label}>Backend status:</Text>
      <Text style={styles.status}>{status}</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      {response ? <Text style={styles.response}>{response}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, color: "#666" },
  status: { fontSize: 13, color: "#333", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 10, width: "100%", maxWidth: 400, marginBottom: 12,
  },
  button: {
    backgroundColor: "#0078d4", borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 32,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  response: { marginTop: 16, fontSize: 14, color: "#333" },
});
