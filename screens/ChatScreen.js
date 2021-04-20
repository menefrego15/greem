import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Animated,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";
import { db, auth, storage } from "../firebase";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import { SvgRecord, SvgSendPic, SvgCross, SvgMusic } from "../Components/svg";
import ListMessage from "../Components/ListMessage";
import ChatFooter from "../Components/ChatFooter";
import Image from "react-native-scalable-image";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";

const chatScreen = ({ navigation, route }) => {
  const [textInput, settextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState();
  const scrollAuto = useRef();
  const [roomId, setroomId] = useState();
  const [customHeight, setHeight] = useState(35);
  const [sound, setSound] = useState(null);
  const [customStatus, setStatus] = useState(null);
  const [currentAudio, setcurrentAudio] = useState();
  const [soundPlaying, setsoundPlaying] = useState(false);
  const [friendInfo, setfriendInfo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setmodalImage] = useState();
  const [attop, setatTop] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const AnimateRec1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const AnimateRec2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const AnimateRec3 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const AnimateRec4 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 350,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.timing(AnimateRec2, {
        toValue: {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * (-200 - -150) + -150),
        },
        duration: Math.floor(Math.random() * (400 - 300) + 300),
        //easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(AnimateRec1, {
        toValue: {
          x: Math.floor(Math.random() * 30),
          y: Math.floor(Math.random() * (-200 - -150) + -150),
        },
        duration: Math.floor(Math.random() * (500 - 400) + 400),
        //easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(AnimateRec3, {
        toValue: {
          x: Math.floor(Math.random() * -20),
          y: Math.floor(Math.random() * (-200 - -150) + -150),
        },
        duration: Math.floor(Math.random() * (600 - 500) + 500),
        //easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
    Animated.loop(
      Animated.timing(AnimateRec4, {
        toValue: {
          x: Math.floor(Math.random() * -30),
          y: Math.floor(Math.random() * (-200 - -150) + -150),
        },
        duration: Math.floor(Math.random() * (700 - 600) + 500),
        //easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(AnimateRec1).stop();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      db.collection("users")
        .doc(route.params.friendId)
        .onSnapshot((snapshot) => {
          setfriendInfo(snapshot.data());
        });
    }
    return () => (isSubscribed = false);
  }, []);

  //get id of the room
  useEffect(() => {
    if (route.params.userId > route.params.friendId) {
      setroomId(route.params.userId + route.params.friendId);
    } else {
      setroomId(route.params.friendId + route.params.userId);
    }
  }, []);

  //scroll the first time

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      if (messages?.length <= 20) {
        //scrollAuto.current.scrollToEnd({ animated: false });
      }
    }
    return () => (isSubscribed = false);
  }, [messages]);

  //update seen to true

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      if (roomId === undefined) {
      } else {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .where("id", "==", route?.params?.friendId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                seen: true,
              });
            });
          });
      }
    }
  }, [messages, roomId]);

  async function startRecording() {
    fadeIn();
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      const RecordingOptions = {
        android: {
          extension: ".mp3",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 96400,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };
      await recording.prepareToRecordAsync(RecordingOptions);
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    fadeOut();
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    uploadSound(uri);
  }

  async function uploadSound(uri) {
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
    const metadata = {
      contentType: "audio/m4a",
    };
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const urlAudio = await snapshot.ref.getDownloadURL();

    if (urlAudio !== undefined) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        type: "audio",
        content: urlAudio,
        username: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
        seen: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      db.collection("users").doc(route.params.userId).update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      setsoundPlaying(false);
      setSound(undefined);
      setStatus(null);
    }
  };

  async function playSound(content) {
    if (customStatus === null) {
      const source = { uri: content };
      const downloadFirst = true;
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync(source, { shouldPlay: true });
      setSound(playbackObj);
      setcurrentAudio(content);
      setsoundPlaying(true);
      console.log(status);
      setStatus(status);
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    if (customStatus?.isLoaded && customStatus.isPlaying) {
      const status = await sound.setStatusAsync({ shouldPlay: false });
      setsoundPlaying(false);
      setStatus(status);
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    if (
      customStatus?.isLoaded &&
      !customStatus.isPlaying &&
      content === currentAudio
    ) {
      const status = await sound.playAsync();
      setsoundPlaying(true);
      setStatus(status);
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  //MESSAGE CODE

  useEffect(() => {
    let isSubscribed = true;
    if (roomId !== undefined) {
      if (isSubscribed) {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .limit(20)
          .onSnapshot((snapshot) => {
            setMessages(
              snapshot.docs.map((doc) => ({
                type: doc.data().type,
                content: doc.data().content,
                id: doc.id,
                photoURL: doc.data().photoURL,
                timestamp: doc.data().timestamp,
                username: doc.data().username,
                email: doc.data().email,
              }))
            );
            //scrollAuto.current.scrollToEnd({ animated: false });
          });
      }
    }
    return () => (isSubscribed = false);
  }, [roomId]);

  const sendMessage = () => {
    if (route.params.userId && route.params.friendId === undefined) {
    } else {
      db.collection("rooms").doc(roomId).collection("messages").add({
        type: "text",
        content: textInput,
        username: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        seen: false,
      });
      db.collection("users").doc(route.params.userId).update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    settextInput("");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
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
    } else {
      db.collection("rooms").doc(roomId).collection("messages").add({
        type: "image",
        content: urlImage,
        username: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        seen: false,
      });
      db.collection("users").doc(route.params.userId).update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  const handleScroll = (e) => {
    const element = e.nativeEvent;
    if (element.contentOffset.y <= 5) {
      setatTop(true);
      fetchMessage();
    }
  };

  const fetchMessage = () => {
    setTimeout(() => {
      if (messages !== undefined) {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .limit(messages.length + 20)
          .onSnapshot((snapshot) => {
            setMessages(
              snapshot.docs.map((doc) => ({
                type: doc.data().type,
                content: doc.data().content,
                id: doc.id,
                photoURL: doc.data().photoURL,
                timestamp: doc.data().timestamp,
                username: doc.data().username,
                email: doc.data().email,
              }))
            );
            setatTop(false);
            // scrollAuto.current.scrollTo({
            //   y: (Dimensions.get("window").height * 2) / 1.2,
            //   animated: false,
            // });
          });
      }
    }, 500);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(64, 87, 180, 0.8)"
        translucent
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {attop ? (
          <View
            style={{
              alignItems: "center",
              paddingTop: "20%",
              position: "absolute",
              alignSelf: "center",
              backgroundColor: "transparent",
              marginTop: 40,
            }}
          >
            <ActivityIndicator
              size="large"
              color="#4057B4"
              style={{ position: "absolute" }}
            />
          </View>
        ) : null}

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <FlatList
              ref={scrollAuto}
              isAutoScrolling
              onEndReached={fetchMessage}
              inverted
              onEndReachedThreshold={0.5}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <ListMessage
                  key={item.id}
                  message={item}
                  friendImage={friendInfo?.photoURL}
                  playSound={playSound}
                  soundPlaying={soundPlaying}
                  setmodal={setModalVisible}
                  setmodalImage={setmodalImage}
                  currentAudio={currentAudio}
                />
              )}
            />
            {/*
            <ScrollView
              ref={scrollAuto}
              contentContainerStyle={styles.messageContainer}
              scrollEventThrottle={160}
              onScroll={(e) => handleScroll(e)}
            >
              {messages.map((message) => (
                <ListMessage
                  key={message.id}
                  message={message}
                  friendImage={friendInfo?.photoURL}
                  playSound={playSound}
                  soundPlaying={soundPlaying}
                  setmodal={setModalVisible}
                  setmodalImage={setmodalImage}
                  currentAudio={currentAudio}
                />
              ))}
              */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={{ zIndex: 30 }}
                    >
                      <SvgCross width="40" height="40" />
                    </TouchableOpacity>
                  </View>
                  <ReactNativeZoomableView
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    captureEvent={true}
                  >
                    <Image
                      width={Dimensions.get("window").width} // height will be calculated automatically
                      source={{
                        uri: modalImage !== null ? modalImage : null,
                      }}
                    />
                  </ReactNativeZoomableView>
                </View>
              </View>
            </Modal>
            <View
              style={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <ChatFooter
                AnimateRec1={AnimateRec1}
                AnimateRec2={AnimateRec2}
                AnimateRec3={AnimateRec3}
                AnimateRec4={AnimateRec4}
                fadeIn={fadeIn}
                fadeOut={fadeOut}
                fadeAnim={fadeAnim}
                textInput={textInput}
                settextInput={settextInput}
                setHeight={setHeight}
                customHeight={customHeight}
                sendMessage={sendMessage}
                pickImage={pickImage}
                startRecording={startRecording}
                stopRecording={stopRecording}
                recording={recording}
              />
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default chatScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 1)",
    width: "100%",
    paddingTop: 50,
    padding: 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  sentContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 20,
  },
  receiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 15,
  },
  photoURL: {
    width: 35,
    height: 35,
    borderRadius: 13,
  },

  messageContainer: {
    flexDirection: "column",
  },
  container: {
    flex: 1,
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
