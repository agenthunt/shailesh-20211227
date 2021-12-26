import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LED_FONT_FAMILY} from '../theme/fonts';

export function LedButton({
  onPress,
  style,
  title,
}: {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: any;
  title: string;
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
  },
  title: {
    fontFamily: LED_FONT_FAMILY,
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
