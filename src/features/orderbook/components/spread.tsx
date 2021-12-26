import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAppSelector} from '../../../app/hooks';
import {selectors} from '../orderbookSlice';

export function Spread({style}: {style: any}) {
  const spread = useAppSelector(selectors.getSpread());
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{spread} Spread</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  text: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
  },
});
