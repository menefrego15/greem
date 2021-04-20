import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { SvgMessage } from "./svg";

const TabBar = ({ focused }) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: "white",
          width: 65,
          height: 65,
          borderRadius: 30,
          shadowColor: "rgba(13, 36, 129, 0.40)",
          elevation: focused ? 5 : 2,
          shadowOpacity: 1.0,
          shadowRadius: 14,
          justifyContent: "center",
          alignItems: "center",
          transform: focused ? [{ scale: 1.04 }] : [{ scale: 1 }],
        }}
      >
        <SvgMessage height="60%" width="60%" />
      </View>
    </View>
  );
};
export default TabBar;

const styles = StyleSheet.create({});
