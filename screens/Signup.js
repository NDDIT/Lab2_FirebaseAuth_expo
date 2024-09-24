import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPasswordValidLength, setIsPasswordValidLength] = useState(false);
  const [isPasswordValidNumber, setIsPasswordValidNumber] = useState(false);
  const [isPasswordValidSpecial, setIsPasswordValidSpecial] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    setIsPasswordValidLength(password.length >= 8);
    setIsPasswordValidNumber(hasNumber.test(password));
    setIsPasswordValidSpecial(hasSpecialChar.test(password));
  };

  const onPasswordChange = (password) => {
    setPassword(password);
    validatePassword(password);
    checkPasswordMatch(password, rePassword);
  };

  const onRePasswordChange = (rePassword) => {
    setRePassword(rePassword);
    checkPasswordMatch(password, rePassword);
  };

  const checkPasswordMatch = (password, rePassword) => {
    setIsPasswordMatch(password === rePassword);
  };

  const allPasswordConditionsMet = isPasswordValidLength && isPasswordValidNumber && isPasswordValidSpecial && isPasswordMatch;

  const onHandleSignUp = async () => {
    if (email !== "" && allPasswordConditionsMet) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate("Home"); // Điều hướng đến màn hình Home
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    } else {
        Alert.alert("Error", "Please make sure all fields are filled correctly.");
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail} // Không cần xác thực email
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry={true}
        value={password}
        onChangeText={onPasswordChange}
      />
      <View style={styles.validationContainer}>
        <Text style={styles.validationText}>
          {isPasswordValidLength ? "✅ At least 8 characters" : "✖️ At least 8 characters"}
        </Text>
        <Text style={styles.validationText}>
          {isPasswordValidNumber ? "✅ Contains at least 1 number" : "✖️ At least 1 number"}
        </Text>
        <Text style={styles.validationText}>
          {isPasswordValidSpecial ? "✅ Contains at least 1 special character" : "✖️ At least 1 special character"}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Re-enter password"
        secureTextEntry={true}
        value={rePassword}
        onChangeText={onRePasswordChange}
      />
      <Text style={styles.validationText}>
        {isPasswordMatch ? "✅ Passwords match" : "✖️ Passwords do not match"}
      </Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={onHandleSignUp} 
        disabled={!allPasswordConditionsMet} // Disable button nếu các điều kiện mật khẩu chưa đạt
      >
        <Text style={styles.buttonText}>Sign Up</Text>
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
  validationContainer: {
    marginBottom: 20,
    width: "100%",
  },
  validationText: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    backgroundColor: "#f57c00",
    height: 58,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
});
