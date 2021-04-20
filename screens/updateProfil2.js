import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Input } from "react-native-elements";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import uuid from "uuid";
import { Svgarrow, Svgimage, Svgvalid } from "../Components/svg";

const UpdateProfil2 = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [loadingImage, setloadingImage] = useState(null);
  const [chooseImage, setchooseImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
    console.log(image);
  };

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  console.log(route.params.name);

  const register = () => {
    navigation.navigate("ConfirmRegisterScreen", {
      email: route.params.email,
      pass: route.params.pass,
      name: route.params.name,
      image: image,
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
              CHOOSE A PROFIL PICTURE
            </Text>
          </View>
          <Image
            source={require("../assets/camera3d.png")}
            style={styles.logo}
          />
          <View style={styles.imageContainer}>
            {loadingImage ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Svgimage width="100px" height="100px" />
                <ActivityIndicator
                  size="large"
                  color="#4BFE72"
                  style={{ position: "absolute" }}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={pickImage}>
                {image === null ? (
                  <Svgimage width="100px" height="100px" />
                ) : (
                  <Image
                    style={styles.photoURL}
                    source={{
                      uri: image,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
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

export default UpdateProfil2;

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
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
  photoURL: {
    width: 100,
    height: 100,
    borderRadius: 37,
  },
});
