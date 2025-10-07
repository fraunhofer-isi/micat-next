// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class FundingEfficiency {
  static calculateFundingEfficiency(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    _userOptions
  ) {
    const year = annualMeasureSpecificParameters.year;
    const fundingEfficiencyOfEnergySavings =
      FundingEfficiency._calculateFundingEfficiencyOfEnergySavings(
        measureSpecificParameters.lifetime,
        measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings
          .data[year],
        measureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
          year
        ],
        measureSpecificParameters.subsidyRate[year]
      );
    measureSpecificResults.fundingEfficiency.fundingEfficiencyOfEnergySavings.data[
      year
    ] = fundingEfficiencyOfEnergySavings;

    const fundingEfficiencyOfCo2Reductions =
      FundingEfficiency._calculateFundingEfficiencyOfCo2Reductions(
        measureSpecificResults.levelisedCosts.levelisedCostsOfSavedCo2.data[
          year
        ],
        measureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
          year
        ],
        measureSpecificParameters.subsidyRate[year]
      );
    measureSpecificResults.fundingEfficiency.fundingEfficiencyOfCo2Reductions.data[
      year
    ] = fundingEfficiencyOfCo2Reductions;
  }

  static _calculateFundingEfficiencyOfEnergySavings(
    lifetime,
    newEnergySaving,
    newInvestment,
    subsidyRate
  ) {
    const fundingEfficiencyOfEnergySavings =
      (newEnergySaving * lifetime) / (subsidyRate * newInvestment);
    return fundingEfficiencyOfEnergySavings;
  }

  static _calculateFundingEfficiencyOfCo2Reductions(
    co2Emission,
    newInvestment,
    subsidyRate
  ) {
    const fundingEfficiencyOfCo2Reductions =
      co2Emission / (subsidyRate * newInvestment);
    return fundingEfficiencyOfCo2Reductions;
  }
}
