import React, { useState } from "react";
import { Image, StyleSheet, Text, View, Platform } from "react-native";

const ImageLoader = ({ style, source, color }) => {
  const [currentuserImage, setcurrentuserImage] = useState(false);

  const handleImageLoad = (event) => {
    setcurrentuserImage(true);
  };

  return (
    <View>
      {currentuserImage ? (
        <Image source={{ uri: source }} style={style} />
      ) : (
        <View>
          <View
            style={[
              style,
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: color,
              },
            ]}
          ></View>
          <View>
            <Image
              source={{ uri: source }}
              style={{
                height: Platform.OS === "android" ? 0 : 1,
              }}
              onLoadEnd={(event) => handleImageLoad(event)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ImageLoader;

const styles = StyleSheet.create({});
