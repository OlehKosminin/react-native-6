import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

const FlatListHeaderProfileScreen = ({
  photo,
  pickImage,
  signOut,
  nickName,
  deletePhoto,
}) => {
  return (
    <View style={styles.box}>
      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.img} />
          ) : (
            <View style={styles.noAvatar}></View>
          )}
          {!photo ? (
            <TouchableOpacity
              style={styles.btnPlus}
              activeOpacity={0.7}
              onPress={pickImage}
            >
              <View>
                <Image
                  source={require("../assets/images/add.png")}
                  style={{ width: 30, height: 30 }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPlus}
              activeOpacity={0.7}
              onPress={deletePhoto}
            >
              <View>
                <Image
                  source={require("../assets/images/del.png")}
                  style={{ width: 30, height: 30 }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableWithoutFeedback onPress={signOut}>
        <View style={styles.autBtn}>
          <Image
            source={require("../assets/images/log-out.png")}
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.userName}>{nickName}</Text>
    </View>
  );
};

export default FlatListHeaderProfileScreen;

const styles = StyleSheet.create({
  box: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    marginTop: 140,
    borderTopLeftRadius: 25,
    borderTopEndRadius: 25,
  },
  avatarBox: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    position: "absolute",
    top: -60,
    alignItems: "center",
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  noAvatar: {
    backgroundColor: "#F6F6F6",
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  btnPlus: {
    position: "absolute",
    top: 75,
    left: 105,
    backgroundColor: "rgba(0,0,0, 0.2)",
    borderRadius: 50,
  },
  autBtn: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  userName: {
    marginTop: 92,
    marginBottom: 32,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 30,
  },
  imgBox: {
    height: 240,
    marginBottom: 8,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    marginBottom: 8,
  },
});
