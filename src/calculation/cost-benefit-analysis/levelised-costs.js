// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class LevelisedCosts {
  static calculateLevelisedCosts(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    userOptions
  ) {
    const year = annualMeasureSpecificParameters.year;

    const levelisedCostsOfSavedEnergy = LevelisedCosts._calculateLevelisedCostsOfSavedEnergy(
      measureSpecificParameters.lifetime,
      measureSpecificResults.netPresentValue.netPresentValues.data[year],
      measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings.data[year]
    );
    measureSpecificResults.levelisedCosts.levelisedCostsOfSavedEnergies.data[year] = levelisedCostsOfSavedEnergy;

    const levelisedCostsOfSavedCo2Results = LevelisedCosts._calculateLevelisedCostsOfSavedCo2(
      measureSpecificParameters.lifetime,
      measureSpecificParameters.reductionOfAirPollution,
      measureSpecificResults.netPresentValue.netPresentValues.data[year],
      measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings.data[year],
      measureSpecificParameters.measure.savings,
      year,
      userOptions.parameters.energyPriceSensivity,
      userOptions.parameters.investmentsSensivity
    );
    const levelisedCostsOfSavedCo2 = levelisedCostsOfSavedCo2Results.levelisedCostsOfCo2Savings;
    const annuatisedCo2Emissions = levelisedCostsOfSavedCo2Results.annuatisedCo2Emissions;
    measureSpecificResults.levelisedCosts.levelisedCostsOfSavedCo2.data[year] = levelisedCostsOfSavedCo2;
    measureSpecificResults.levelisedCosts.annuatisedCo2Emissions.data[year] = annuatisedCo2Emissions;
  }

  static _calculateLevelisedCostsOfSavedEnergy(lifetime, netPresentValue, newEnergySaving) {
    const levelisedCostOfSavedEnergy = netPresentValue / (newEnergySaving * lifetime);
    return levelisedCostOfSavedEnergy;
  }

  static _calculateLevelisedCostsOfSavedCo2(
    lifetime,
    co2Savings,
    netPresentValue,
    newEnergySaving,
    energySavings,
    currentYear,
    energyPriceSensivity,
    investmentsSensivity
  ) {
    let annuatisedCo2Emissions = 0;
    for (let runningLifetime = 0; runningLifetime < lifetime; runningLifetime++) {
      const futureYear = Number.parseInt(currentYear) + runningLifetime;
      const years = Object.keys(energySavings).sort();
      let totalEnergySaving;
      let co2Saving;
      if (years.includes(futureYear.toString())) {
        totalEnergySaving = energySavings[futureYear];
        co2Saving = co2Savings[futureYear];
      } else {
        const lastValidYear = years.at(-1);
        totalEnergySaving = energySavings[lastValidYear];
        co2Saving = co2Savings[lastValidYear];
      }
      if(energyPriceSensivity) {
        co2Saving = co2Saving * energyPriceSensivity;
      }
      if(investmentsSensivity) {
        co2Saving = co2Saving * investmentsSensivity;
      }
      const annuatisedCo2Emission = newEnergySaving / totalEnergySaving * co2Saving;
      annuatisedCo2Emissions += annuatisedCo2Emission;
    }
    let levelisedCostsOfCo2Savings = 0;
    if(annuatisedCo2Emissions !== 0) {
      levelisedCostsOfCo2Savings = -netPresentValue / annuatisedCo2Emissions;
    }
    return {
      levelisedCostsOfCo2Savings,
      annuatisedCo2Emissions
    };
  }
}
