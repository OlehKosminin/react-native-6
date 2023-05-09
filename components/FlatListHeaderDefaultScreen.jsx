import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const FlatListHeaderDefaultScreen = ({ photoURL, nickName, email }) => {
  return (
    <>
      <View style={styles.user}>
        {!photoURL ? (
          <View style={styles.avatar}></View>
        ) : (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        )}
        <View>
          <Text style={styles.name}>{nickName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
    </>
  );
};

export default FlatListHeaderDefaultScreen;

const styles = StyleSheet.create({
  user: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 32,
    marginTop: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 16,
    marginRight: 8,
  },

  name: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  email: {
    fontFamily: "Roboto-Regulat",
    fontSize: 11,
  },
});
