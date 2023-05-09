import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet, ImageBackground, FlatList } from "react-native";
import FlatListHeaderProfileScreen from "../../components/FlatListHeaderProfileScreen";
import Item from "../../components/Item";

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import {
  authSingOutUser,
  authUpdatePhotoURL,
} from "../../redux/auth/authOperations";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ProfileScreen = ({ navigation }) => {
  const { nickName, userId, photoURL } = useSelector((state) => state.auth);
  const [photo, setPhoto] = useState(photoURL);
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
    })();

    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("date")
    );
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      dispatch(authUpdatePhotoURL(result.assets[0].uri));
    }
  };

  const signOut = () => {
    dispatch(authSingOutUser());
  };

  const deletePhoto = () => {
    setPhoto(null);
  };

  const goToComments = (item) => {
    const { photo, id } = item;
    navigation.navigate("Comments", { photo, id });
  };

  const goToMap = (item) => {
    const { loc, name } = item;
    navigation.navigate("Map", { loc, name });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imgBackground}
        source={require("../../assets/images/Photo%20BG.jpg")}
      >
        <View style={styles.bac}></View>
        <FlatList
          ListHeaderComponent={
            <FlatListHeaderProfileScreen
              photo={photo}
              pickImage={pickImage}
              signOut={signOut}
              nickName={nickName}
              deletePhoto={deletePhoto}
            />
          }
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.list}>
              <Item
                item={item}
                goToComments={() => goToComments(item)}
                goToMap={() => goToMap(item)}
              />
            </View>
          )}
        />
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  imgBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bac: {
    position: "absolute",
    top: "35%",
    width: "100%",
    height: "65%",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 60,
  },
  list: {
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
});
