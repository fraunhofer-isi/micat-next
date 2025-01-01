// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import DataStructures from '../../../src/calculation/cost-benefit-analysis/data-structures';

describe('DataStructures', () => {
  it('prepareResultDataStructure', () => {
    const result = DataStructures.prepareResultDataStructure();
    expect(
      Array.isArray(result.costBenefitAnalysisFacility.newEnergySavings)
    ).toBeTruthy();
    expect(
      Array.isArray(result.costBenefitAnalysisFacility.newInvestments)
    ).toBeTruthy();
    expect(
      Array.isArray(result.netPresentValue.annuatisedEnergyCosts)
    ).toBeTruthy();
    expect(
      Array.isArray(result.netPresentValue.annuatisedMultipleImpacts)
    ).toBeTruthy();
    expect(Array.isArray(result.netPresentValue.netPresentValues)).toBeTruthy();
    expect(
      Array.isArray(result.costBenefitRatio.costBenefitRatios)
    ).toBeTruthy();
    expect(
      Array.isArray(result.costBenefitRatio.benefitCostRatios)
    ).toBeTruthy();
    expect(
      Array.isArray(result.levelisedCosts.levelisedCostsOfSavedEnergies)
    ).toBeTruthy();
    expect(
      Array.isArray(result.levelisedCosts.levelisedCostsOfSavedCo2)
    ).toBeTruthy();
    expect(
      Array.isArray(result.levelisedCosts.annuatisedCo2Emissions)
    ).toBeTruthy();
    expect(
      Array.isArray(result.marginalCostCurves.marginalEnergySavingsCostCurves)
    ).toBeTruthy();
    expect(
      Array.isArray(result.marginalCostCurves.marginalCo2SavingsCostCurves)
    ).toBeTruthy();
    expect(
      Array.isArray(result.fundingEfficiency.fundingEfficiencyOfEnergySavings)
    ).toBeTruthy();
    expect(
      Array.isArray(result.fundingEfficiency.fundingEfficiencyOfCo2Reductions)
    ).toBeTruthy();
  });
  it('prepareMeasureSpecificResultsDataStructure', () => {
    spyOn(
      DataStructures,
      '_prepareCalculationResultDataStructure'
    ).and.returnValue({ data: {} });
    const result = DataStructures.prepareMeasureSpecificResultsDataStructure(1);
    expect(
      result.costBenefitAnalysisFacility.newEnergySavings.data
    ).toBeDefined();
    expect(
      result.costBenefitAnalysisFacility.newInvestments.data
    ).toBeDefined();
    expect(result.netPresentValue.annuatisedEnergyCosts.data).toBeDefined();
    expect(result.netPresentValue.annuatisedMultipleImpacts.data).toBeDefined();
    expect(result.netPresentValue.netPresentValues.data).toBeDefined();
    expect(result.costBenefitRatio.costBenefitRatios.data).toBeDefined();
    expect(result.costBenefitRatio.benefitCostRatios.data).toBeDefined();
    expect(
      result.levelisedCosts.levelisedCostsOfSavedEnergies.data
    ).toBeDefined();
    expect(result.levelisedCosts.levelisedCostsOfSavedCo2.data).toBeDefined();
    expect(result.levelisedCosts.annuatisedCo2Emissions.data).toBeDefined();
    expect(
      result.marginalCostCurves.marginalEnergySavingsCostCurves.data
    ).toBeDefined();
    expect(
      result.marginalCostCurves.marginalCo2SavingsCostCurves.data
    ).toBeDefined();
    expect(
      result.fundingEfficiency.fundingEfficiencyOfEnergySavings.data
    ).toBeDefined();
    expect(
      result.fundingEfficiency.fundingEfficiencyOfCo2Reductions.data
    ).toBeDefined();
  });
  it('_prepareCalculationResultDataStructure', () => {
    const result = DataStructures._prepareCalculationResultDataStructure(1);
    expect(result.id_measure).toBe(1);
    expect(typeof result.data).toBe('object');
  });
  it('appendMeasureSpecificResults', () => {
    const mockedResultDataStructure =
      DataStructures.prepareResultDataStructure();
    const mockedMeasureSpecificResults = {
      costBenefitAnalysisFacility: {
        newEnergySavings: 1,
        newInvestments: 2
      },
      netPresentValue: {
        annuatisedEnergyCosts: 3,
        annuatisedMultipleImpacts: 4,
        netPresentValues: 5
      },
      costBenefitRatio: {
        costBenefitRatios: 6,
        benefitCostRatios: 7
      },
      levelisedCosts: {
        levelisedCostsOfSavedEnergies: 8,
        levelisedCostsOfSavedCo2: 9,
        annuatisedCo2Emissions: 10
      },
      marginalCostCurves: {
        marginalEnergySavingsCostCurves: 11,
        marginalCo2SavingsCostCurves: 12
      },
      fundingEfficiency: {
        fundingEfficiencyOfEnergySavings: 13,
        fundingEfficiencyOfCo2Reductions: 14
      }
    };
    DataStructures.appendMeasureSpecificResults(
      mockedMeasureSpecificResults,
      mockedResultDataStructure
    );
    expect(
      mockedResultDataStructure.costBenefitAnalysisFacility.newEnergySavings[0]
    ).toBe(1);
    expect(
      mockedResultDataStructure.costBenefitAnalysisFacility.newInvestments[0]
    ).toBe(2);
    expect(
      mockedResultDataStructure.netPresentValue.annuatisedEnergyCosts[0]
    ).toBe(3);
    expect(
      mockedResultDataStructure.netPresentValue.annuatisedMultipleImpacts[0]
    ).toBe(4);
    expect(mockedResultDataStructure.netPresentValue.netPresentValues[0]).toBe(
      5
    );
    expect(
      mockedResultDataStructure.costBenefitRatio.costBenefitRatios[0]
    ).toBe(6);
    expect(
      mockedResultDataStructure.costBenefitRatio.benefitCostRatios[0]
    ).toBe(7);
    expect(
      mockedResultDataStructure.levelisedCosts.levelisedCostsOfSavedEnergies[0]
    ).toBe(8);
    expect(
      mockedResultDataStructure.levelisedCosts.levelisedCostsOfSavedCo2[0]
    ).toBe(9);
    expect(
      mockedResultDataStructure.levelisedCosts.annuatisedCo2Emissions[0]
    ).toBe(10);
    expect(
      mockedResultDataStructure.marginalCostCurves
        .marginalEnergySavingsCostCurves[0]
    ).toBe(11);
    expect(
      mockedResultDataStructure.marginalCostCurves
        .marginalCo2SavingsCostCurves[0]
    ).toBe(12);
    expect(
      mockedResultDataStructure.fundingEfficiency
        .fundingEfficiencyOfEnergySavings[0]
    ).toBe(13);
    expect(
      mockedResultDataStructure.fundingEfficiency
        .fundingEfficiencyOfCo2Reductions[0]
    ).toBe(14);
  });
});
