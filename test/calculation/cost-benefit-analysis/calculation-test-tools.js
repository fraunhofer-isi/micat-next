// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class CalculationTestTools {
  static measureSpecificResultsDataStructure(measureId) {
    const dataStructure = {
      costBenefitAnalysisFacility: {
        newEnergySavings:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        newInvestments:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      },
      netPresentValue: {
        annuatisedEnergyCosts:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        annuatisedMultipleImpacts:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        netPresentValues:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      },
      costBenefitRatio: {
        costBenefitRatios:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        benefitCostRatios:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      },
      levelisedCosts: {
        levelisedCostsOfSavedEnergies:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        levelisedCostsOfSavedCo2:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        annuatisedCo2Emissions:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      },
      marginalCostCurves: {
        marginalEnergySavingsCostCurves:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        marginalCo2SavingsCostCurves:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      },
      fundingEfficiency: {
        fundingEfficiencyOfEnergySavings:
          CalculationTestTools._prepareCalculationResultDataStructure(
            measureId
          ),
        fundingEfficiencyOfCo2Reductions:
          CalculationTestTools._prepareCalculationResultDataStructure(measureId)
      }
    };
    return dataStructure;
  }

  static _prepareCalculationResultDataStructure(measureId) {
    const dataStructure = {
      id_measure: measureId,
      data: {
        2020: {},
        2021: {},
        2022: {}
      }
    };
    return dataStructure;
  }

  static mockedUserOptions() {
    const mockedUserOptions = {
      parameters: {
        discountRate: 1
      }
    };
    return mockedUserOptions;
  }

  static mockedMeasureSpecificParameters() {
    const mockedMeasureSpecificParameters = {
      lifetime: 3,
      subsidyRate: {
        2020: 3,
        2021: 3,
        2022: 3
      },
      reductionOfEnergyCost: {
        2020: 1,
        2021: 2,
        2022: 3
      },
      measure: {
        measure_id: 1,
        savings: {
          2020: 6,
          2021: 7,
          2022: 8
        }
      }
    };
    return mockedMeasureSpecificParameters;
  }

  static mockedAnnualMeasureSpecificParameters() {
    const mockedAnnualMeasureSpecificParameters = {
      year: 2022
    };
    return mockedAnnualMeasureSpecificParameters;
  }
}
