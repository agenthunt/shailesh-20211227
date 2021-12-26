/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Orderbook} from './features/orderbook/orderbook';

const App = () => {
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
