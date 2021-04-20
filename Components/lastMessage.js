import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { db, auth } from "../firebase";
import { SvgPic, SvgVoice } from "./svg";

const lastMessage = ({ friendId, userId }) => {
  const [messages, setMessages] = useState();
  const [showM, setshowM] = useState();
  const [seen, setSeen] = useState();
  const [userLast, setUserLast] = useState();
  const [roomId, setroomId] = useState();
  const [typeLast, settypeLast] = useState();

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
    if (roomId === undefined) {
    } else {
      if (isSubscribed) {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .limit(1)
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

  const pro = new Promise((resolve, reject) => {
    if (messages === undefined || messages.length <= 0) {
      reject("error frero");
    } else {
      resolve(messages);
    }
  });

  pro
    .then((messages) => {
      formateText(messages[0].content);
      settypeLast(messages[0].type);
      setSeen(messages[0].seen);
      setUserLast(messages[0].id);
    })
    .catch((error) => {});

  function formateText(lastM) {
    if (lastM === undefined) {
    } else {
      if (lastM !== "") {
        if (lastM.length > 30) {
          setshowM(lastM.substring(0, 30) + "...");
        } else {
          setshowM(lastM);
        }
      }
    }
  }

  return (
    <View>
      {seen === false && userLast !== auth?.currentUser?.uid ? (
        typeLast === "text" ? (
          <Text
            ellipsizeMode="tail"
            style={{ fontSize: 14, color: "#0D2481", fontWeight: "bold" }}
          >
            {showM}
          </Text>
        ) : typeLast === "audio" ? (
          <SvgVoice opacity="1" />
        ) : (
          <SvgPic width="40" height="40" color="#0D2481" />
        )
      ) : typeLast === "text" ? (
        <Text style={{ fontSize: 14, color: "#0D2481" }}>{showM}</Text>
      ) : typeLast === "audio" ? (
        <View style={{ flexDirection: "row" }}>
          <SvgVoice opacity=".7" />
          <Text style={{ fontSize: 14, color: "#0D2481" }}> VOCAL</Text>
        </View>
      ) : (
        <View>
          <SvgPic width="30" height="30" color="#0D2481" />
        </View>
      )}
    </View>
  );
};

export default lastMessage;
