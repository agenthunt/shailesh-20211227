import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AccentColor} from '../../../theme/colors';
import {LED_FONT_FAMILY} from '../../../theme/fonts';
import {OrderListColumnSortOrder, OrderListItemType} from '../types';

export function OrderListHeaderRow({
  columnOrder,
}: {
  columnOrder: OrderListColumnSortOrder;
}) {
  const priceColumn = (
    <View style={styles.column}>
      <Text style={styles.headerPrice}>PRICE</Text>
    </View>
  );
  const sizeColumn = (
    <View style={styles.column}>
      <Text style={styles.headerSize}>SIZE</Text>
    </View>
  );

  const totalColumn = (
    <View style={styles.column}>
      <Text style={styles.headerTotal}>TOTAL</Text>
    </View>
  );
  return (
    <View style={styles.headerRowContainer}>
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
  headerRowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 0.33,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  headerTotal: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
    fontFamily: LED_FONT_FAMILY,
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  headerSize: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
    fontFamily: LED_FONT_FAMILY,
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  headerPrice: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
    fontFamily: LED_FONT_FAMILY,
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
