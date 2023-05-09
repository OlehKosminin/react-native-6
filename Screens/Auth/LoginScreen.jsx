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
} from "react-native";

import { authSingInUser } from "../../redux/auth/authOperations";

const LoginScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [hidePass, setHidePass] = useState(true);

  const dispatch = useDispatch();

  const emailHandler = (text) => setEmail(text);
  const passwordHandler = (text) => setPassword(text);

  useEffect(() => {
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

  const onLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill in all input fields");
    } else {
      setError(null);
      const user = { email, password };
      dispatch(authSingInUser(user));
      setEmail("");
      setPassword("");
    }
  };

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
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
              marginBottom: isShowKeyboard ? -200 : 0,
            }}
          >
            <Text style={styles.title}>Sing In</Text>
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
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.7}
              onPress={onLogin}
            >
              <Text style={styles.btnText}>Sing In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.text}>Dont have account? Register</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

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
    marginTop: 32,
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
    marginBottom: 111,
    color: "#1B4371",
    fontFamily: "Roboto-Regulat",
    fontSize: 16,
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
