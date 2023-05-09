import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ route, navigation }) => {
  const [props, setProps] = useState(null);

  useEffect(() => {
    if (route.params) {
      setProps(route.params);
    }
  }, [route.params]);

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
        <Text style={styles.headerText}>Map</Text>
      </View>
      {props && (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: props.loc.latitude,
              longitude: props.loc.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: props.loc.latitude,
                longitude: props.loc.longitude,
              }}
              title={props.name}
            />
          </MapView>
        </View>
      )}
    </>
  );
};
export default MapScreen;

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
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
