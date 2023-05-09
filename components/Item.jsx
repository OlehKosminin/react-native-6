import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  collection,
  doc,
  getDoc,
  query,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const Item = ({ item, goToComments, goToMap }) => {
  const [commentsAmount, setCommentsAmount] = useState(null);
  const [toggle, setToggle] = useState(true);
  const { userId } = useSelector((store) => store.auth);
  const id = item.id;

  useEffect(() => {
    const docRef = doc(db, "posts", id);
    const q = query(collection(docRef, "comments"));
    const unsubscribe = onSnapshot(q, (data) => {
      setCommentsAmount(data.docs.length);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const createLike = async (id, userId) => {
    try {
      const postRef = doc(db, "posts", id);
      const result = await getDoc(postRef);
      const likesArr = result.data().likes;
      const like = likesArr.find((el) => el === userId);
      if (like) {
        let newLikesArr = likesArr.filter((el) => el !== userId);
        await updateDoc(postRef, { likes: newLikesArr });
      } else {
        likesArr.push(userId);
        await updateDoc(postRef, { likes: likesArr });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <View style={styles.imgBox}>
        <Image style={styles.img} source={{ uri: item.photo }} />
      </View>
      <Text style={styles.title}>
        {item.name ? item.name : "Название публикации"}
      </Text>
      <View style={styles.descriptionBox}>
        <View style={styles.iconBox}>
          <TouchableOpacity activeOpacity={0.7} onPress={goToComments}>
            <View style={{ ...styles.iconBox, marginRight: 24 }}>
              <Image
                source={require("../assets/images/message-circle.png")}
                style={{ width: 24, height: 24, marginRight: 4 }}
              />
              <Text style={styles.text}>{commentsAmount}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => createLike(id, userId)}
          >
            <View style={styles.iconBox}>
              <Image
                source={require("../assets/images/thumbs-up.png")}
                style={{ width: 24, height: 24, marginRight: 4 }}
              />
              <Text style={styles.text}>{item.likes.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={goToMap}>
          <View style={styles.iconBox}>
            <Image
              source={require("../assets/images/map-pin.png")}
              style={{ width: 24, height: 24, marginRight: 4 }}
            />
            <Text
              style={{
                ...styles.text,
                textDecorationLine: "underline",
              }}
            >
              {item.place ? item.place : "Посмотреть на карте"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
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
  descriptionBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  iconBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
  },
});
