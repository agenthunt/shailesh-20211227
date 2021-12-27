'use strict';
const Platform = {
  get: jest.fn().mockReturnValue({OS: 'web'}),
};
module.exports = Platform;
