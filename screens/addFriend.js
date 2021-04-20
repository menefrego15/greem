import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { db, auth } from "../firebase";
import * as Contacts from "expo-contacts";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const addFriend = ({ navigation }) => {
  const [mailFriend, setmailFriend] = useState("");
  const [users, setUsers] = useState([]);
  const [filterUsersId, setFilterUsersId] = useState();
  const [contact, setcontact] = useState([]);
  const [userFind, setuserFind] = useState(null);
  const [currentUser, setcurrentUser] = useState();

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  useEffect(() => {
    const cleanup = db
      .collection("users")
      .doc(auth?.currentUser?.uid)
      .onSnapshot((snapshot) => {
        setcurrentUser(snapshot.data());
      });
    return () => {
      cleanup;
    };
  }, []);

  let listContact = [...contact];

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();
        if (data.length > 0) {
          data.map((contact) => {
            if (contact.phoneNumbers === undefined) {
            } else {
              const trim = contact.phoneNumbers[0].number.split(" ").join("");
              listContact.push(trim);
              setcontact(listContact);
            }
          });
        }
      }
    })();
  }, []);

  const confirmFriend = () => {
    if (userFind !== null) {
      db.collection("users")
        .doc(auth?.currentUser?.uid)
        .collection("friends")
        .doc(userFind.uid)
        .set(userFind);
      db.collection("users")
        .doc(userFind?.uid)
        .collection("friends")
        .doc(auth?.currentUser?.uid)
        .set(currentUser)
        .then(() => {
          Alert.alert("Friend Added");
        });
    }
  };

  const addFriend = () => {
    if (mailFriend.toLowerCase() === auth?.currentUser?.email) {
      Alert.alert("Cant add yourself");
    } else {
      const searchTerm = mailFriend.toLowerCase();
      console.log(searchTerm);
      db.collection("users")
        .where("email", "==", searchTerm)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setuserFind(doc.data());
            console.log(doc.data());
          });
        });
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: "#3FFF8C",
          }}
        />
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <View style={{ flex: 1, backgroundColor: "#3FFF8C" }}>
            <View style={styles.container}>
              <View style={styles.topContainer}>
                <Text h1 style={styles.Header}>
                  ADD FRIEND
                </Text>
              </View>
              <View style={{ backgroundColor: "white" }}>
                <View style={styles.searchBar}>
                  <Input
                    autoFocus
                    placeholder="YOUR FRIEND EMAIL"
                    placeholderTextColor="rgba(13, 36, 129, 0.56)"
                    name="mail"
                    type="text"
                    value={mailFriend}
                    style={styles.inputStyle}
                    inputContainerStyle={{
                      height: "100%",
                      borderBottomWidth: 0,
                      backgroundColor: "transparent",
                      width: "80%",
                      alignSelf: "center",
                    }}
                    onChangeText={(text) => setmailFriend(text)}
                  />
                </View>
              </View>
              {userFind === null ? (
                <View
                  style={{
                    height: "60%",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#0D2481",
                      fontFamily: "Oswald-Medium",
                    }}
                  >
                    No users found
                  </Text>
                </View>
              ) : (
                <View style={styles.cardUser}>
                  <Image
                    source={{ uri: userFind?.photoURL }}
                    style={styles.imageUser}
                  />
                  <View style={styles.userInfo}>
                    <Text h1 style={styles.userInfoName}>
                      {userFind?.userName}
                    </Text>
                    <Text style={styles.userInfoBio}>{userFind.bioUser}</Text>
                  </View>
                </View>
              )}
              <View style={styles.btnContainer}>
                {userFind === null ? (
                  <Button
                    buttonStyle={{
                      backgroundColor: "#3FFF8C",
                      borderRadius: 10,
                    }}
                    titleStyle={{
                      textAlign: "center",
                      fontFamily: "Oswald-Bold",
                      color: "rgba(13, 36, 129, 0.80)",
                    }}
                    onPress={addFriend}
                    title="SEARCH FRIEND"
                  />
                ) : (
                  <View>
                    <Button
                      buttonStyle={{
                        backgroundColor: "rgba(13, 36, 129, 0.76)",
                        borderRadius: 10,
                      }}
                      titleStyle={{
                        textAlign: "center",
                        fontFamily: "Oswald-Bold",
                        color: "white",
                      }}
                      onPress={() => {
                        setuserFind(null);
                        setmailFriend("");
                      }}
                      title="CANCEL"
                    />
                    <Button
                      buttonStyle={{
                        backgroundColor: "#3FFF8C",
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                      titleStyle={{
                        textAlign: "center",
                        fontFamily: "Oswald-Bold",
                        color: "rgba(13, 36, 129, 0.80)",
                      }}
                      onPress={confirmFriend}
                      title="ADD FRIEND"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default addFriend;

const styles = StyleSheet.create({
  userInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoBio: {
    fontFamily: "Oswald-Bold",
    fontSize: 20,
    color: "rgba(13, 36, 129, 0.76)",
  },
  userInfoName: {
    fontSize: 50,
    fontFamily: "Oswald-Bold",
    color: "#0D2481",
  },
  imageUser: { width: 200, height: 200, borderRadius: 50 },
  cardUser: {
    marginTop: "6%",
    borderRadius: 30,
    backgroundColor: "white",
    shadowColor: "rgba(13, 36, 129, 0.15)",
    padding: 10,
    elevation: 3.4,
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    height: "60%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btnContainer: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? "10%" : 0,
    backgroundColor: Platform.OS === "android" ? "#3FFF8C" : "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  Header: {
    fontSize: 28,
    fontFamily: "Oswald-Bold",
    color: "#0D2481",
  },
  searchBar: {
    height: 60,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#E8E9ED",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    textAlign: "center",
    fontFamily: "Oswald-Bold",
    color: "rgba(13, 36, 129, 0.57)",
  },
});
