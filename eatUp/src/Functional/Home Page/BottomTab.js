import React from 'react';
import Search from './Search';
import Feed from './Feed';
import Post from './Post';
import Home from './Home';
import Friends from './Friends';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomTab () {

const Tab = createBottomTabNavigator();

      return (
               <Tab.Navigator
                   initialRouteName="HomeScreen"
                      tabBarOptions={{
                      inactiveTintColor: '#3e1f0d',
                      activeTintColor: '#ff5757',
                      style: { backgroundColor: '#f9ae8f'},
                      }}
               >
               <Tab.Screen
                    name="HomeScreen"
                    component={Home}
                    options={{
                          tabBarLabel: 'Home',
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                          ),
                        }}
                     />

             <Tab.Screen
                    name="Feed"
                    component={Feed}
                    options={{
                          tabBarLabel: 'Feed',
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="map-marker-radius-outline" color={color} size={size} />
                          ),
                        }}
                />

               <Tab.Screen
                    name="Post"
                    component={Post}
                    options={{
                          tabBarLabel: 'Post',
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={size} />
                          ),
                        }}
               />

               <Tab.Screen
                    name="Friends"
                    component={Friends}
                    options={{
                          tabBarLabel: 'Friends',
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-multiple" color={color} size={size} />
                           ),
                         }}
               />

               <Tab.Screen
                    name="Search"
                    component={Search}
                    options={{
                          tabBarLabel: 'Search',
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={size} />
                           ),
                         }}
               />

               </Tab.Navigator>
      );

 }
