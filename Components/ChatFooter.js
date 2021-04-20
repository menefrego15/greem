import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SvgRecord, SvgSendPic, SvgMusic, SvgMusic2 } from "./svg";

const ChatFooter = ({
  textInput,
  settextInput,
  setHeight,
  customHeight,
  sendMessage,
  pickImage,
  startRecording,
  stopRecording,
  recording,
  fadeIn,
  fadeOut,
  fadeAnim,
  AnimateRec1,
  AnimateRec2,
  AnimateRec3,
  AnimateRec4,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "95%",
        justifyContent: "space-between",
        alignSelf: "center",
      }}
    >
      <View style={styles.footer}>
        <TextInput
          type="text"
          name="chat"
          multiline={true}
          blurOnSubmit={false}
          numberOfLines={4}
          value={textInput}
          onChangeText={(text) => settextInput(text)}
          placeholder="Enter your messages here"
          placeholderTextColor="rgba(13, 36, 129, 0.46)"
          onContentSizeChange={(e) =>
            setHeight(e.nativeEvent.contentSize.height)
          }
          style={[
            styles.textInput,
            Platform.OS === "android" ? { height: customHeight } : null,
          ]}
        />
        {textInput.length > 0 ? (
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Text style={{ color: "white", fontWeight: "bold" }}>SEND</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={pickImage}>
              <SvgSendPic width="30px" height="30px" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: Platform.OS === "android" ? "0%" : "6%",
        }}
      >
        <TouchableWithoutFeedback
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <View>
            <SvgRecord
              width="30px"
              height="30px"
              color={recording ? "#4BFE72" : "#0D2481"}
            />
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            marginRight: 5,
          }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              transform: [
                { translateX: AnimateRec1.x },
                { translateY: AnimateRec1.y },
              ],
            }}
          >
            <SvgMusic width="30px" height="30px" />
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              transform: [
                { scale: 1 },
                { translateX: AnimateRec2.x },
                { translateY: AnimateRec2.y },
              ],
            }}
          >
            <SvgMusic width="30px" height="30px" />
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              transform: [
                { scale: 1 },
                { translateX: AnimateRec3.x },
                { translateY: AnimateRec3.y },
              ],
            }}
          >
            <SvgMusic width="30px" height="30px" />
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              position: "absolute",
              transform: [
                { scale: 1 },
                { translateX: AnimateRec4.x },
                { translateY: AnimateRec4.y },
              ],
            }}
          >
            <SvgMusic2 width="35px" height="35px" />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default ChatFooter;

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    borderRadius: 21,

    padding: 5,
    marginBottom: Platform.OS === "android" ? "0%" : "6%",
    borderBottomWidth: 0,
    backgroundColor: "#E8E9ED",
  },
  textInput: {
    maxHeight: 130,
    flex: 1,
    fontSize: 15,
    marginRight: 15,
    padding: 10,
    color: "rgba(13, 36, 129, 0.7)",
  },
  sendBtn: {
    backgroundColor: "#3FFF8C",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    height: 23,
    marginRight: 5,
    borderRadius: 7,
  },
});
