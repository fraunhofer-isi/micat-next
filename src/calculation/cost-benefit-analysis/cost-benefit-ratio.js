// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class CostBenefitRatio {
  static calculateCostBenefitRatio(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    _userOptions
  ) {
    const costBenefitRatio = CostBenefitRatio._calculateCostBenefitRatio(
      measureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
        annualMeasureSpecificParameters.year
      ],
      measureSpecificResults.netPresentValue.annuatisedEnergyCosts.data[
        annualMeasureSpecificParameters.year
      ],
      measureSpecificResults.netPresentValue.annuatisedMultipleImpacts.data[
        annualMeasureSpecificParameters.year
      ]
    );
    measureSpecificResults.costBenefitRatio.costBenefitRatios.data[
      annualMeasureSpecificParameters.year
    ] = costBenefitRatio;
    const benefitCostRatio = 1 / costBenefitRatio;
    measureSpecificResults.costBenefitRatio.benefitCostRatios.data[
      annualMeasureSpecificParameters.year
    ] = benefitCostRatio;
  }

  static _calculateCostBenefitRatio(
    newInvestment,
    annuatisedEnergyCost,
    annuatisedMultipleImpact
  ) {
    const costBenefitRatio =
      newInvestment / (annuatisedEnergyCost + annuatisedMultipleImpact);
    return costBenefitRatio;
  }
}
