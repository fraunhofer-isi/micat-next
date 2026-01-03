// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Parameters from '../../../src/calculation/cost-benefit-analysis/parameters';
import CostBenefitAnalysisTools from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis-tools';
import { IndicatorInterpolation } from '../../../src/calculation/cost-benefit-analysis/data-interpolation';
import ObjectTools from '../../../src/calculation/object-tools';

describe('Parameters', () => {
  it('measureSpecificParameters', () => {
    spyOn(Parameters, 'lifetimeForMeasure');
    spyOn(Parameters, 'annualValuesForMeasure');
    spyOn(Parameters, '_aggregateAndInterpolateParameters');
    spyOn(Parameters, '_checkIfSelectableIndicatorsArePresent');
    spyOn(Parameters, '_calculateMonetisedAnnualReturnsOfMultipleImpacts');
    spyOn(Parameters, '_checkIfParametersAreEmpty');
    const mockedMeasure = {
      id: 1
    };
    const mockedIndicatorData = {
      costBenefitAnalysisData: {
        lifetime: {
          2020: 1,
          2021: 1,
          2022: 1
        },
        subsidyRate: [1, 2],
        reductionOfEnergyCost: {}
      }
    };
    const result = Parameters.measureSpecificParameters(
      mockedMeasure,
      mockedIndicatorData
    );
    expect(result).toBeDefined();
  });
  describe('_checkIfParametersAreEmpty', () => {
    it('correct arguments', () => {
      spyOn(CostBenefitAnalysisTools, 'emptyParameters').and.returnValue(false);
      Parameters._checkIfParametersAreEmpty({});
    });
    it('empty arguments', () => {
      spyOn(CostBenefitAnalysisTools, 'emptyParameters').and.returnValue(true);
      expect(() => Parameters._checkIfParametersAreEmpty({})).toThrow(Error);
    });
  });
  it('annualMeasureSpecificParameters', () => {
    spyOn(Parameters, '_checkIfParametersAreEmpty');
    const mockedMeasure = {
      savings: {
        2020: 10
      }
    };
    const result = Parameters.annualMeasureSpecificParameters(
      2020,
      mockedMeasure
    );
    expect(result).toBeDefined();
  });
  it('aggregateAndInterpolateParameters', () => {
    spyOn(Parameters, '_aggregateAnnualValuesPerMeasure');
    spyOn(
      IndicatorInterpolation,
      'annualIndicatorInterpolation'
    ).and.returnValue('mockedInterpolatedValues');
    const result = Parameters._aggregateAndInterpolateParameters(
      'mockedAnnualData',
      'mockedAggregationName'
    );
    expect(result).toBe('mockedInterpolatedValues');
  });
  it('_aggregateAnnualValuesPerMeasure', () => {
    const mockedAnnualData = [
      {
        id_measure: 1,
        2020: 10,
        2025: 20
      },
      {
        id_measure: 1,
        2020: 30,
        2025: 40
      },
      {
        id_measure: 2,
        2020: 1,
        2025: 2
      }
    ];
    spyOn(ObjectTools, 'annualKeysAndValues').and.returnValues(
      { 2020: 10, 2025: 20 },
      { 2020: 30, 2025: 40 },
      { 2020: 1, 2025: 2 }
    );
    const result = Parameters._aggregateAnnualValuesPerMeasure(
      mockedAnnualData,
      'mockedAggregationName'
    );
    expect(result[0].mockedAggregationName[2020]).toBe(40);
    expect(result[0].mockedAggregationName[2025]).toBe(60);
    expect(result[1].mockedAggregationName[2020]).toBe(1);
    expect(result[1].mockedAggregationName[2025]).toBe(2);
  });
  it('yearsFromSavingsData', () => {
    const mockedSavingsData = {
      measures: [
        {
          savings: {
            2020: 10,
            2025: 20
          }
        }
      ]
    };
    const result = Parameters.yearsFromSavingsData(mockedSavingsData);
    expect(result).toStrictEqual(['2020', '2025']);
  });
  describe('lifetimeForMeasure', () => {
    const mockedLifetimeParameters = [
      {
        id_measure: 1,
        value: 1
      },
      {
        id_measure: 2,
        value: 2
      }
    ];
    it('lifetime parameter found', () => {
      const result = Parameters.lifetimeForMeasure(mockedLifetimeParameters, 2);
      expect(result).toBe(mockedLifetimeParameters[1].value);
    });
  });
  describe('annualValuesForMeasure', () => {
    const mockedAnnualValuesForMeasure = [
      {
        id_measure: 1,
        mockedParameterName: 1
      },
      {
        id_measure: 2,
        mockedParameterName: 2
      }
    ];
    it('annual values found', () => {
      const result = Parameters.annualValuesForMeasure(
        mockedAnnualValuesForMeasure,
        2,
        'mockedParameterName'
      );
      expect(result).toBe(2);
    });
    it('lifetime parameter not found', () => {
      const result = Parameters.annualValuesForMeasure(
        mockedAnnualValuesForMeasure,
        3
      );
      expect(result).toBeUndefined();
    });
  });
  describe('_calculateMonetisedAnnualReturnsOfMultipleImpacts', () => {
    const mockedMeasure = {
      savings: {
        2020: 10,
        2025: 20
      }
    };
    const mockedMonetisedMultipleImpacts = {
      indicator1: {
        2020: 1,
        2025: 1
      },
      indicator2: {
        2020: 1,
        2025: 1
      }
    };
    const mockedUserOptions = {
      indicators: {
        indicator1: true,
        indicator2: true
      }
    };
    it('all indicators are selected', () => {
      const result =
        Parameters._calculateMonetisedAnnualReturnsOfMultipleImpacts(
          mockedMeasure,
          mockedMonetisedMultipleImpacts,
          mockedUserOptions
        );
      expect(result).toStrictEqual({
        2020: 2,
        2025: 2
      });
    });
    it('only one indicator is selected', () => {
      mockedUserOptions.indicators.indicator1 = false;
      const result =
        Parameters._calculateMonetisedAnnualReturnsOfMultipleImpacts(
          mockedMeasure,
          mockedMonetisedMultipleImpacts,
          mockedUserOptions
        );
      expect(result).toStrictEqual({
        2020: 1,
        2025: 1
      });
    });
  });
  describe('_checkIfSelectableIndicatorsArePresent', () => {
    const mockedMeasureSpecificParameters = {
      indicator1: 'value1',
      indicator2: 'value2'
    };
    const mockedUserOptions = {
      indicators: {
        indicator1: true,
        indicator2: true
      }
    };
    it('all selectable indicators are present', () => {
      Parameters._checkIfSelectableIndicatorsArePresent(
        mockedMeasureSpecificParameters,
        mockedUserOptions
      );
    });
    it('not all selectable indicators are present', () => {
      delete mockedMeasureSpecificParameters.indicator1;
      const errornousFunction = () => {
        Parameters._checkIfSelectableIndicatorsArePresent(
          mockedMeasureSpecificParameters,
          mockedUserOptions
        );
      };
      expect(errornousFunction).toThrowError();
    });
  });
});
