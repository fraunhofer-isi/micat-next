// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import FundingEfficiency from '../../../src/calculation/cost-benefit-analysis/funding-efficiency';
import CalculationTestTools from './calculation-test-tools';

const mockedUserOptions = CalculationTestTools.mockedUserOptions();
const mockedMeasureSpecificParameters =
  CalculationTestTools.mockedMeasureSpecificParameters();
const mockedAnnualMeasureSpecificParameters =
  CalculationTestTools.mockedAnnualMeasureSpecificParameters();

describe('FundingEfficiency', () => {
  it('calculateFundingEfficiency', () => {
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    spyOn(
      FundingEfficiency,
      '_calculateFundingEfficiencyOfEnergySavings'
    ).and.returnValue(1);
    spyOn(
      FundingEfficiency,
      '_calculateFundingEfficiencyOfCo2Reductions'
    ).and.returnValue(2);
    FundingEfficiency.calculateFundingEfficiency(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(
      mockedMeasureSpecificResults.fundingEfficiency
        .fundingEfficiencyOfEnergySavings.data[
          mockedAnnualMeasureSpecificParameters.year
        ]
    ).toBe(1);
    expect(
      mockedMeasureSpecificResults.fundingEfficiency
        .fundingEfficiencyOfCo2Reductions.data[
          mockedAnnualMeasureSpecificParameters.year
        ]
    ).toBe(2);
  });
  it('_calculateFundingEfficiencyOfEnergySavings', () => {
    const mockedNewInvestment = 2;
    const result = FundingEfficiency._calculateFundingEfficiencyOfEnergySavings(
      mockedMeasureSpecificParameters.lifetime,
      mockedMeasureSpecificParameters.measure.savings[
        mockedAnnualMeasureSpecificParameters.year
      ],
      mockedNewInvestment,
      mockedMeasureSpecificParameters.subsidyRate[
        mockedAnnualMeasureSpecificParameters.year
      ]
    );
    expect(result).toBeCloseTo(4);
  });
  it('_calculateFundingEfficiencyOfCo2Reductions', () => {
    const mockedCo2Emission = 1;
    const mockedNewInvestment = 2;
    const result = FundingEfficiency._calculateFundingEfficiencyOfCo2Reductions(
      mockedCo2Emission,
      mockedNewInvestment,
      mockedMeasureSpecificParameters.subsidyRate[
        mockedAnnualMeasureSpecificParameters.year
      ]
    );
    expect(result).toBeCloseTo(0.1666);
  });
});
