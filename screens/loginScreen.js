import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Button, Image, Input } from "react-native-elements";
import { auth, db } from "../firebase";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { Svgarrow } from "../Components/svg";

const loginScreen = ({ navigation }) => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  useEffect(() => {
    const cleanup = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return () => {
      cleanup;
    };
  }, [auth]);

  const login = () => {
    auth.signInWithEmailAndPassword(email, password).then(() => {
      navigation.navigate("Home");
    });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#3FFF8C", padding: 20 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: "white",
                fontFamily: "Oswald-Bold",
                fontSize: 22,
              }}
            >
              YOU'RE MAIL AND PASSWORD
            </Text>
          </View>
          <Image
            source={require("../assets/3dmessage.png")}
            style={styles.logo}
          />
          <View style={styles.inputContainer}>
            <Input
              placeholder="E-mail"
              type="email"
              placeholderTextColor="white"
              autoFocus
              value={email}
              onChangeText={(text) => setemail(text)}
              inputStyle={styles.inputStyle}
              inputContainerStyle={{
                borderColor: "white",
                borderBottomWidth: 3,
                width: "80%",
                alignSelf: "center",
              }}
            />
            <Input
              value={password}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="white"
              type="password"
              onChangeText={(text) => setpassword(text)}
              inputStyle={styles.inputStyle}
              inputContainerStyle={{
                borderColor: "white",
                borderBottomWidth: 3,
                width: "80%",
                alignSelf: "center",
              }}
            />
          </View>
          <View style={{ position: "absolute", bottom: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={{ color: "white" }}>Create account?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => login()} style={styles.arrowBtn}>
              <Svgarrow width="30px" height="30px" />
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }}></View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
};
const styles = StyleSheet.create({
  arrowBtn: {
    backgroundColor: "#FAFF00",
    width: 55,
    height: 43,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(250, 255, 0, 0.3)",
    elevation: 4.4,
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  inputStyle: {
    color: "white",
    textAlign: "center",
    borderColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#3FFF8C",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    paddingRight: 30,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  logo: {
    width: 170,
    height: 170,
  },
  inputContainer: {
    width: 300,
    marginBottom: 50,
  },
});

export default loginScreen;
