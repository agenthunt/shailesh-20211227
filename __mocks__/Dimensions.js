'use strict';
const Dimensions = {
  get: jest.fn().mockReturnValue({width: 100, height: 100}),
  addEventListener: jest.fn(),
};
module.exports = Dimensions;
