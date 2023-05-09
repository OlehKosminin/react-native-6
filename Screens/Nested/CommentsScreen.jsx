import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import {
  collection,
  addDoc,
  doc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const CommentsScreen = ({ route, navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { id, photo } = route.params;
  const { nickName, photoURL } = useSelector((state) => state.auth);

  const commentHandler = (text) => setComment(text);

  useEffect(() => {
    const docRef = doc(db, "posts", id);
    const q = query(collection(docRef, "comments"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (data) => {
      setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const createPost = async () => {
    const date = new Date().toLocaleString();
    try {
      const postRef = doc(db, "posts", id);
      const createComments = await addDoc(collection(postRef, "comments"), {
        nickName,
        photoURL,
        comment,
        date,
      });
      setComment("");
      keyboardHide();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("DefaultScreen");
          }}
        >
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 14,
            }}
          >
            <Image
              source={require("../../assets/images/arrow-left.png")}
              style={{ width: 23, height: 23 }}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerText}>Comments</Text>
      </View>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          {photo && (
            <View style={styles.imgBox}>
              <Image style={styles.img} source={{ uri: photo }} />
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <FlatList
        style={styles.container}
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentsBox}>
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />

            <View style={styles.comment}>
              <Text style={styles.commentText}>{item.comment}</Text>
              <Text style={styles.commentDate}>{item.date}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputBox}>
        <View style={styles.box}>
          <TextInput
            value={comment}
            onChangeText={commentHandler}
            placeholder="Комментировать..."
            style={styles.input}
            onFocus={onFocus}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.commentBtn}
            onPress={createPost}
          >
            <Image
              source={require("../../assets/images/send.png")}
              style={{ width: 34, height: 34 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default CommentsScreen;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    height: 90,
    borderBottomWidth: 2,
    borderBottomColor: "#E8E8E8",
    backgroundColor: "#fff",
  },
  headerText: {
    marginBottom: 15,
    marginLeft: 20,
    fontFamily: "Roboto-Bold",
    fontSize: 17,
  },
  container: {
    marginBottom: 130,
    paddingHorizontal: 16,
  },
  imgBox: {
    height: 304,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  inputBox: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 50,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
  },
  box: {
    position: "relative",
  },
  commentBtn: {
    position: "absolute",
    top: 24,
    right: 10,
  },
  commentsBox: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 24,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
    marginRight: 16,
  },
  comment: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
  commentText: {
    fontFamily: "Roboto-Regulat",
    fontSize: 13,
    marginBottom: 8,
  },
  commentDate: {
    fontFamily: "Roboto-Regulat",
    fontSize: 10,
    color: "#BDBDBD",
    textAlign: "right",
    marginRight: 44,
  },
});
