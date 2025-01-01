// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import StringUtils from '../../src/utils/string-utils';

describe('main', () => {
  beforeEach(() => {});

  it('stringify ', () => {
    const object = { foo: 1, baa: undefined };
    spyOn(StringUtils, '_replaceUndefined').and.returnValue('mocked_result');
    const result = StringUtils.stringify(object);
    expect(result).toBe('"mocked_result"');
  });
  describe('isNumeric', () => {
    it('no string', () => {
      const result = StringUtils.isNumeric(1);
      expect(result).toBe(false);
    });
    it('numeric string', () => {
      const result = StringUtils.isNumeric('1');
      expect(result).toBe(true);
    });
  });
  describe('_replaceUndefined ', () => {
    it('undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = StringUtils._replaceUndefined(undefined);
      // eslint-disable-next-line unicorn/no-null
      expect(result).toBe(null);
    });

    it('not undefined', () => {
      const result = StringUtils._replaceUndefined('mocked_value');
      expect(result).toBe('mocked_value');
    });
  });
});
