// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Mode from '../../src/calculation/mode';
import ColumnFactory from '../../src/sections/input/column-factory';

it('filterHeadersForMode', () => {
  const dataHeaders = ['Subsector', 'Importance', 2000, 2020, 2030];
  spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
  spyOn(Mode, 'minYear').and.returnValue(2010);
  spyOn(Mode, 'maxYear').and.returnValue(2030);
  const firstAnnualIndex = 2;
  const result = Mode.filterHeadersForMode(
    'mocked_idMode',
    dataHeaders,
    firstAnnualIndex,
  );
  expect(result).toStrictEqual(['Subsector', 'Importance', 2020, 2030]);
});

it('maxYear', () => {
  expect(Mode.maxYear(1)).toBe(2050);
  expect(Mode.maxYear(2)).toBe(2050);
  expect(Mode.maxYear(3)).toBe(2020);
  expect(Mode.maxYear(4)).toBe(2020);
  expect(() => Mode.maxYear(5)).toThrowError();
});

it('minYear', () => {
  expect(Mode.minYear(1)).toBe(2015);
  expect(Mode.minYear(2)).toBe(2015);
  expect(Mode.minYear(3)).toBe(2000);
  expect(Mode.minYear(4)).toBe(2000);
  expect(() => Mode.minYear(5)).toThrowError();
});