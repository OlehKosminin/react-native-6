import { auth } from "../../firebase/config";
import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSingOut } = authSlice.actions;

export const authSignUpUser =
  ({ login, email, password, photo }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: login,
      });

      if (photo) {
        const response = await fetch(photo);
        const file = await response.blob();
        const uniquePostId = Date.now().toString();
        const storageRef = ref(storage, `avatar/${uniquePostId}`);
        await uploadBytes(storageRef, file);
        const processedPhoto = await getDownloadURL(
          ref(storage, `avatar/${uniquePostId}`)
        );
        await updateProfile(auth.currentUser, {
          photoURL: processedPhoto,
        });
      }
      const {
        uid,
        displayName,
        email: userEmail,
        photoURL,
      } = await auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          nickName: displayName,
          email: userEmail,
          photoURL,
        })
      );
    } catch (error) {
      Alert.alert(error.message);
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

export const authSingOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSingOut());
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const onAuthStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUpdateProfile = {
          userId: user.uid,
          nickName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        dispatch(authStateChange({ stateChange: true }));
        dispatch(updateUserProfile(userUpdateProfile));
      }
    });
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const authUpdatePhotoURL = (photo) => async (dispatch, getState) => {
  try {
    if (photo) {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const storageRef = ref(storage, `avatar/${uniquePostId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(
        ref(storage, `avatar/${uniquePostId}`)
      );
      await updateProfile(auth.currentUser, {
        photoURL: processedPhoto,
      });
    }
    const {
      uid,
      displayName,
      email: userEmail,
      photoURL,
    } = await auth.currentUser;

    dispatch(
      updateUserProfile({
        userId: uid,
        nickName: displayName,
        email: userEmail,
        photoURL,
      })
    );
  } catch (error) {
    Alert.alert(error.message);
  }
};
