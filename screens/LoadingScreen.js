import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import { auth } from "../firebase";

const LoadingScreen = ({ navigation }) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cleanup = auth.onAuthStateChanged((user) => {
      if (user) {
        if (typeof user.photoURL === "string") {
          Image.prefetch(user.photoURL).then(() =>
            setTimeout(() => {
              navigation.replace("Home");
            }, 800)
          );
        }
      } else {
        setTimeout(() => {
          navigation.replace("Login");
        }, 800);
      }
    });
    return () => {
      cleanup;
    };
  }, [auth]);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startShake();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#3FFF8C",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <Image
          style={{ width: 150, height: 150 }}
          source={require("../assets/logoLoading.png")}
        />
      </Animated.View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
