import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Button,
  TouchableHighlight,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import { auth, db } from "../firebase";
import { useFonts } from "expo-font";

const ModalBio = ({ biomodalvisible, setBiomodalvisible, user }) => {
  const [bio, setbio] = useState();

  let [fontsLoaded] = useFonts({
    "Oswald-Bold": require("../assets/fonts/static/Oswald-Bold.ttf"),
    "Oswald-SemiBold": require("../assets/fonts/static/Oswald-SemiBold.ttf"),
    "Oswald-Medium": require("../assets/fonts/static/Oswald-Medium.ttf"),
    "Oswald-Light": require("../assets/fonts/static/Oswald-Light.ttf"),
  });

  const updateProfileBio = () => {
    if (bio !== undefined) {
      db.collection("users")
        .doc(auth?.currentUser?.uid)
        .update({
          bioUser: bio,
        })
        .then(() => setBiomodalvisible(!biomodalvisible));
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={biomodalvisible}
        onRequestClose={() => {
          setBiomodalvisible(!biomodalvisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontFamily: "Oswald-Bold", fontSize: 25 }}>
              Comment tu t'appelles ?
            </Text>
            <Input
              placeholder={user?.displayName}
              type="text"
              autoFocus
              value={bio}
              inputContainerStyle={{
                borderColor: "transparent",
              }}
              textAlign={"center"}
              onChangeText={(text) => setbio(text)}
            />
            <Button onPress={updateProfileBio} title="Confirm" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalBio;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    height: "86%",
    padding: 35,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
