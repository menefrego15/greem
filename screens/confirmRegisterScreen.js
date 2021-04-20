import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { auth, db, storage } from "../firebase";
import uuid from "uuid";

const ConfirmRegisterScreen = ({ navigation, route }) => {
  const [loading, setloading] = useState(true);

  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      uploadImage(route.params.image);
    }
  });

  async function uploadImage(uri) {
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
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const urlImage = await snapshot.ref.getDownloadURL();

    if (urlImage === undefined) {
      console.log("url undefined");
    } else {
      auth.currentUser
        .updateProfile({
          photoURL: urlImage,
        })
        .then(() => {
          setloading(false);
          db.collection("users")
            .doc(auth.currentUser.uid)
            .set(
              {
                userName: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
              },
              { merge: true }
            )
            .then(() => {
              navigation.navigate("Home");
            });
        });
    }
  }

  useEffect(() => {
    auth
      .createUserWithEmailAndPassword(route.params.email, route.params.pass)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: route.params.name,
        });
      })
      .then(() => {
        auth.signInWithEmailAndPassword(route.params.email, route.params.pass);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3FFF8C" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="red"
          style={{ position: "absolute" }}
        />
      ) : (
        <Text>YOUR ACCOUNT HAS BEEN CREATED</Text>
      )}
    </SafeAreaView>
  );
};

export default ConfirmRegisterScreen;

const styles = StyleSheet.create({});
