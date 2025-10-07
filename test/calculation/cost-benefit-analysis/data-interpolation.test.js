// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  SavingsInterpolation,
  IndicatorInterpolation
} from '../../../src/calculation/cost-benefit-analysis/data-interpolation';
import Interpolation from '../../../src/calculation/interpolation';

let mockedSavingsTable;
let mockedInterpolatedMeasure2;
let mockedInterpolatedMeasure1;
let mockedIndicatorData;
let mockedIndicatorName;
let mockedInterpolatedIndicator1;
let mockedInterpolatedIndicator2;

describe('SavingsInterpolation', () => {
  beforeAll(() => {
    mockedSavingsTable = {
      measures: [
        {
          id: 1,
          savings: {
            2020: 1,
            2022: 3,
            2024: 5
          }
        },
        {
          id: 2,
          savings: {
            2020: 6,
            2022: 8,
            2024: 10
          }
        }
      ]
    };
    mockedInterpolatedMeasure1 = {
      id: 1,
      savings: {
        2020: 1,
        2021: 2,
        2022: 3,
        2023: 4,
        2024: 5
      }
    };
    mockedInterpolatedMeasure2 = {
      id: 2,
      savings: {
        2020: 6,
        2021: 7,
        2022: 8,
        2023: 9,
        2024: 10
      }
    };
  });
  describe('annualSavingsInterpolation', () => {
    it('without savings data', () => {
      const result = SavingsInterpolation.annualSavingsInterpolation();
      expect(result).toBeUndefined();
    });
    it('with savings data', () => {
      window.structuredClone = measures => measures;
      spyOn(
        SavingsInterpolation,
        '_interpolateMeasureSavings'
      ).and.returnValues(
        mockedInterpolatedMeasure1.savings,
        mockedInterpolatedMeasure2.savings
      );
      const result =
        SavingsInterpolation.annualSavingsInterpolation(mockedSavingsTable);
      expect(result.measures[0].savings['2020']).toBe(1);
      expect(result.measures[1].savings['2024']).toBe(10);
    });
  });
  it('_interpolateMeasureSavings', () => {
    spyOn(Interpolation, 'annualLinearInterpolation').and.returnValue(
      mockedInterpolatedMeasure1.savings
    );
    SavingsInterpolation._interpolateMeasureSavings(
      mockedSavingsTable.measures[0]
    );
    expect(mockedSavingsTable.measures[0]).toStrictEqual(
      mockedInterpolatedMeasure1
    );
  });
});

describe('IndicatorInterpolation', () => {
  beforeAll(() => {
    mockedIndicatorData = [
      {
        mockedIndicator1: {
          2020: 1,
          2022: 3,
          2024: 5
        }
      },
      {
        mockedIndicator2: {
          2020: 6,
          2022: 8,
          2024: 10
        }
      }
    ];
    mockedIndicatorName = 'mockedIndicator1';
    mockedInterpolatedIndicator1 = {
      2020: 1,
      2021: 2,
      2022: 3,
      2023: 4,
      2024: 5
    };
    mockedInterpolatedIndicator2 = {
      2020: 6,
      2021: 7,
      2022: 8,
      2023: 9,
      2024: 10
    };
  });
  describe('annualIndicatorInterpolation', () => {
    it('without indicator data', () => {
      const result = IndicatorInterpolation.annualIndicatorInterpolation();
      expect(result).toBeUndefined();
    });
    it('with indicator data', () => {
      window.structuredClone = indicators => indicators;
      spyOn(IndicatorInterpolation, '_interpolateIndicator').and.returnValues(
        mockedInterpolatedIndicator1,
        mockedInterpolatedIndicator2
      );
      const result = IndicatorInterpolation.annualIndicatorInterpolation(
        mockedIndicatorData,
        mockedIndicatorName
      );
      expect(result[0][mockedIndicatorName]).toStrictEqual(
        mockedInterpolatedIndicator1
      );
    });
  });
  it('_interpolateIndicator', () => {
    spyOn(Interpolation, 'annualLinearInterpolation').and.returnValue(
      mockedInterpolatedIndicator1
    );
    const result = IndicatorInterpolation._interpolateIndicator(
      mockedIndicatorData[0]
    );
    expect(result).toStrictEqual(mockedInterpolatedIndicator1);
  });
});
