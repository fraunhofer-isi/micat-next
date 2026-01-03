// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class NetPresentValue {
  static calculateNetPresentValue(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    userOptions
  ) {
    const annuatisedEnergyCost =
      NetPresentValue._calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
        userOptions.parameters.discountRate,
        measureSpecificParameters.lifetime,
        measureSpecificParameters.reductionOfEnergyCost,
        measureSpecificParameters.measure.savings,
        measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings
          .data[annualMeasureSpecificParameters.year],
        annualMeasureSpecificParameters.year,
        userOptions.parameters.energyPriceSensivity,
        userOptions.parameters.investmentsSensivity
      );
    measureSpecificResults.netPresentValue.annuatisedEnergyCosts.data[
      annualMeasureSpecificParameters.year
    ] = annuatisedEnergyCost;
    const monetisedAnnualReturnsOfMultipleImpacts =
      measureSpecificParameters.monetisedAnnualReturnsOfMultipleImpacts;
    const annuatisedMultipleImpact =
      NetPresentValue._calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
        userOptions.parameters.discountRate,
        measureSpecificParameters.lifetime,
        monetisedAnnualReturnsOfMultipleImpacts,
        measureSpecificParameters.measure.savings,
        measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings
          .data[annualMeasureSpecificParameters.year],
        annualMeasureSpecificParameters.year,
        userOptions.parameters.energyPriceSensivity,
        userOptions.parameters.investmentsSensivity
      );
    measureSpecificResults.netPresentValue.annuatisedMultipleImpacts.data[
      annualMeasureSpecificParameters.year
    ] = annuatisedMultipleImpact;
    const netPresentValue = NetPresentValue._calculateNetPresentValue(
      measureSpecificResults.costBenefitAnalysisFacility.newInvestments.data[
        annualMeasureSpecificParameters.year
      ],
      annuatisedEnergyCost,
      annuatisedMultipleImpact
    );
    measureSpecificResults.netPresentValue.netPresentValues.data[
      annualMeasureSpecificParameters.year
    ] = netPresentValue;
  }

  static _calculateNetPresentValue(
    newInvestment,
    annuatisedEnergyCosts,
    annuatisedMultipleImpacts
  ) {
    const netPresentValue =
      -newInvestment + annuatisedEnergyCosts + annuatisedMultipleImpacts;
    return netPresentValue;
  }

  static _calculateAnnuatisedEnergyCostsOrAnnuatisedMultipleImpacts(
    discountRate,
    lifetime,
    energyCostReductionsOrMonetisedAnnualReturnsOfMultipleImpacts,
    energySavings,
    newEnergySaving,
    currentYear,
    energyPriceSensivity,
    investmentsSensivity
  ) {
    let annuatisedEnergyCostsOrMultipleImpacts = 0;
    for (
      let runningLifetime = 0;
      runningLifetime < lifetime;
      runningLifetime++
    ) {
      const futureYear = Number.parseInt(currentYear) + runningLifetime;
      let totalEnergySaving;
      let energyCostReductionOrMonetisedAnnualReturn;
      const years = Object.keys(energySavings).sort();
      if (years.includes(futureYear.toString())) {
        totalEnergySaving = energySavings[futureYear];
        energyCostReductionOrMonetisedAnnualReturn =
          energyCostReductionsOrMonetisedAnnualReturnsOfMultipleImpacts[
            futureYear
          ];
      } else {
        const lastValidYear = years.at(-1);
        totalEnergySaving = energySavings[lastValidYear];
        energyCostReductionOrMonetisedAnnualReturn =
          energyCostReductionsOrMonetisedAnnualReturnsOfMultipleImpacts[
            lastValidYear
          ];
      }
      if (energyPriceSensivity) {
        energyCostReductionOrMonetisedAnnualReturn =
          energyCostReductionOrMonetisedAnnualReturn * energyPriceSensivity;
      }
      if (investmentsSensivity) {
        energyCostReductionOrMonetisedAnnualReturn =
          energyCostReductionOrMonetisedAnnualReturn * investmentsSensivity;
      }
      const divisor = Math.pow(1 + discountRate, runningLifetime);
      const annuatisedEnergyCost =
        (newEnergySaving / totalEnergySaving) *
        (energyCostReductionOrMonetisedAnnualReturn / divisor);
      annuatisedEnergyCostsOrMultipleImpacts += annuatisedEnergyCost;
    }
    return annuatisedEnergyCostsOrMultipleImpacts;
  }
}
