import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import TreeImage from "../assets/treetest.png";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const Tree = () => {
  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Text
          style={{ fontFamily: "Oswald-Bold", color: "white", fontSize: 34 }}
        >
          YOUR TREE
        </Text>
        <Image
          source={TreeImage}
          style={{
            width: "50%",
            height: "80%",
          }}
        />
      </View>
    );
  }
};

export default Tree;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1.3,
    flexDirection: "row",
    marginTop: 40,
    backgroundColor: "#3FFF8C",
    borderRadius: 39,
    color: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
