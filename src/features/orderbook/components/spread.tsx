import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAppSelector} from '../../../app/hooks';
import {LED_FONT_FAMILY} from '../../../theme/fonts';
import {selectors} from '../orderbookSlice';

export function Spread({style}: {style?: any}) {
  const spread = useAppSelector(selectors.getSpread());
  return (
    <View style={[styles.container, style]}>
      {spread && <Text style={styles.text}>{spread} - Spread</Text>}
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
    fontFamily: LED_FONT_FAMILY,
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
