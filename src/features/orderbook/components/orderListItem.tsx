import {OrderListColumnSortOrder, OrderListItemType} from '../types';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {AccentColor} from '../../../theme/colors';
import {OrderSideType} from '../types';

export function OrderListItem({
  item,
  depthColor,
  priceColumnColor,
  columnOrder,
}: {
  item: OrderListItemType;
  depthColor: string;
  priceColumnColor: string;
  columnOrder: OrderListColumnSortOrder;
}) {
  const priceColumn = (
    <View style={styles.column}>
      <Text style={[styles.textPrice, {color: priceColumnColor}]}>
        {item.price}
      </Text>
    </View>
  );
  const sizeColumn = (
    <View style={styles.column}>
      <Text style={styles.textSize}>{item.size}</Text>
    </View>
  );

  const totalColumn = (
    <View style={styles.column}>
      <Text style={styles.textTotal}>{item.total}</Text>
    </View>
  );
  return (
    <View style={[styles.itemContainer]}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: depthColor,
          height: 28,

          //   borderWidth: 0.1,
          //   borderColor: 'rgba(255, 255, 255, 0.1)',
          width: `${item.depth * 100}%`,
        }}
      />
      {columnOrder === OrderListColumnSortOrder.PST ? (
        <>
          {priceColumn}
          {sizeColumn}
          {totalColumn}
        </>
      ) : (
        <>
          {totalColumn}
          {sizeColumn}
          {priceColumn}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  column: {
    flex: 0.33,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  textTotal: {
    color: '#fff',
  },
  textSize: {
    color: '#fff',
  },
  textPrice: {
    color: AccentColor,
  },
});
