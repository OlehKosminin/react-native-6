import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Item from "../../components/Item";
import FlatListHeaderDefaultScreen from "../../components/FlatListHeaderDefaultScreen";
import { db } from "../../firebase/config";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import { authSingOutUser } from "../../redux/auth/authOperations";

const DefaultScreenPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();
  const { nickName, email, photoURL } = useSelector((state) => state.auth);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (data) => {
      const posts = data.docs.map((post) => ({
        ...post.data(),
        id: post.id,
      }));
      setPosts(posts);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = () => {
    dispatch(authSingOutUser());
  };

  const goToComments = (item) => {
    const { photo, id } = item;
    navigation.navigate("Comments", { photo, id });
  };

  const goToMap = (item) => {
    const { loc, name } = item;
    navigation.navigate("Map", { loc, name });
  };

  if (posts) {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerText}>Publish</Text>
          <TouchableWithoutFeedback onPress={signOut}>
            <View style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
              <Image
                source={require("../../assets/images/log-out.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.container}>
          <FlatList
            ListHeaderComponent={
              <FlatListHeaderDefaultScreen
                photoURL={photoURL}
                nickName={nickName}
                email={email}
              />
            }
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Item
                item={item}
                goToComments={() => goToComments(item)}
                goToMap={() => goToMap(item)}
              />
            )}
          />
        </View>
      </>
    );
  }
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Publish</Text>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Login")}>
          <View style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
            <Image
              source={require("../../assets/images/log-out.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.container}>
        <Text>Publish</Text>
        <View style={styles.user}>
          <View style={styles.avatar}></View>
          <View>
            <Text style={styles.name}>User name</Text>
            <Text style={styles.email}>User email</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default DefaultScreenPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: 60,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 90,
    borderBottomWidth: 2,
    borderBottomColor: "#E8E8E8",
    backgroundColor: "#fff",
  },
  headerText: {
    marginBottom: 15,
    marginLeft: 16,
    fontFamily: "Roboto-Bold",
    fontSize: 17,
  },
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
