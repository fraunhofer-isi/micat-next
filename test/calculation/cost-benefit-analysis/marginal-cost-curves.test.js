// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import MarginalCostCurves from '../../../src/calculation/cost-benefit-analysis/marginal-cost-curves';
import CalculationTestTools from './calculation-test-tools';
describe('MarginalCostCurves', () => {
  it('calculateMarginalCostCurves', () => {
    const mockedMeasureSpecificParameters =
      CalculationTestTools.mockedMeasureSpecificParameters();
    const mockedAnnualMeasureSpecificParameters =
      CalculationTestTools.mockedAnnualMeasureSpecificParameters();
    const mockedMeasureSpecificResults =
      CalculationTestTools.measureSpecificResultsDataStructure(1);
    const mockedUserOptions = {};
    spyOn(MarginalCostCurves, '_calculateMarginalEnergySavingsCostCurve').and.returnValue(1);
    spyOn(MarginalCostCurves, '_calculateCo2SavingsCostCurve').and.returnValue(2);
    MarginalCostCurves.calculateMarginalCostCurves(
      mockedMeasureSpecificParameters,
      mockedAnnualMeasureSpecificParameters,
      mockedMeasureSpecificResults,
      mockedUserOptions
    );
    expect(mockedMeasureSpecificResults.marginalCostCurves.marginalEnergySavingsCostCurves.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(1);
    expect(mockedMeasureSpecificResults.marginalCostCurves.marginalCo2SavingsCostCurves.data[
      mockedAnnualMeasureSpecificParameters.year
    ]).toBe(2);
  });
  it('_calculateMarginalEnergySavingsCostCurve', () => {
    const mockedLevelisedCostsOfSavedEnergy = 20;
    const mockedNewEnergySaving = 10;
    const mockedCurrentLifetime = 10;
    const result = MarginalCostCurves._calculateMarginalEnergySavingsCostCurve(
      mockedLevelisedCostsOfSavedEnergy,
      mockedNewEnergySaving,
      mockedCurrentLifetime
    );
    expect(result.barWidth).toStrictEqual(100);
    expect(result.barHeight).toStrictEqual(20);
  });
  it('_calculateCo2SavingsCostCurve', () => {
    const mockedLevelisedCostsOfSavedEnergy = 10;
    const mockedAnnuatisedCo2Emission = 20;
    const result = MarginalCostCurves._calculateCo2SavingsCostCurve(
      mockedLevelisedCostsOfSavedEnergy,
      mockedAnnuatisedCo2Emission
    );
    expect(result.barWidth).toStrictEqual(20);
    expect(result.barHeight).toStrictEqual(10);
  });
});
