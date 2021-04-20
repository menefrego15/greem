import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { TouchableHighlight } from "react-native-gesture-handler";
import { db, auth } from "../firebase";
import LastMessage from "./lastMessage";
import InfoMessage from "./infoMessage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const CustomListItem = ({ user, friendId, userId, enterChat }) => {
  const [friendInfo, setfriendInfo] = useState();
  const [messages, setMessages] = useState();
  const [roomId, setroomId] = useState();
  const [friendImage, setfriendImage] = useState();

  //get id of the room
  useEffect(() => {
    if (userId > friendId) {
      setroomId(userId + friendId);
    } else {
      setroomId(friendId + userId);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const unsubscribe = db
        .collection("users")
        .doc(friendId)
        .onSnapshot((doc) => {
          setfriendInfo(doc.data());
          setfriendImage(doc.data().photoURL);
        });
    }
    return () => (isSubscribed = false);
  }, [friendId]);

  useEffect(() => {
    if (typeof friendImage === "string") {
      Image.prefetch(friendImage);
    }
  }, [friendImage]);

  useEffect(() => {
    let isSubscribed = true;
    if (roomId === undefined) {
      console.log("undef");
    } else {
      if (isSubscribed) {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .where("seen", "==", false)
          .onSnapshot((snapshot) => {
            setMessages(
              snapshot.docs.map((doc) => ({
                type: doc.data().type,
                content: doc.data().content,
                id: doc.data().id,
                photoURL: doc.data().photoURL,
                timestamp: doc.data().timestamp,
                username: doc.data().username,
                email: doc.data().email,
                seen: doc.data().seen,
              }))
            );
          });
      }
    }
    return () => (isSubscribed = false);
  }, [roomId]);

  return (
    <TouchableOpacity
      key={friendId}
      onPress={() => enterChat(friendId, userId)}
      style={styles.listContainer}
    >
      <View style={styles.container}>
        <View style={styles.contentList}>
          <View style={styles.photoContainer}>
            {friendInfo === undefined ? (
              <SkeletonPlaceholder>
                <View style={styles.photoURL} />
              </SkeletonPlaceholder>
            ) : (
              <Image
                style={styles.photoURL}
                source={{ uri: friendInfo.photoURL }}
              />
            )}
          </View>
          <View style={styles.infoUserContainer}>
            {friendInfo === undefined ? (
              <SkeletonPlaceholder>
                <View style={{ width: 100, height: 30, borderRadius: 10 }} />
                <View
                  style={{
                    width: 200,
                    height: 15,
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                />
              </SkeletonPlaceholder>
            ) : (
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "#0D2481" }}
                >
                  {friendInfo?.userName}
                </Text>
                <LastMessage friendId={friendId} userId={userId} />
              </View>
            )}
          </View>
          <InfoMessage messages={messages} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "96%",
  },
  listContainer: {
    width: "99.69%",
    borderRadius: 35,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "rgba(13, 36, 129, 0.10)",
    elevation: 1,
    borderRadius: 35,
    padding: 10,
    marginTop: 3,
    marginBottom: 3,
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 0 },
  },
  contentList: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  infoUserContainer: {
    paddingLeft: 10,
    padding: 5,
    alignItems: "flex-start",
    justifyContent: "space-around",
    flexGrow: 10,
    height: "70%",
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoURL: {
    width: 60,
    height: 60,
    borderRadius: 24,
  },
});
