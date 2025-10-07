// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ArrayTools from '../../src/calculation/array-tools';

describe('ArrayTools', () => {
  it('emptyArray', () => {
    const result = ArrayTools.emptyArray(2, 0);
    expect(result.length === 2);
    expect(result[0] === 0);
  });

  it('yearRange', () => {
    const result = ArrayTools.yearRange(2010, 2020);
    expect(result.length === 10);
  });

  describe('numberOfYears', () => {
    it('numberOfYears befor 2010', () => {
      const result = ArrayTools.numberOfYears(2010, 10, false);
      expect(result.length).toBe(10);
      expect(result[0]).toBe(2001);
    });
    it('numberOfYears after 2010 and using default value of forward=true', () => {
      const result = ArrayTools.numberOfYears(2010, 10);
      expect(result.length).toBe(10);
      expect(result[result.length - 1]).toBe(2019);
    });
  });

  describe('padArrayToLength', () => {
    it('new length is smaller than existing length and using default value of forward=true', () => {
      const mockedArray = [1, 2];
      const result = ArrayTools.padArrayToLength(mockedArray, 1, 0);
      expect(result).toBe(mockedArray);
    });
    it('new length is greater than existing length and values are padded to the end', () => {
      const mockedArray = [1, 2];
      spyOn(ArrayTools, 'emptyArray').and.returnValue([0, 0, 0]);
      const result = ArrayTools.padArrayToLength(mockedArray, 3, 0, true);
      expect(result).toStrictEqual([1, 2, 0]);
    });
    it('new length is greater than existing length and values are padded to the beginning', () => {
      const mockedArray = [1, 2];
      spyOn(ArrayTools, 'emptyArray').and.returnValue([0, 0, 0]);
      const result = ArrayTools.padArrayToLength(mockedArray, 3, 0, false);
      expect(result).toStrictEqual([0, 1, 2]);
    });
  });

  it('zip', () => {
    const result = ArrayTools.zip(['key1', 'key2'], [1, 2]);
    expect(result).toStrictEqual({
      key1: 1,
      key2: 2
    });
  });
});
