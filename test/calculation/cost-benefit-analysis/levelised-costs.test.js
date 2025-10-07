// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import LevelisedCosts from '../../../src/calculation/cost-benefit-analysis/levelised-costs';
import CalculationTestTools from './calculation-test-tools';

const mockedUserOptions = CalculationTestTools.mockedUserOptions();
const mockedMeasureSpecificParameters =
  CalculationTestTools.mockedMeasureSpecificParameters();
const mockedAnnualMeasureSpecificParameters =
  CalculationTestTools.mockedAnnualMeasureSpecificParameters();

describe('LevelisedCosts', () => {
  it('calculateLevelisedCosts', () => {
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    spyOn(
      LevelisedCosts,
      '_calculateLevelisedCostsOfSavedEnergy'
    ).and.returnValue(1);
    spyOn(LevelisedCosts, '_calculateLevelisedCostsOfSavedCo2').and.returnValue(
      {
        levelisedCostsOfCo2Savings: 2,
        annuatisedCo2Emissions: 3
      }
    );
    LevelisedCosts.calculateLevelisedCosts(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(
      mockedMeasureSpecificResults.levelisedCosts.levelisedCostsOfSavedEnergies
        .data[mockedAnnualMeasureSpecificParameters.year]
    ).toBe(1);
    expect(
      mockedMeasureSpecificResults.levelisedCosts.levelisedCostsOfSavedCo2.data[
        mockedAnnualMeasureSpecificParameters.year
      ]
    ).toBe(2);
    expect(
      mockedMeasureSpecificResults.levelisedCosts.annuatisedCo2Emissions.data[
        mockedAnnualMeasureSpecificParameters.year
      ]
    ).toBe(3);
  });
  it('_calculateLevelisedCostsOfSavedEnergy', () => {
    const result = LevelisedCosts._calculateLevelisedCostsOfSavedEnergy(
      mockedMeasureSpecificParameters.lifetime,
      2,
      3
    );
    expect(result).toBeCloseTo(0.2222);
  });
  describe('_calculateLevelisedCostsOfSavedCo2', () => {
    const mockedCo2Savings = {
      2020: 1,
      2021: 2,
      2022: 3
    };
    const mockedNetPresentValue = 2;
    const mockedNewEnergySaving = 1;
    it('data for future years is not included without energy price sensivity and investments sensivity', () => {
      const result = LevelisedCosts._calculateLevelisedCostsOfSavedCo2(
        mockedMeasureSpecificParameters.lifetime,
        mockedCo2Savings,
        mockedNetPresentValue,
        mockedNewEnergySaving,
        mockedMeasureSpecificParameters.measure.savings,
        mockedAnnualMeasureSpecificParameters.year
      );
      expect(result.levelisedCostsOfCo2Savings).toBeCloseTo(-1.7777);
      expect(result.annuatisedCo2Emissions).toBeCloseTo(1.125);
    });
    it('data for future years is not included with energy price sensivity and investments sensivity', () => {
      const result = LevelisedCosts._calculateLevelisedCostsOfSavedCo2(
        mockedMeasureSpecificParameters.lifetime,
        mockedCo2Savings,
        mockedNetPresentValue,
        mockedNewEnergySaving,
        mockedMeasureSpecificParameters.measure.savings,
        mockedAnnualMeasureSpecificParameters.year,
        2,
        2
      );
      expect(result.levelisedCostsOfCo2Savings).toBeCloseTo(-0.4444);
      expect(result.annuatisedCo2Emissions).toBeCloseTo(4.5);
    });
    it('data for future years is included with energy price sensivity and investments sensivity', () => {
      mockedAnnualMeasureSpecificParameters.year = 2020;
      const result = LevelisedCosts._calculateLevelisedCostsOfSavedCo2(
        mockedMeasureSpecificParameters.lifetime,
        mockedCo2Savings,
        mockedNetPresentValue,
        mockedNewEnergySaving,
        mockedMeasureSpecificParameters.measure.savings,
        mockedAnnualMeasureSpecificParameters.year,
        1,
        1
      );
      expect(result.levelisedCostsOfCo2Savings).toBeCloseTo(-2.4175);
      expect(result.annuatisedCo2Emissions).toBeCloseTo(0.8273);
    });
    it('Co2 saving is 0', () => {
      const mockedCo2Savings = {
        2020: 0,
        2021: 0,
        2022: 0
      };
      mockedAnnualMeasureSpecificParameters.year = 2020;
      const result = LevelisedCosts._calculateLevelisedCostsOfSavedCo2(
        mockedMeasureSpecificParameters.lifetime,
        mockedCo2Savings,
        mockedNetPresentValue,
        mockedNewEnergySaving,
        mockedMeasureSpecificParameters.measure.savings,
        mockedAnnualMeasureSpecificParameters.year,
        1,
        1
      );
      expect(result.levelisedCostsOfCo2Savings).toBe(0);
      expect(result.annuatisedCo2Emissions).toBe(0);
    });
  });
});
