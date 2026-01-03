// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class CostBenefitAnalysisFacility {
  static calculateCostBenefitAnalysisFacility(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    _userOptions
  ) {
    const totalEnergySavingsYear =
      measureSpecificParameters.measure.savings[
        annualMeasureSpecificParameters.year
      ];
    const newEnergySaving =
      CostBenefitAnalysisFacility._calculateNewEnergySaving(
        annualMeasureSpecificParameters.year,
        totalEnergySavingsYear,
        measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings
          .data,
        measureSpecificParameters.lifetime
      );
    measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings.data[
      annualMeasureSpecificParameters.year
    ] = newEnergySaving;

    const newInvestment = CostBenefitAnalysisFacility._calculateNewInvestment(
      annualMeasureSpecificParameters.year,
      measureSpecificParameters.measure.savings
    );
    measureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
      annualMeasureSpecificParameters.year
    ] = newInvestment;
  }

  static _calculateNewInvestment(year, savings) {
    const totalEnergySavingYear = savings[year];
    const totalEnergySavingsPreviousYear = savings[year - 1] || 0;
    const newInvestment =
      totalEnergySavingYear - totalEnergySavingsPreviousYear;
    return newInvestment;
  }

  static _calculateNewEnergySaving(
    year,
    totalEnergySavingsYear,
    newEnergySavings,
    lifetime
  ) {
    const sumOfPriorTotalAnnualEnergySavings =
      CostBenefitAnalysisFacility._sumOfPriorTotalAnnualEnergySavings(
        newEnergySavings,
        lifetime,
        year
      );
    const newEnergySaving = +(
      totalEnergySavingsYear - sumOfPriorTotalAnnualEnergySavings
    ).toFixed(2);
    return newEnergySaving;
  }

  static _sumOfPriorTotalAnnualEnergySavings(newEnergySavings, lifetime, year) {
    let sum = 0;
    for (let runningLifetime = 1; runningLifetime < lifetime + 1; runningLifetime++) {
      const priorYear = year - runningLifetime;
      const priorEnergySaving = newEnergySavings[priorYear] || 0;
      sum += priorEnergySaving;
    }
    return sum;
  }
}
