// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Interpolation from '../../src/calculation/interpolation';
import ArrayTools from '../../src/calculation/array-tools';
import ObjectTools from '../../src/calculation/object-tools';

describe('Interpolation', () => {
  it('_linearInterpolateFilldeValues', () => {
    const mockedValues = [10, 0, 0, 13, 0, 0, 16];
    const result = Interpolation._linearInterpolateFilledValues(
      mockedValues,
      0
    );
    expect(result).toStrictEqual([10, 11, 12, 13, 14, 15, 16]);
  });
  const mockedAnnualData = {
    2010: 0,
    2015: 5,
    2020: 10
  };
  const mockedObjectWithAnnualData = {
    2010: 0,
    2015: 5,
    2020: 10,
    foo: 'bar'
  };
  describe('annualLinearInterpolation', () => {
    const mockedResultObject = {
      2010: 0,
      2011: 1,
      2012: 2,
      2013: 3,
      2014: 4,
      2015: 5,
      2016: 6,
      2017: 7,
      2018: 8,
      2019: 9,
      2020: 10
    };
    beforeAll(() => {
      const mockedYearRange = [
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020
      ];
      const mockedEmptyArray = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ];
      spyOn(ObjectTools, 'annualKeysAndValues').and.returnValue(
        mockedAnnualData
      );
      spyOn(ArrayTools, 'yearRange').and.returnValue(mockedYearRange);
      spyOn(ArrayTools, 'emptyArray').and.returnValue(mockedEmptyArray);
      spyOn(ArrayTools, 'zip').and.returnValue(mockedResultObject);
    });
    it('with only annual results', () => {
      const result = Interpolation.annualLinearInterpolation(
        mockedObjectWithAnnualData,
        true
      );
      expect(result).toStrictEqual(mockedResultObject);
    });
    it('with annual and data results as default value', () => {
      const result = Interpolation.annualLinearInterpolation(
        mockedObjectWithAnnualData
      );
      mockedResultObject.foo = 'bar';
      expect(result).toStrictEqual(mockedResultObject);
    });
  });
});
