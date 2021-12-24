import React from 'react';
import {View, Text, Button} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {decrement, increment, selectCount} from './counterSlice';

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text> Counter : {count}</Text>
      <Button title="increment" onPress={() => dispatch(increment())} />
      <Button title="decrement" onPress={() => dispatch(decrement())} />
    </View>
  );
}
