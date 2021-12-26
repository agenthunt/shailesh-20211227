import {MessageOrderSideType, OrderSideType} from '../types';
import {processOrderSide} from '../utils';

describe('utility functions tests', () => {
  it('should return correct new Order side', () => {
    const deltaOrderSides: MessageOrderSideType[] = [
      [1000, 50],
      [1005, 100],
      [1010, 1000],
    ];
    const currentOrderSides: OrderSideType[] = [];
    const expectedResult: OrderSideType[] = [
      [1000, 50, 50],
      [1005, 100, 150],
      [1010, 1000, 1150],
    ];
    const result = processOrderSide(currentOrderSides, deltaOrderSides);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should remove 0 size orders from current orders when delta price is 0', () => {
    const deltaOrderSides: MessageOrderSideType[] = [
      [1000, 50],
      [1005, 0],
      [1010, 1000],
    ];
    const currentOrderSides: OrderSideType[] = [
      [1000, 50, 50],
      [1005, 100, 150],
      [1010, 1000, 1150],
    ];
    const expectedResult: OrderSideType[] = [
      [1000, 50, 50],
      [1010, 1000, 1050],
    ];
    const result = processOrderSide(currentOrderSides, deltaOrderSides);
    expect(result).toStrictEqual(expectedResult);
  });

  it('larger set data test', () => {
    const deltaBids: MessageOrderSideType[] = [
      [50545.5, 18398.0],
      [50545.0, 7817.0],
      [50538.0, 500.0],
      [50533.0, 11461.0],
      [50531.0, 19999.0],
      [50528.0, 15433.0],
      [50525.0, 4001.0],
      [50520.5, 1993.0],
      [50520.0, 5000.0],
      [50519.5, 14049.0],
      [50518.5, 5947.0],
      [50516.5, 25883.0],
      [50512.5, 4000.0],
      [50512.0, 3600.0],
      [50511.0, 56803.0],
      [50510.5, 20000.0],
      [50508.0, 3441.0],
      [50507.0, 15500.0],
      [50506.0, 25960.0],
      [50505.5, 12500.0],
      [50502.0, 10100.0],
      [50500.0, 650.0],
      [50499.5, 4000.0],
      [50498.0, 45000.0],
      [50494.5, 199.0],
    ];
    const expectedResult = [
      [50494.5, 199, 199],
      [50498, 45000, 45199],
      [50499.5, 4000, 49199],
      [50500, 650, 49849],
      [50502, 10100, 59949],
      [50505.5, 12500, 72449],
      [50506, 25960, 98409],
      [50507, 15500, 113909],
      [50508, 3441, 117350],
      [50510.5, 20000, 137350],
      [50511, 56803, 194153],
      [50512, 3600, 197753],
      [50512.5, 4000, 201753],
      [50516.5, 25883, 227636],
      [50518.5, 5947, 233583],
      [50519.5, 14049, 247632],
      [50520, 5000, 252632],
      [50520.5, 1993, 254625],
      [50525, 4001, 258626],
      [50528, 15433, 274059],
      [50531, 19999, 294058],
      [50533, 11461, 305519],
      [50538, 500, 306019],
      [50545, 7817, 313836],
      [50545.5, 18398, 332234],
    ];
    const result = processOrderSide([], deltaBids);
    expect(result).toStrictEqual(expectedResult);
  });
});
