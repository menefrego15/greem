import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import CustomListItem from "../Components/CustomListItem";
import { auth, db } from "../firebase";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Svgplus } from "../Components/svg";
import AppLoading from "expo-app-loading";

const MessagesScreen = ({ navigation }) => {
  const [currentUser, setcurrentUser] = useState();
  const [userinfo, setuserinfo] = useState([]);
  const [friendsUsers, setfriendsUsers] = useState([]);

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  });

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
    }

    if (token) {
      const res = await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .set({ token }, { merge: true });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  useEffect(() => {
    let isSubscribed = true;
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (isSubscribed) {
          setcurrentUser(user);
          db.collection("users")
            .doc(user.uid)
            .onSnapshot((doc) => {
              setuserinfo(doc.data());
            });
        }
      } else {
        navigation.replace("Login");
      }
    });
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const unsubscribe = db
        .collection("users")
        .doc(auth?.currentUser?.uid)
        .collection("friends")
        .onSnapshot((snapshot) => {
          setfriendsUsers(
            snapshot.docs.map((doc) => ({
              uid: doc.data().uid,
              userName: doc.data().userName,
              photoURL: doc.data().photoURL,
              mail: doc.data().mail,
            }))
          );
        });
    }
    return () => (isSubscribed = false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Messages",
    });
  }, []);

  const enterChat = (friendId, userId) => {
    navigation.navigate("Chat", {
      friendId: friendId,
      userId: userId,
    });
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
                  MESSAGES
                </Text>
              </View>
              <View style={styles.searchBar}>
                <Text
                  style={{
                    fontFamily: "Oswald-Bold",
                    color: "rgba(13, 36, 129, 0.57)",
                  }}
                >
                  SEARCH
                </Text>
              </View>
              <ScrollView style={styles.listContainer}>
                {friendsUsers.map((friend) => (
                  <CustomListItem
                    key={friend.uid}
                    friendId={friend.uid}
                    userId={auth.currentUser.uid}
                    user={friend}
                    enterChat={enterChat}
                  />
                ))}
              </ScrollView>
              <View style={styles.btnAddFriendContainer}>
                <TouchableOpacity
                  style={styles.btnAddFriend}
                  onPress={() => navigation.navigate("AddFriend")}
                >
                  <Svgplus width="50px" height="50px" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
};

export default MessagesScreen;

const styles = StyleSheet.create({
  btnAddFriend: {
    shadowColor: "rgba(13, 36, 129, 0.15)",
    elevation: 4.4,
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  btnAddFriendContainer: {
    bottom: 100,
    width: "100%",
    marginLeft: 20,
    alignItems: "center",
    paddingBottom: 10,
    position: "absolute",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? "10%" : 0,
    backgroundColor: Platform.OS === "android" ? "#3FFF8C" : "white",
  },
  searchBar: {
    flex: 0,
    height: 60,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#E8E9ED",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 10,
    padding: 10,
  },
  Header: {
    fontSize: 28,
    fontFamily: "Oswald-Bold",
    color: "#0D2481",
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
});
