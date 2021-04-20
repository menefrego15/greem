import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { auth, db, storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import ModalName from "../Components/modalName";
import { useFonts } from "expo-font";
import setting from "../assets/Setting.png";

const ProfilScreen = ({ navigation }) => {
  const [bio, setbio] = useState("");
  const [currentUser, setcurrentUser] = useState();
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  const logout = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setcurrentUser(user);
        }
      });
    }
    return unsubscribe;
  }, []);

  const updateBio = () => {
    if (bio.length > 0) {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          bioUser: bio,
        })
        .then(() => {
          Alert.alert("Alert", "Your profile has been updated", [
            { text: "OK", onPress: navigation.goBack() },
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

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
      uploadImage(result.uri);
    }
    console.log(image);
  };

  async function uploadImage(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const urlImage = await snapshot.ref.getDownloadURL();

    if (urlImage === undefined) {
      console.log("url undefined");
    } else {
      auth.currentUser.updateProfile({
        photoURL: urlImage,
      });
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <ModalName
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        user={currentUser}
      />
      <View style={styles.Profil}>
        <View style={styles.ProfilInfoContainer}>
          <TouchableOpacity>
            <Image source={setting}></Image>
          </TouchableOpacity>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <View>
              <Text style={styles.Name}>{auth?.currentUser.displayName}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.profilImage}>
          <Image
            source={auth?.currentUser?.photoURL}
            style={{ width: 200, height: 200 }}
          ></Image>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  Name: {
    fontFamily: "Oswald-Medium",
    fontSize: 30,
    color: "#3C403C",
  },
  ProfilInfoContainer: {
    flexDirection: "column",
  },
  Profil: {
    flexDirection: "row",
  },
});

export default ProfilScreen;

/*

<Input
          placeholder="Add your bio here"
          type="text"
          value={bio}
          onChangeText={(text) => setbio(text)}
        />
<Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button
        buttonStyle={styles.buttonLogin}
        onPress={updateBio}
        title="Confirm"
      />

      <Button onPress={logout} title="LogOut" color="#fff" />
      <View style={{ height: 100 }}></View>
*/
