/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  StyleSheet
} from 'react-native';
// /import CallScreen from './screens/CallScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { Provider } from 'react-redux';
import store from './redux/store';
import ConvsDetailScreen from './screens/ConvsDetailScreen';
const App = () => {
  const Stack = createStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ConvsDetail" component={ConvsDetailScreen} />
          {/* <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Call" component={CallScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;