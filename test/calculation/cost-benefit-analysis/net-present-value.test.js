// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import NetPresentValue from '../../../src/calculation/cost-benefit-analysis/net-present-value';
import CalculationTestTools from './calculation-test-tools';

const mockedUserOptions = CalculationTestTools.mockedUserOptions();
const mockedMeasureSpecificParameters = CalculationTestTools.mockedMeasureSpecificParameters();
const mockedAnnualMeasureSpecificParameters = CalculationTestTools.mockedAnnualMeasureSpecificParameters();

describe('NetPresentValue', () => {
  it('calculateNetPresentValue', () => {
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    spyOn(
      NetPresentValue,
      '_calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts'
    ).and.returnValues(1, 2);
    spyOn(NetPresentValue, '_calculateNetPresentValue').and.returnValue(3);
    NetPresentValue.calculateNetPresentValue(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(mockedMeasureSpecificResults.netPresentValue.annuatisedEnergyCosts.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(1);
    expect(mockedMeasureSpecificResults.netPresentValue.annuatisedMultipleImpacts.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(2);
    expect(mockedMeasureSpecificResults.netPresentValue.netPresentValues.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(3);
  });
  it('calculateNetPresentValue', () => {
    const result = NetPresentValue._calculateNetPresentValue(1, 1, 1);
    expect(result).toBe(1);
  });

  describe('calculateAnnuatisedEnergyCostsOrMultipleImpacts', () => {
    it('future years are not defined without energy price sensivity and investments sensivity', () => {
      const result =
        NetPresentValue._calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
          mockedUserOptions.parameters.discountRate,
          mockedMeasureSpecificParameters.lifetime,
          mockedMeasureSpecificParameters.reductionOfEnergyCost,
          mockedMeasureSpecificParameters.measure.savings,
          1,
          mockedAnnualMeasureSpecificParameters.year
        );
      expect(result).toBeCloseTo(0.656_25);
    });
    it('future years are not defined with energy price sensivity and investments sensivity', () => {
      const result =
        NetPresentValue._calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
          mockedUserOptions.parameters.discountRate,
          mockedMeasureSpecificParameters.lifetime,
          mockedMeasureSpecificParameters.reductionOfEnergyCost,
          mockedMeasureSpecificParameters.measure.savings,
          1,
          mockedAnnualMeasureSpecificParameters.year,
          2,
          2
        );
      expect(result).toBeCloseTo(2.625);
    });
    it('future years are defined with energy price sensivity and investments sensivity', () => {
      mockedMeasureSpecificParameters.reductionOfEnergyCost[2023] = 4;
      mockedMeasureSpecificParameters.reductionOfEnergyCost[2024] = 5;
      mockedMeasureSpecificParameters.measure.savings[2023] = 9;
      mockedMeasureSpecificParameters.measure.savings[2024] = 10;
      const result =
        NetPresentValue._calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
          mockedUserOptions.parameters.discountRate,
          mockedMeasureSpecificParameters.lifetime,
          mockedMeasureSpecificParameters.reductionOfEnergyCost,
          mockedMeasureSpecificParameters.measure.savings,
          1,
          mockedAnnualMeasureSpecificParameters.year,
          1,
          1
        );
      expect(result).toBeCloseTo(0.722_22);
    });
  });
});
