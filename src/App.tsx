/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {useAppState} from '@react-native-community/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAppDimensions, useAppDispatch} from './app/hooks';
import {Orderbook} from './features/orderbook/orderbook';
import {orderbookSlice} from './features/orderbook/orderbookSlice';

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const dispatch = useAppDispatch();
  const {isDesktop} = useAppDimensions();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App is going to background!');
        dispatch(orderbookSlice.actions.unsubscribeToOrderbook());
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <SafeAreaView data-cy="safeAreaView" style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Orderbook />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollView: {},
  contentContainerStyle: {
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
});

export default App;
