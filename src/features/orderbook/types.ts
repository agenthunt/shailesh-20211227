export interface NormalizedOrderSideType {
  id: string;
  price: number;
  size: number;
  total: number;
}

export type NormalizedOrderSideEntryType = {
  [key: string]: NormalizedOrderSideType;
};

export enum FeedType {
  BOOK_UI_1 = 'book_ui_1',
  BOOK_UI_1_SNAPSHOT = 'book_ui_1_snapshot',
}

export enum ProductIdType {
  PI_XBTUSD = 'PI_XBTUSD',
  PI_ETHUSD = 'PI_ETHUSD',
}

export interface OrderbookState {
  bids: OrderSideType[];
  asks: OrderSideType[];
  numLevels: number;
  displaySize: number;
  currentProductIds: ProductIdType[];
  subscribeToOrderbookInProgress: boolean;
  subscribeToOrderbookError: any;
  unSubscribeToOrderbookInProgress: boolean;
  unSubscribeToOrderbookError: any;
}

export enum EventType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  SUBSCRIBED = 'subscribed',
}

export type MessageOrderSideType = [number, number];
export type OrderSideType = [number, number, number];

export interface MessagePayloadType {
  feed: FeedType;
  event?: EventType;
  product_ids?: ProductIdType[];
  bids?: MessageOrderSideType[];
  asks?: MessageOrderSideType[];
  numLevels?: number;
}

export type OrderListItemType = {
  price: string;
  size: string;
  total: string;
  depth: number;
};

export enum OrderListColumnSortOrder {
  TSP = 'TSP',
  PST = 'PST',
}
