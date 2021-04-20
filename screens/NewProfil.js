import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useFonts } from "expo-font";
import { auth, db, storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import ModalName from "../Components/modalName";
import ModalBio from "../Components/modalBio";
import AppLoading from "expo-app-loading";
import uuid from "uuid";
import ListFriends from "../Components/ListFriends.js";
import { SvgSettings, Svgplus } from "../Components/svg";
import Tree from "../Components/Tree";

const NewProfil = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setcurrentUser] = useState();
  const [biomodalvisible, setBiomodalvisible] = useState(false);
  const [image, setImage] = useState(null);
  const [loadingImage, setloadingImage] = useState(false);
  const [profilPic, setprofilPic] = useState();
  const [friends, setFriends] = useState();
  const [userinfo, setuserInfo] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const unsubscribe = db
        .collection("users")
        .doc(auth?.currentUser?.uid)
        .collection("friends")
        .onSnapshot((snapshot) => {
          setFriends(
            snapshot.docs.map((doc) => ({
              uid: doc.data().uid,
            }))
          );
        });
    }
    return () => (isSubscribed = false);
  }, []);

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

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setcurrentUser(user);
          setprofilPic(auth.currentUser.photoURL);
        }
      });
    }
    return () => (isSubscribed = false);
  }, [auth]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      db.collection("users")
        .doc(auth?.currentUser?.uid)
        .onSnapshot((doc) => {
          setuserInfo(doc.data());
        });
    }
    return () => (isSubscribed = false);
  }, [auth]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setloadingImage(true);
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
      auth.currentUser
        .updateProfile({
          photoURL: urlImage,
        })
        .then(() => {
          setprofilPic(urlImage);
          setloadingImage(false);
          db.collection("users").doc(auth.currentUser.uid).update({
            photoURL: urlImage,
          });
        });
    }
  }

  const logout = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

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
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#3FFF8C" }} />
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <View style={{ flex: 1, backgroundColor: "#3FFF8C" }}>
            <View style={styles.container}>
              <View style={styles.Profil}>
                <View style={styles.profilInfo}>
                  <View style={styles.profilSettings}>
                    <SvgSettings width="25px" height="25px" />
                    <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                      <Text
                        style={{
                          fontFamily: "Oswald-Medium",
                          fontSize: 13,
                          color: "white",
                        }}
                      >
                        LOGOUT
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.profilNameBio}>
                    <Text
                      onPress={() => {
                        setModalVisible(true);
                      }}
                      style={{
                        fontFamily: "Oswald-Bold",
                        fontSize: 30,
                        color: "#0D2481",
                      }}
                    >
                      {auth?.currentUser?.displayName}
                    </Text>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setBiomodalvisible(true);
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Oswald-Light", color: "#0D2481" }}
                      >
                        {userinfo?.bioUser !== undefined
                          ? userinfo.bioUser
                          : "Add your bio here"}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                  {loadingImage ? (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={styles.photoURL}
                        source={{ uri: profilPic }}
                        blurRadius={1}
                      />
                      <ActivityIndicator
                        size="large"
                        color="#4BFE72"
                        style={{ position: "absolute" }}
                      />
                    </View>
                  ) : (
                    <TouchableWithoutFeedback onPress={pickImage}>
                      <Image
                        style={styles.photoURL}
                        source={{
                          uri: auth?.currentUser?.photoURL,
                        }}
                      />
                    </TouchableWithoutFeedback>
                  )}
                </View>
              </View>
              <Tree />
              <View style={styles.friends}>
                <Text
                  style={{
                    fontFamily: "Oswald-Bold",
                    color: "#0D2481",
                    fontSize: 30,
                  }}
                >
                  Friends
                </Text>
                <View style={styles.friendsView}>
                  <ScrollView>
                    <View style={styles.scrollViewFriends}>
                      {friends?.map((friend) => (
                        <ListFriends
                          key={friend.uid}
                          navigation={navigation}
                          uid={friend.uid}
                        />
                      ))}

                      <TouchableOpacity
                        onPress={() => navigation.navigate("AddFriend")}
                      >
                        <Svgplus width="60px" height="60px" />
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
              <ModalBio
                biomodalvisible={biomodalvisible}
                setBiomodalvisible={setBiomodalvisible}
                user={currentUser}
              />
              <ModalName
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                user={currentUser}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default NewProfil;

const styles = StyleSheet.create({
  friendsView: {
    marginTop: "6%",
    borderRadius: 30,
    backgroundColor: "white",
    shadowColor: "rgba(13, 36, 129, 0.15)",
    padding: 10,
    elevation: 3.4,
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    maxHeight: "100%",
  },
  scrollViewFriends: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? "10%" : 0,
    backgroundColor: Platform.OS === "android" ? "#3FFF8C" : "white",
  },
  friends: {
    flex: 4,
    flexDirection: "column",
    marginTop: 30,
  },
  profilSettings: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutBtn: {
    justifyContent: "center",
    backgroundColor: "#0D2481",
    width: 60,
    alignItems: "center",
    height: 20,
    marginLeft: 10,
    borderRadius: 7,
  },
  photoURL: {
    width: 100,
    height: 100,
    borderRadius: 37,
  },
  container: {
    flex: 2,
    height: "100%",
    padding: 20,
    paddingTop: 40,
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  Profil: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  profilInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  profilNameBio: {},
});
