import {
  MessageOrderSideType,
  NormalizedOrderSideEntryType,
  NormalizedOrderSideType,
  OrderSideType,
} from './types';
import cloneDeep from 'lodash/cloneDeep';
const orderSideAscComparator = (a: OrderSideType, b: OrderSideType) => {
  if (a[0] < b[0]) {
    return -1;
  } else if (a[0] > b[0]) {
    return 1;
  }
  return 0;
};

const orderSideDescComparator = (a: OrderSideType, b: OrderSideType) => {
  if (a[0] < b[0]) {
    return 1;
  } else if (a[0] > b[0]) {
    return -1;
  }
  return 0;
};

export function normalizeOrders(orders: [number, number][]) {
  const result: NormalizedOrderSideEntryType = {};
  orders.forEach((order: [number, number]) => {
    const id = String(order[0]);
    const orderSideType: NormalizedOrderSideType = {
      id,
      price: order[0],
      size: order[1],
      total: 0,
    };
    result[id] = orderSideType;
  });
  return result;
}

export function processOrderSide(
  currentOrderSides: OrderSideType[] = [],
  deltaOrderSides: MessageOrderSideType[] = [],
  sortOrder: string = 'asc',
) {
  const processedOrderSides = cloneDeep(currentOrderSides);
  for (const deltaOrderSide of deltaOrderSides) {
    const findIndexOfDeltaOrderSideInCurrentOrderSides =
      processedOrderSides.findIndex(
        (currentBid: OrderSideType) => currentBid[0] === deltaOrderSide[0],
      );
    if (findIndexOfDeltaOrderSideInCurrentOrderSides !== -1) {
      // remove price level if 0
      if (deltaOrderSide[1] === 0) {
        processedOrderSides.splice(
          findIndexOfDeltaOrderSideInCurrentOrderSides,
          1,
        );
      } else {
        processedOrderSides[findIndexOfDeltaOrderSideInCurrentOrderSides] = [
          ...deltaOrderSide,
          0,
        ];
      }
    } else {
      // if deltaOrderSide price level not found in currentOrderSides, add it to the end
      if (deltaOrderSide[1] !== 0) {
        processedOrderSides.push([...deltaOrderSide, 0]);
      }
    }
  }
  // sort order side according to comparator
  processedOrderSides.sort(
    sortOrder === 'asc' ? orderSideAscComparator : orderSideDescComparator,
  );
  // calculate total
  processedOrderSides.reduce(
    (
      previous: OrderSideType,
      current: OrderSideType,
      currentIndex: number,
      array: OrderSideType[],
    ): OrderSideType => {
      // current total = current size + sum of all sizes above(i.e previousTotal)
      processedOrderSides[currentIndex][2] = current[1] + previous[2];
      return current;
    },
    [0, 0, 0],
  );
  return processedOrderSides;
}

export function getProcessedOrderSides({
  currentBids = [],
  currentAsks = [],
  deltaBids = [],
  deltaAsks = [],
}: {
  currentBids: OrderSideType[];
  currentAsks: OrderSideType[];
  deltaBids: MessageOrderSideType[];
  deltaAsks: MessageOrderSideType[];
}) {
  const newBids = processOrderSide(currentBids, deltaBids, 'desc');
  const newAsks = processOrderSide(currentAsks, deltaAsks);
  return {
    newBids,
    newAsks,
  };
}
