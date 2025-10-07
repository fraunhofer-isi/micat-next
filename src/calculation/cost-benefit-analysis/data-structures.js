// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class DataStructures {
  static prepareResultDataStructure() {
    const dataStructure = {
      supportingYears: [],
      costBenefitAnalysisFacility: {
        newEnergySavings: [],
        newInvestments: []
      },
      netPresentValue: {
        annuatisedEnergyCosts: [],
        annuatisedMultipleImpacts: [],
        netPresentValues: []
      },
      costBenefitRatio: {
        costBenefitRatios: [],
        benefitCostRatios: []
      },
      levelisedCosts: {
        levelisedCostsOfSavedEnergies: [],
        levelisedCostsOfSavedCo2: [],
        annuatisedCo2Emissions: []
      },
      marginalCostCurves: {
        marginalEnergySavingsCostCurves: [],
        marginalCo2SavingsCostCurves: []
      },
      fundingEfficiency: {
        fundingEfficiencyOfEnergySavings: [],
        fundingEfficiencyOfCo2Reductions: []
      }
    };
    return dataStructure;
  }

  static prepareMeasureSpecificResultsDataStructure(measureId) {
    const dataStructure = {
      costBenefitAnalysisFacility: {
        newEnergySavings:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        newInvestments:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      },
      netPresentValue: {
        annuatisedEnergyCosts:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        annuatisedMultipleImpacts:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        netPresentValues:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      },
      costBenefitRatio: {
        costBenefitRatios:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        benefitCostRatios:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      },
      levelisedCosts: {
        levelisedCostsOfSavedEnergies:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        levelisedCostsOfSavedCo2:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        annuatisedCo2Emissions:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      },
      marginalCostCurves: {
        marginalEnergySavingsCostCurves:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        marginalCo2SavingsCostCurves:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      },
      fundingEfficiency: {
        fundingEfficiencyOfEnergySavings:
          DataStructures._prepareCalculationResultDataStructure(measureId),
        fundingEfficiencyOfCo2Reductions:
          DataStructures._prepareCalculationResultDataStructure(measureId)
      }
    };
    return dataStructure;
  }

  static _prepareCalculationResultDataStructure(measureId) {
    const dataStructure = {
      id_measure: measureId,
      data: {}
    };
    return dataStructure;
  }

  static appendMeasureSpecificResults(measureSpecificResults, results) {
    results.costBenefitAnalysisFacility.newEnergySavings.push(
      measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings
    );
    results.costBenefitAnalysisFacility.newInvestments.push(
      measureSpecificResults.costBenefitAnalysisFacility.newInvestments
    );
    results.netPresentValue.annuatisedEnergyCosts.push(
      measureSpecificResults.netPresentValue.annuatisedEnergyCosts
    );
    results.netPresentValue.annuatisedMultipleImpacts.push(
      measureSpecificResults.netPresentValue.annuatisedMultipleImpacts
    );
    results.netPresentValue.netPresentValues.push(
      measureSpecificResults.netPresentValue.netPresentValues
    );
    results.costBenefitRatio.costBenefitRatios.push(
      measureSpecificResults.costBenefitRatio.costBenefitRatios
    );
    results.costBenefitRatio.benefitCostRatios.push(
      measureSpecificResults.costBenefitRatio.benefitCostRatios
    );
    results.levelisedCosts.levelisedCostsOfSavedEnergies.push(
      measureSpecificResults.levelisedCosts.levelisedCostsOfSavedEnergies
    );
    results.levelisedCosts.levelisedCostsOfSavedCo2.push(
      measureSpecificResults.levelisedCosts.levelisedCostsOfSavedCo2
    );
    results.levelisedCosts.annuatisedCo2Emissions.push(
      measureSpecificResults.levelisedCosts.annuatisedCo2Emissions
    );
    results.marginalCostCurves.marginalEnergySavingsCostCurves.push(
      measureSpecificResults.marginalCostCurves.marginalEnergySavingsCostCurves
    );
    results.marginalCostCurves.marginalCo2SavingsCostCurves.push(
      measureSpecificResults.marginalCostCurves.marginalCo2SavingsCostCurves
    );
    results.fundingEfficiency.fundingEfficiencyOfEnergySavings.push(
      measureSpecificResults.fundingEfficiency.fundingEfficiencyOfEnergySavings
    );
    results.fundingEfficiency.fundingEfficiencyOfCo2Reductions.push(
      measureSpecificResults.fundingEfficiency.fundingEfficiencyOfCo2Reductions
    );
  }
}
