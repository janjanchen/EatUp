import {
  Platform,
  Text,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../../firebase/config";
import MapView from "react-native-map-clustering";
import { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-elements";
import ChangeDisplayPic from "./ChangeDisplayPic";
import GooglePlacesInput from "./googleMap";
import defaultUserImage from "../../../assets/default-user-image.png";
import FastFoodIcon from "../../../assets/FastFoodIcon.jpeg";
import Search from "./Search";
import { mapStyle, mapStyle2 } from "./MapTheme";
import PostViewMapFormat from "../Components/PostViewMapFormat";

export default function Home({ navigation, route}, props) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      alert("Refreshed");
//      if(props.route.params) {
//      alert(route.params.pic)
//      setUserPicture(route.params.pic);
//      } else {
//      alert('hi')
//      }
      getUserDetails();
      getUserFriendNetwork();
      PostPlaces();
      WantToGoPlace();
      setMarkerPressed(null);
    });
    return unsubscribe;
  }, [navigation]);

  const mapRef = useRef();
  var initRegion = {
    latitude: 1.3649170000000002,
    longitude: 103.82287200000002,
    latitudeDelta: 0.3,
    longitudeDelta: 0.25,
  };

  const animateToRegion = () => {
    mapRef.current.animateToRegion(initRegion, 2000);
  };

  const [userData, setUserData] = useState(null);
  const [userFriendNetwork, setUserFriendNetwork] = useState(null);
  const [wantToGo, setWantToGo] = useState(null);
  const [postPlaces, setPostPlaces] = useState(null);
  const [starMarkerFilter, setStarMarkerFilter] = useState(true);
  const [postMarkerFilter, setPostMarkerFilter] = useState(true);
  const [backToInitialRegion, setBackToInitialRegion] = useState(false);
  const [markerPressed, setMarkerPressed] = useState(null);
  const [userPicture, setUserPicture] = useState(null);

  const username = firebase.auth().currentUser.displayName;

  const starMarkerFilterIcon = starMarkerFilter ? "star" : "star-outline";
  const postMarkerFilterIcon = postMarkerFilter ? "eye" : "eye-outline";

  const onMarkerPressed = (id) => {
    setMarkerPressed(id);
  };

  const onStarMarkerFilterPressed = () => {
    if (starMarkerFilter) {
      setStarMarkerFilter(false);
    } else {
      setStarMarkerFilter(true);
    }
  };

  const onPostMarkerFilterPressed = () => {
    if (postMarkerFilter) {
      setPostMarkerFilter(false);
    } else {
      setPostMarkerFilter(true);
    }
  };

  const getUserDetails = async () => {
    if (username == null) return;
    await firebase
      .firestore()
      .collection("users")
      .doc(username)
      .get()
      .then((documentSnapshot) => {
        setUserData(documentSnapshot.data());
      })
      .catch((e) => {
        alert(e);
      });
  };

  const getUserFriendNetwork = async () => {
    if (username == null) return;
    await firebase
      .firestore()
      .collection("FriendNetwork")
      .doc(username)
      .get()
      .then((documentSnapshot) => {
        setUserFriendNetwork(documentSnapshot.data());
      })
      .catch((e) => {
        alert(e);
      });
  };

  const PostPlaces = async () => {
    try {
      const PostPlacesArray = [];
      if (username == null) return;
      await firebase
        .firestore()
        .collection(username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              id,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              likes,
              wantToGo,
              user,
              timestamp,
              comments,
            } = doc.data();

            PostPlacesArray.push({
              id: doc.id,
              user,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              timestamp: timestamp,
              liked: likes.includes(username),
              likes: likes.length,
              wantToGoUsers: wantToGo,
              wantToGo: wantToGo.includes(username),
              wantToGoCount: wantToGo.length,
              comments,
            });
          });
        })
        .catch((error) => {
          alert(error);
        });
      setPostPlaces(PostPlacesArray);
    } catch (e) {
      console.log(e);
    }
  };

  const WantToGoPlace = async () => {
    try {
      const wantToGoArray = [];
      if (username == null) return;
      await firebase
        .firestore()
        .collection("Posts")
        .where("wantToGo", "array-contains", username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              id,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              likes,
              wantToGo,
              user,
              timestamp,
              comments,
            } = doc.data();

            wantToGoArray.push({
              id: doc.id,
              user,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              timestamp: timestamp,
              liked: likes.includes(username),
              likes: likes.length,
              wantToGo: wantToGo.includes(username),
              wantToGoCount: wantToGo.length,
              comments,
            });
          });
        })
        .catch((error) => {
          alert(error);
        });
      setWantToGo(wantToGoArray);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getUserFriendNetwork();
  }, []);

  useEffect(() => {
    WantToGoPlace();
  }, []);

  useEffect(() => {
    PostPlaces();
  }, []);

  useEffect;

  const onUserPressed = (markerPressed) => {
    const friends = userFriendNetwork ? userFriendNetwork.friends : null;
    if (markerPressed.user == username) {
      navigation.navigate("Home");
    }
    if (friends.includes(markerPressed.user)) {
      navigation.navigate("OtherUser", {
        otherUser: markerPressed.user,
        otherUserFriendArray: friends,
      });
    } else {
      alert("Viewing profile is only available after adding friend");
    }
  };

  const onCommentPressed = (item) => {
    navigation.navigate("Comment", {
      postId: item.id,
      postOwner: item.user,
      postComment: item.comments,
      userFriends: userFriendNetwork ? userFriendNetwork.friends : [],
    });
  };

  const LogoutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate("Start");
        alert("See you soon!");
      });
  };

  const markerIcon = (postTag) => {
    if (postTag == "Fast Food") {
      return FastFoodIcon;
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.homecontainer}>
      <View style={styles.upper}>
        <IconButton
          icon="arrow-left-circle"
          onPress={LogoutUser}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
        <IconButton
          icon="cog-outline"
          onPress={() => navigation.navigate("Settings")}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
      </View>

      <View style={styles.middle}>
        <Text style={styles.name}>Hello, {username}!</Text>
        <Avatar
          rounded
          size="large"
          avatarStyle={{ width: 100, height: 100, borderRadius: 50 }}
          containerStyle={{
            width: 100,
            height: 100,
            borderWidth: 1,
            borderRadius: 50,
          }}
          onPress={() => {
            navigation.navigate("ChangeDisplayPic", {
              picture: userData ? userData.displayPicture : null,
            });
          }}
          source={{ uri: userPicture? userPicture : (userData ? userData.displayPicture : null) }}
        />
        <Text>
          {" "}
          Following{" "}
          {userFriendNetwork ? userFriendNetwork.friends.length : null} other
          Food Lover(s)!{" "}
        </Text>

        <MapView
          ref={mapRef}
          style={styles.map}
          scrollEnabled={false}
          initialRegion={initRegion}
          scrollEnabled={true}
          minZoomLevel={10}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          clusterColor="#fffbf1"
          clusterTextColor="black"
        >
          {wantToGo && starMarkerFilter
            ? wantToGo.map((post) => (
                <Marker
                  onPress={() => onMarkerPressed(post)}
                  pinColor={"#fffcc7"}
                  key={post.id}
                  coordinate={{
                    latitude: post.postGeoCoordinates.latitude,
                    longitude: post.postGeoCoordinates.longitude,
                  }}
                >
                  <Callout tooltip style={styles.calloutBox}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={markerIcon(post.postTag)}
                    />
                    <Text style={styles.tagTextCallout}>{post.postTag}</Text>
                    <Text style={styles.locationTextCallout}>
                      {post.postLocation}
                    </Text>
                  </Callout>
                </Marker>
              ))
            : null}

          {postPlaces && postMarkerFilter ? (
            postPlaces.map((post) => (
              <Marker
                key={post.id}
                coordinate={{
                  latitude: post.postGeoCoordinates.latitude,
                  longitude: post.postGeoCoordinates.longitude,
                }}
                onPress={() => onMarkerPressed(post)}
              >
                <Callout tooltip style={styles.calloutBox}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={markerIcon(post.postTag)}
                  />
                  <Text style={styles.tagTextCallout}>{post.postTag}</Text>
                  <Text style={styles.locationTextCallout}>
                    {post.postLocation}
                  </Text>
                </Callout>
              </Marker>
            ))
          ) : (
            <View />
          )}
        </MapView>
      </View>

      <View style={styles.filter}>
        <IconButton
          icon={starMarkerFilterIcon}
          onPress={onStarMarkerFilterPressed}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
        <IconButton
          icon={postMarkerFilterIcon}
          onPress={onPostMarkerFilterPressed}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
        <IconButton
          icon="crosshairs-gps"
          onPress={animateToRegion}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
      </View>

      <View style={styles.postcontainer}>
        {markerPressed ? (
          <PostViewMapFormat
            markerPost={markerPressed}
            onPress={() => onUserPressed(markerPressed)}
            onCommentPressed={() => onCommentPressed(markerPressed)}
          />
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf1",
  },

  homecontainer: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 3,
    backgroundColor: "#fffbf1",
    alignItems: "stretch",
    justifyContent: "space-around",
  },

  postcontainer: {
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },

  upper: {
    flexDirection: "row",
    backgroundColor: "#fffbf1",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  middle: {
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  filter: {
    flexDirection: "row",
    backgroundColor: "#fffbf1",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  map: {
    width: 600,
    height: 250,
  },
  name: {
    color: "#3e1f0d",
    fontSize: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutBox: {
    width: 150,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#3e1f0d",
    borderWidth: 1,
    backgroundColor: "#fffdf5",
    padding: 10,
    borderRadius: 20,
  },
  tagTextCallout: {
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  locationTextCallout: {
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
