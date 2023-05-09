import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Image,
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import { authSignUpUser } from "../../redux/auth/authOperations";

const RegistrationScreen = ({ navigation, route }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [photo, setPhoto] = useState(
    "https://files.fm/thumb_show.php?i=c6e28ndjn"
  );
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [hidePass, setHidePass] = useState(true);

  const dispatch = useDispatch();

  const loginHandler = (text) => setLogin(text);
  const emailHandler = (text) => setEmail(text);
  const passwordHandler = (text) => setPassword(text);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
    })();

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsShowKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKeyboard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onLogin = async () => {
    try {
      if (
        login.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
      ) {
        setError("Please fill in all input fields");
      } else {
        setError(null);
        const user = { login, email, password, photo };
        dispatch(authSignUpUser(user));
        setLogin("");
        setEmail("");
        setPassword("");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : ""}
      >
        <ImageBackground
          style={{ flex: 1, justifyContent: "flex-end" }}
          source={require("../../assets/images/Photo%20BG.jpg")}
        >
          <View
            style={{
              ...styles.form,
              marginBottom: isShowKeyboard ? -140 : 0,
            }}
          >
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
                        source={require("../../assets/images/add.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btnPlus}
                    activeOpacity={0.7}
                    onPress={() => setPhoto(null)}
                  >
                    <View>
                      <Image
                        source={require("../../assets/images/del.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.title}>Register</Text>
            <TextInput
              value={login}
              onChangeText={loginHandler}
              placeholder="Login"
              style={styles.input}
              onFocus={onFocus}
            />
            <TextInput
              value={email}
              onChangeText={emailHandler}
              placeholder="Email"
              style={styles.input}
              onFocus={onFocus}
            />
            <View>
              <TextInput
                value={password}
                onChangeText={passwordHandler}
                placeholder="Password"
                secureTextEntry={hidePass ? true : false}
                style={styles.input}
                onFocus={onFocus}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setHidePass(!hidePass)}
                style={styles.passwordBtn}
              >
                <Text style={styles.passwordText}>Show</Text>
              </TouchableOpacity>
              {!!error && <Text style={styles.error}>{error}</Text>}
            </View>
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.7}
              onPress={onLogin}
            >
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.text}>Have account ? SingIn</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopEndRadius: 25,
  },
  input: {
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
  },
  title: {
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 30,

    marginTop: 92,
    marginBottom: 32,
  },
  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    marginHorizontal: 16,
    borderRadius: 100,
    marginTop: 27,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
  },

  text: {
    textAlign: "center",
    marginBottom: 45,
    color: "#1B4371",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
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
  img: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  btnPlus: {
    position: "absolute",
    top: 75,
    left: 105,
    backgroundColor: "rgba(0,0,0, 0.2)",
    borderRadius: 50,
  },
  passwordBtn: {
    position: "absolute",
    top: 13,
    right: 34,
  },
  passwordText: {
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "red",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
    marginTop: 10,
  },
});
