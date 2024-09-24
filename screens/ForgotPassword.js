import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const onHandleResetPassword = () => {
    if (email !== "") {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert("Success", "Password reset email sent! Please check your inbox.");
          navigation.navigate("Login");
        })
        .catch((error) => Alert.alert("Error", error.message));
    } else {
      Alert.alert("Error", "Please enter your email.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleResetPassword}>
        <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>Send Reset Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    width: "100%",
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#f57c00",
    height: 58,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
