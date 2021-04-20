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

const UpdateProfil1 = ({ navigation, route }) => {
  const [name, setname] = useState();

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  const register = () => {
    navigation.navigate("UpdateProfil2", {
      email: route.params.email,
      pass: route.params.pass,
      name: name,
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
              TELL US YOUR NAME
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Name"
              type="text"
              placeholderTextColor="white"
              autoFocus
              value={name}
              onChangeText={(text) => setname(text)}
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

export default UpdateProfil1;

const styles = StyleSheet.create({
  inputContainer: {
    width: 300,
    marginBottom: 50,
  },
  inputStyle: {
    color: "white",
    textAlign: "center",
    borderColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#3FFF8C",
  },
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
});
