import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Input } from "react-native-elements";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { Svgarrow } from "../Components/svg";

const RegisterScreen = ({ navigation }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  const register = () => {
    navigation.navigate("UpdateProfil1", {
      email: email,
      pass: password,
    });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3FFF8C" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <View>
            <Text
              h3
              style={{
                color: "white",
                fontSize: 22,
                fontFamily: "Oswald-Bold",
              }}
            >
              CREATE YOUR ACCOUNT
            </Text>
          </View>
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
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={register} style={styles.arrowBtn}>
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
  btnContainer: {
    position: "absolute",
    bottom: 10,
    paddingRight: 30,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#3FFF8C",
  },
  buttonLogin: {
    backgroundColor: "#54C86E",
    justifyContent: "center",
    width: 200,
    height: 50,
  },
  inputContainer: {
    width: 300,
    marginBottom: 50,
  },
  inputStyle: {
    color: "white",
    textAlign: "center",
    borderColor: "white",
  },
});

export default RegisterScreen;
