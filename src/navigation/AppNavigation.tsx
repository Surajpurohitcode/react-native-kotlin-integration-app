// AppNavigation.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import ListScreen from '../../screens/ListScreen';
import UserDetailsScreen from '../../screens/UserDetails';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Details' component={UserDetailsScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}