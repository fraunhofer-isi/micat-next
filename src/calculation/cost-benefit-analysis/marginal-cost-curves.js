// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class MarginalCostCurves {
  static calculateMarginalCostCurves(
    measureSpecificParameters,
    annualMeasureSpecificParameters,
    measureSpecificResults,
    _userOptions
  ) {
    const marginalEnergySavingsCostCurve = MarginalCostCurves._calculateMarginalEnergySavingsCostCurve(
      measureSpecificResults.levelisedCosts.levelisedCostsOfSavedEnergies.data[
        annualMeasureSpecificParameters.year
      ],
      measureSpecificResults.costBenefitAnalysisFacility.newEnergySavings.data[
        annualMeasureSpecificParameters.year
      ],
      measureSpecificParameters.lifetime
    );
    measureSpecificResults.marginalCostCurves.marginalEnergySavingsCostCurves.data[
      annualMeasureSpecificParameters.year
    ] = marginalEnergySavingsCostCurve;
    const marginalCo2SavingsCostCurve = MarginalCostCurves._calculateCo2SavingsCostCurve(
      measureSpecificResults.levelisedCosts.levelisedCostsOfSavedEnergies.data[
        annualMeasureSpecificParameters.year
      ],
      measureSpecificResults.levelisedCosts.annuatisedCo2Emissions.data[
        annualMeasureSpecificParameters.year
      ]
    );
    measureSpecificResults.marginalCostCurves.marginalCo2SavingsCostCurves.data[
      annualMeasureSpecificParameters.year
    ] = marginalCo2SavingsCostCurve;
  }

  static _calculateMarginalEnergySavingsCostCurve(
    levelisedCostsOfSavedEnergy,
    newEnergySaving,
    lifetime
  ) {
    const marginalEnergySavingsCostCurve = {
      barWidth: newEnergySaving * lifetime,
      barHeight: levelisedCostsOfSavedEnergy
    };
    return marginalEnergySavingsCostCurve;
  }

  static _calculateCo2SavingsCostCurve(
    levelisedCostsOfSavedEnergy,
    annuatisedCo2Emission
  ) {
    const co2SavingsCostCurve = {
      barWidth: annuatisedCo2Emission,
      barHeight: levelisedCostsOfSavedEnergy
    };
    return co2SavingsCostCurve;
  }
}
