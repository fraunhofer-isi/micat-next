// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import CostBenefitRatio from '../../../src/calculation/cost-benefit-analysis/cost-benefit-ratio';
import CalculationTestTools from './calculation-test-tools';

const mockedUserOptions = CalculationTestTools.mockedUserOptions();
const mockedMeasureSpecificParameters =
  CalculationTestTools.mockedMeasureSpecificParameters();
const mockedAnnualMeasureSpecificParameters =
  CalculationTestTools.mockedAnnualMeasureSpecificParameters();

describe('CostBenefitRatio', () => {
  it('calculateCostBenefitRatio', () => {
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    spyOn(CostBenefitRatio, '_calculateCostBenefitRatio').and.returnValue(2);
    CostBenefitRatio.calculateCostBenefitRatio(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(mockedMeasureSpecificResults.costBenefitRatio.costBenefitRatios.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(2);
    expect(mockedMeasureSpecificResults.costBenefitRatio.benefitCostRatios.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBeCloseTo(0.5);
  });
  it('_calculateCostBenefitRatio', () => {
    const result = CostBenefitRatio._calculateCostBenefitRatio(1, 2, 2);
    expect(result).toBeCloseTo(0.25);
  });
});
