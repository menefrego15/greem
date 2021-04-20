import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Button, View } from "react-native";
import { Input } from "react-native-elements";
import { auth, db } from "../firebase";

const ModalName = ({ modalVisible, setModalVisible, user }) => {
  const [name, setname] = useState();

  const updateProfileName = () => {
    if (name !== undefined) {
      auth.currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          db.collection("users").doc(auth?.currentUser?.uid).update({
            userName: name,
          });
          setModalVisible(!modalVisible);
        });
    }
  };

  return (
    <View style={styles.centeredView}>
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
            <Input
              placeholder={user?.displayName}
              type="text"
              autoFocus
              value={name}
              onChangeText={(text) => setname(text)}
            />
            <Button onPress={updateProfileName} title="Confirm" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalName;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    height: "86%",
    padding: 35,
    alignItems: "center",
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
