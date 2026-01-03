// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import CostBenefitAnalysisFacility from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis-facility';
import CalculationTestTools from './calculation-test-tools';

const mockedUserOptions = CalculationTestTools.mockedUserOptions();
const mockedMeasureSpecificParameters = CalculationTestTools.mockedMeasureSpecificParameters();
const mockedAnnualMeasureSpecificParameters = CalculationTestTools.mockedAnnualMeasureSpecificParameters();

describe('CostBenefitAnalysisFacility', () => {
  it('calculateCostBenefitAnalysisFacility', () => {
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    spyOn(CostBenefitAnalysisFacility, '_calculateNewEnergySaving').and.returnValue(1);
    spyOn(CostBenefitAnalysisFacility, '_calculateNewInvestment').and.returnValue(2);
    CostBenefitAnalysisFacility.calculateCostBenefitAnalysisFacility(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(mockedMeasureSpecificResults.costBenefitAnalysisFacility.newEnergySavings.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(1);
    expect(mockedMeasureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(2);
  });
  describe('_calculateNewInvestment', () => {
    it('with energy saving for previous year defined', () => {
      const result = CostBenefitAnalysisFacility._calculateNewInvestment(
        mockedAnnualMeasureSpecificParameters.year,
        mockedMeasureSpecificParameters.measure.savings
      );
      expect(result).toBe(1);
    });
    it('with energy saving for previous year not defined', () => {
      mockedAnnualMeasureSpecificParameters.year = 2020;
      const result = CostBenefitAnalysisFacility._calculateNewInvestment(
        mockedAnnualMeasureSpecificParameters.year,
        mockedMeasureSpecificParameters.measure.savings
      );
      mockedAnnualMeasureSpecificParameters.year = 2022;
      expect(result).toBe(6);
    });
  });
  it('_calculateNewEnergySaving', () => {
    const totalEnergySaving =
      mockedMeasureSpecificParameters.measure.savings[
        mockedAnnualMeasureSpecificParameters.year
      ];
    const newEnergySavings = {
      2020: 1,
      2021: 2
    };
    spyOn(CostBenefitAnalysisFacility, '_sumOfPriorTotalAnnualEnergySavings').and.returnValue(3);
    const result = CostBenefitAnalysisFacility._calculateNewEnergySaving(
      mockedAnnualMeasureSpecificParameters.year,
      totalEnergySaving,
      newEnergySavings,
      mockedMeasureSpecificParameters.lifetime
    );
    expect(result).toBe(5);
  });
  describe('_sumOfPriorTotalAnnualEnergySavings', () => {
    it('prior years are all defined', () => {
      const newEnergySavings = {
        2019: 1,
        2020: 2,
        2021: 3,
        2022: 4
      };
      const result = CostBenefitAnalysisFacility._sumOfPriorTotalAnnualEnergySavings(
        newEnergySavings,
        mockedMeasureSpecificParameters.lifetime,
        mockedAnnualMeasureSpecificParameters.year
      );
      expect(result).toBe(6);
    });
    it('prior years are not all defined', () => {
      const newEnergySavings = {
        2021: 3,
        2022: 4
      };
      const result = CostBenefitAnalysisFacility._sumOfPriorTotalAnnualEnergySavings(
        newEnergySavings,
        mockedMeasureSpecificParameters.lifetime,
        mockedAnnualMeasureSpecificParameters.year
      );
      expect(result).toBe(3);
    });
  });
});
