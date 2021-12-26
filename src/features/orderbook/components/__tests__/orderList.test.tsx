/**
 * @format
 */

import 'react-native';
import React from 'react';

import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';

import {OrderList} from '../orderList';
import {OrderListColumnSortOrder, OrderListItemType} from '../../types';

describe('OrderList component testing', () => {
  it('renders default state of OrderList correctly', () => {
    const items: OrderListItemType[] = [
      {
        price: '1000',
        size: '50',
        total: '50',
        depth: 4.3,
      },
      {
        price: '1005',
        size: '100',
        total: '150',
        depth: 13,
      },
      {
        price: '1010',
        size: '1000',
        total: '1150',
        depth: 100,
      },
    ];
    const tree = renderer
      .create(
        <OrderList
          items={items}
          depthColor="#641c25"
          priceColumnColor="#eb4057"
          columnOrder={OrderListColumnSortOrder.PST}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
