// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ObjectTools from '../../src/calculation/object-tools';
describe('ObjectTools', () => {
  const mockedObjectWithAnnualData = {
    2010: 0,
    2015: 5,
    2020: 10,
    foo: 'bar'
  };
  const mockedAnnualData = {
    2010: 0,
    2015: 5,
    2020: 10
  };
  it('annualKeysAndValues', () => {
    const result = ObjectTools.annualKeysAndValues(mockedObjectWithAnnualData);
    expect(result).toStrictEqual(mockedAnnualData);
  });
  it('zipKeysAndValues', () => {
    const mockedObject = {
      foo: 'bar',
      bar: 'baz'
    };
    const result = ObjectTools.zipKeysAndValues(mockedObject);
    expect(result).toStrictEqual([
      ['foo', 'bar'],
      ['bar', 'baz']
    ]);
  });
});
