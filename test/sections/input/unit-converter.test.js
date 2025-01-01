// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import UnitConverter from '../../../src/sections/input/unit-converter';

describe('UnitConverter', () => {
  it('units', () => {
    const result = UnitConverter.units();
    expect(result).toBeDefined();
  });

  it('convertAnnualValues', () => {
    const mockedAnnualValues = {
      2020: 10,
      2025: 20,
      parameters: {}
    };
    const mockedUnit = {
      factor: 2
    };
    window.structuredClone = data => mockedAnnualValues;
    const result = UnitConverter.convertAnnualValues(mockedAnnualValues, mockedUnit);
    expect(result).toBeDefined();
    expect(result['2020']).toStrictEqual(20);
    expect(result['2025']).toStrictEqual(40);
  });
});
