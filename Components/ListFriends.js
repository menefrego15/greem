import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { auth, db } from "../firebase";

const ListFriends = ({ uid, navigation }) => {
  const [friendInfo, setfriendInfo] = useState();
  const [loading, setLoading] = useState(true);

  const enterChat = () => {
    navigation.navigate("Chat", {
      friendId: uid,
      userId: auth?.currentUser?.uid,
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const unsubscribe = db
        .collection("users")
        .doc(uid)
        .onSnapshot((doc) => {
          setfriendInfo(doc.data());
          setLoading(!loading);
        });
    }
    return () => (isSubscribed = false);
  }, [uid]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#4BFE72"
        style={{ position: "absolute" }}
      />
    );
  } else {
    return (
      <View style={styles.ListFriends}>
        <TouchableWithoutFeedback onPress={() => enterChat()}>
          <Image
            style={styles.photoURL}
            source={{
              uri: friendInfo?.photoURL,
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
};

export default ListFriends;

const styles = StyleSheet.create({
  ListFriends: {
    padding: 10,
  },
  photoURL: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
});
