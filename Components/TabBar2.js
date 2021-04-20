import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";

import { SvgProfil } from "./svg";

const TabBar2 = ({ focused }) => {
  return (
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
      <SvgProfil height="60%" width="60%" />
    </View>
  );
};
export default TabBar2;

const styles = StyleSheet.create({});
