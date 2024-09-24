import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const backImage = require("../assets/backImage.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0); // Biến lưu số lần đăng nhập sai
  const maxAttempts = 5; // Số lần sai tối đa

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '74242973386-v6nvcrmgmuns28bed0rombgsr3khjd6u.apps.googleusercontent.com',
  });

  const onHandleLogin = async () => {
    if (loginAttempts >= maxAttempts) {
      Alert.alert("Account Locked", "Your account has been locked due to too many failed login attempts.");
      return;
    }

    if (email !== "" && password !== "") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        

        setLoginAttempts(0); // Đặt lại số lần đăng nhập sai
        navigation.navigate("Home", { username: email });
      } catch (err) {
        setLoginAttempts((prev) => prev + 1); 
        const errorMessage = loginAttempts + 1 === maxAttempts 
          ? "Account locked after too many failed attempts." 
          : "User or password incorrect!";
        Alert.alert("Login error", errorMessage);
      }
    } else {
      Alert.alert("Input error", "Please enter both email and password.");
    }
  };

  // Xử lý phản hồi Google Sign-In
  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          Alert.alert("Google Sign-In Error", error.message);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Log In</Text>
        </TouchableOpacity>

        {/* Nút đăng nhập bằng Google */}
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Log In with Google</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>Forgot password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}>Reset here</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  googleButton: {
    backgroundColor: '#DB4437', // Màu của nút Google
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
