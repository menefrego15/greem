import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebase";
import { SvgPause, SvgStart, IconPause } from "../Components/svg";
import ImageLoader from "./ImageLoader";
import moment from "moment";

const ListMessage = ({
  message,
  playSound,
  friendImage,
  soundPlaying,
  setmodal,
  setmodalImage,
  currentAudio,
}) => {
  const { item } = message;
  const [showTime, setshowTime] = useState(false);
  const [currentSelect, setcurrentSelect] = useState();

  const formatDate = (timestamp) => {
    let unix_timestamp = timestamp;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return moment(date).fromNow();
  };

  return item.email === auth.currentUser.email ? (
    <View key={item.id} style={styles.sentContainer}>
      {item.type === "text" ? (
        <View
          style={{
            width: "100%",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setshowTime(!showTime);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setcurrentSelect(item.id);
            }}
            onLongPress={() => console.log("long press")}
          >
            <View style={styles.sent}>
              <Text style={{ color: "white" }}>{item.content}</Text>
            </View>
          </TouchableWithoutFeedback>
          {currentSelect === item.id && showTime ? (
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "#0D2481", fontSize: 10 }}>
                {formatDate(item.timestamp.seconds)}
              </Text>
            </View>
          ) : null}
        </View>
      ) : item.type === "audio" ? (
        <View style={styles.voiceMessageSent}>
          <View>
            <ImageLoader
              source={auth?.currentUser?.photoURL}
              style={styles.photoSound}
              color="#4057B4"
            />
          </View>
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => playSound(item.content)}
          >
            {soundPlaying && item.content === currentAudio ? (
              <IconPause />
            ) : (
              <SvgStart width="40px" height="40px" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.sent}>
          <TouchableWithoutFeedback
            onPress={() => {
              setmodal(true);
              setmodalImage(item.content);
            }}
          >
            <Image
              source={{ uri: item.content }}
              style={{ width: 200, height: 200, borderRadius: 15 }}
            />
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  ) : (
    <View key={item.id} style={styles.receiveContainer}>
      {item.type === "text" ? (
        <View
          style={{
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.photoURL}
              source={{
                uri: friendImage,
              }}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                setshowTime(!showTime);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setcurrentSelect(item.id);
              }}
              onLongPress={() => console.log("long press")}
            >
              <View style={styles.receive}>
                <Text style={{ color: "#0D2481" }}>{item.content}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {currentSelect === item.id && showTime ? (
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "#0D2481", fontSize: 10 }}>
                {formatDate(item.timestamp.seconds)}
              </Text>
            </View>
          ) : null}
        </View>
      ) : item.type === "audio" ? (
        <View style={styles.voiceMessageSent}>
          <View>
            <ImageLoader
              source={friendImage}
              style={styles.photoSound}
              color="#DFE4FA"
            />
          </View>
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => playSound(item.content)}
          >
            {soundPlaying && item.content === currentAudio ? (
              <IconPause />
            ) : (
              <SvgStart width="40px" height="40px" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.receive}>
          <TouchableWithoutFeedback
            onPress={() => {
              setmodal(true);
              setmodalImage(item.content);
            }}
          >
            <Image
              source={{ uri: item.content }}
              style={{ width: 200, height: 200, borderRadius: 15 }}
            />
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

export default ListMessage;

const styles = StyleSheet.create({
  sentContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 20,
  },
  receiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 10,
  },
  photoURL: {
    width: 35,
    height: 35,
    borderRadius: 13,
  },
  sent: {
    padding: 15,
    backgroundColor: "#4057B4",
    alignSelf: "flex-end",
    borderRadius: 20,
    maxWidth: "80%",
    position: "relative",
  },
  receive: {
    padding: 15,
    backgroundColor: "#DFE4FA",
    alignSelf: "center",
    borderRadius: 20,
    marginLeft: 4,
    maxWidth: "80%",
    position: "relative",
  },
  photoSound: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  voiceMessageSent: {
    flexDirection: "row",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
