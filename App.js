import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MessagesScreen from "./screens/MessagesScreen";
import AddFriend from "./screens/addFriend";
import chatScreen from "./screens/ChatScreen";
import NewProfil from "./screens/NewProfil";
import UpdateProfil1 from "./screens/updateProfil1";
import UpdateProfil2 from "./screens/updateProfil2";
import LoadingScreen from "./screens/LoadingScreen";
import ConfirmRegisterScreen from "./screens/confirmRegisterScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SvgMessage, SvgProfil } from "./Components/svg";
import TabBar from "./Components/TabBar";
import TabBar2 from "./Components/TabBar2";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Messages"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === "Messages") {
            return <TabBar focused={focused} />;
          } else if (route.name === "Profil") {
            return <TabBar2 focused={focused} />;
          }
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          backgroundColor: "transparent",
          bottom: 0,
          marginBottom: "10%",
          left: 0,
          right: 0,
          borderBottomColor: "rgba(0, 0, 0, 0.0)",
          borderTopColor: "rgba(0, 0, 0, 0.0)",
          elevation: 0,
          zIndex: 30,
        },
      }}
    >
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profil" component={NewProfil} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer style={{ backgroundColor: "#3FFF8C" }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen
          options={{
            title: "Login",
          }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            title: "Register",
          }}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{
            title: "Update Profil",
          }}
          name="UpdateProfil1"
          component={UpdateProfil1}
        />
        <Stack.Screen
          options={{
            title: "Update Profil",
          }}
          name="UpdateProfil2"
          component={UpdateProfil2}
        />
        <Stack.Screen
          options={{
            title: "Update Profil",
          }}
          name="ConfirmRegisterScreen"
          component={ConfirmRegisterScreen}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddFriend" component={AddFriend} />
        <Stack.Screen name="Chat" component={chatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
