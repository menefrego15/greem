import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase";

const InfoMessage = ({ messages }) => {
  return (
    <View style={styles.infoMessageContainer}>
      {messages?.length > 0 &&
      messages[messages.length - 1].id !== auth?.currentUser?.uid ? (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {messages?.length}
            </Text>
          </View>
        </View>
      ) : null}
      <Text style={{ color: "rgba(13, 36, 129, 0.57)", fontSize: 10 }}>
        14:30PM
      </Text>
    </View>
  );
};

export default InfoMessage;

const styles = StyleSheet.create({
  badgeContainer: {
    alignSelf: "flex-end",
  },
  badge: {
    backgroundColor: "#3FFF8C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingBottom: 2,
    paddingTop: 2,
    padding: 4,
  },
  infoMessageContainer: {
    height: "100%",
    justifyContent: "space-around",
  },
});
