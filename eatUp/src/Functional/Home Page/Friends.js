import React, { useState, useEffect } from 'react';
import {
  RefreshControl,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  FlatList
} from 'react-native';
import FriendSearch from './FriendSearch'
import {firebase} from '../../firebase/config'
import { StatusBar } from 'expo-status-bar'
import Request from './Request'


export default function Friends ({navigation}) {
    var user = firebase.auth().currentUser
    var userDisplayName = user.displayName

  const [userFriendArray, setUserFriendArray] = useState();

  React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        alert('Refreshed');
        fetchUserFriendArray();
        });
        return unsubscribe;
 }, [navigation]);

  const [refreshing, setRefreshing] = useState(false);

   const wait = (timeout) => {
       return new Promise(resolve => setTimeout(resolve, timeout));
   }

   const onRefresh = React.useCallback(() => {
     setRefreshing(true);
     alert('Refreshed');
     fetchUserFriendArray();
     wait(2000).then(() => setRefreshing(false));
   }, []);

  const fetchUserFriendArray = async () => {

            await firebase.firestore()
              .collection('FriendNetwork')
              .doc(userDisplayName)
              .get()
              .then((documentSnapshot) => {
                 if (documentSnapshot.exists) {
                    setUserFriendArray(documentSnapshot.data());
                 }
              })
              .catch((error) => {
                 alert(error);
              });

  }


  useEffect(() =>
     {
          fetchUserFriendArray();
          } , []
  )

 const updateFriendsFunction = () => {
    fetchUserFriendArray();
    alert("friend list updated!");
  }


    return (
    <SafeAreaView style={styles.container}>
    <View style={styles.friendContainer}>
    <FriendSearch navigation={navigation}
    array={userFriendArray? userFriendArray.friends: []}
    updateFriendsNow={updateFriendsFunction} />
    </View>


    { userFriendArray
    ? (userFriendArray.friendRequests.length > 0
        ? (<View style={styles.requestContainer}>
             <Request friendRequestsArray={userFriendArray.friendRequests} updateFriendsNow={updateFriendsFunction}/>
             </View>)
        : null)
    : null
    }

     </SafeAreaView>
    );


}
const styles = StyleSheet.create({
     container: {
       flex: 3,
       backgroundColor: '#fffbf1',
       alignItems: 'center',
       justifyContent: 'center',
       marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
     },
     friendContainer: {
       flex: 2,
       backgroundColor: '#fffbf1',
       alignItems: 'center',
       justifyContent: 'center',

     },
     requestContainer: {
       flex: 1,
       backgroundColor: '#fffbf1',
       alignItems: 'center',
       justifyContent: 'center',

     },
     textInput: {
         borderWidth: 1,
         borderColor: '#3e1f0d',
         fontSize: 20,
         marginBottom: 15,
         width: 350,
         height: 40,
       },
       button: {
         width: 200,
         marginTop: 30,
         marginBottom: 10,
         alignItems: "center",
         justifyContent: 'center',
         backgroundColor: "#ff5757",
         padding: 15,
         borderRadius: 50,
         },
       btnText: {
         color: "white",
         fontSize: 20,
         justifyContent: "center",
         textAlign: "center",
       },
       image: {
         height: 250,
         width: 350,
         marginBottom: 10
       },
       nobutton: {
              color: '#3e1f0d',
              fontSize: 20,
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
           },
       errorText: {
             fontSize: 20,
             color: '#fd1d1d',
             alignItems: 'center',
             justifyContent: 'center',
             marginTop:20
       },
 })