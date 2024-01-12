// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ObjectTools from '../object-tools';
import { IndicatorInterpolation } from './data-interpolation';
import CostBenefitAnalysisTools from './cost-benefit-analysis-tools';

export default class Parameters {
  static measureSpecificParameters(measure, indicatorData, userOptions) {
    const lifetimeParameters = indicatorData.costBenefitAnalysisData.lifetime;
    const lifetime = Parameters.lifetimeForMeasure(
      lifetimeParameters,
      measure.id
    );

    let subsidyRate = indicatorData.costBenefitAnalysisData.subsidyRate[0];
    subsidyRate = ObjectTools.annualKeysAndValues(subsidyRate);

    const reductionOfEnergyCost = Parameters._aggregateAndInterpolateParameters(
      indicatorData.costBenefitAnalysisData.reductionOfEnergyCost,
      'reductionOfEnergyCost'
    );
    const reductionOfEnergyCostForMeasure = Parameters.annualValuesForMeasure(
      reductionOfEnergyCost,
      measure.id,
      'reductionOfEnergyCost'
    );

    const reductionOfMortalityMorbidityMonetization =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData
          .reductionOfMortalityMorbidityMonetization,
        'reductionOfMortalityMorbidityMonetization'
      );
    const reductionOfMortalityMorbidityMonetizationForMeasure =
      Parameters.annualValuesForMeasure(
        reductionOfMortalityMorbidityMonetization,
        measure.id,
        'reductionOfMortalityMorbidityMonetization'
      );

    const reductionOfLostWorkDaysMonetization =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData
          .reductionOfLostWorkDaysMonetization,
        'reductionOfLostWorkDaysMonetization'
      );
    const reductionOfLostWorkDaysMonetizationForMeasure =
      Parameters.annualValuesForMeasure(
        reductionOfLostWorkDaysMonetization,
        measure.id,
        'reductionOfLostWorkDaysMonetization'
      );

    const reductionOfGreenHouseGasEmissionMonetization =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData
          .reductionOfGreenHouseGasEmissionMonetization,
        'reductionOfGreenHouseGasEmissionMonetization'
      );
    const reductionOfGreenHouseGasEmissionMonetizationForMeasure =
      Parameters.annualValuesForMeasure(
        reductionOfGreenHouseGasEmissionMonetization,
        measure.id,
        'reductionOfGreenHouseGasEmissionMonetization'
      );

    // eslint-disable-next-line unicorn/prevent-abbreviations
    const impactOnResTargetsMonetization =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData.impactOnResTargetsMonetization,
        'impactOnResTargetsMonetization'
      );
    // eslint-disable-next-line unicorn/prevent-abbreviations
    const impactOnResTargetsMonetizationForMeasure =
      Parameters.annualValuesForMeasure(
        impactOnResTargetsMonetization,
        measure.id,
        'impactOnResTargetsMonetization'
      );

    const reductionOfAdditionalCapacitiesInGridMonetization =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData
          .reductionOfAdditionalCapacitiesInGridMonetization,
        'reductionOfAdditionalCapacitiesInGridMonetization'
      );
    const reductionOfAdditionalCapacitiesInGridMonetizationForMeasure =
      Parameters.annualValuesForMeasure(
        reductionOfAdditionalCapacitiesInGridMonetization,
        measure.id,
        'reductionOfAdditionalCapacitiesInGridMonetization'
      );

    const reductionOfAirPollution =
      Parameters._aggregateAndInterpolateParameters(
        indicatorData.costBenefitAnalysisData.reductionOfAirPollution,
        'reductionOfAirPollution'
      );
    const reductionOfAirPollutionForMeasure = Parameters.annualValuesForMeasure(
      reductionOfAirPollution,
      measure.id,
      'reductionOfAirPollution'
    );

    const monetisedMultipleImpacts = {
      reductionOfEnergyCost: reductionOfEnergyCostForMeasure,
      reductionOfMortalityMorbidityMonetization:
        reductionOfMortalityMorbidityMonetizationForMeasure,
      reductionOfLostWorkDaysMonetization:
        reductionOfLostWorkDaysMonetizationForMeasure,
      reductionOfGreenHouseGasEmissionMonetization:
        reductionOfGreenHouseGasEmissionMonetizationForMeasure,
      impactOnResTargetsMonetization: impactOnResTargetsMonetizationForMeasure,
      reductionOfAdditionalCapacitiesInGridMonetization:
        reductionOfAdditionalCapacitiesInGridMonetizationForMeasure,
      reductionOfAirPollution: reductionOfAirPollutionForMeasure
    };
    Parameters._checkIfParametersAreEmpty(monetisedMultipleImpacts);
    Parameters._checkIfSelectableIndicatorsArePresent(
      monetisedMultipleImpacts,
      userOptions
    );
    const monetisedAnnualReturnsOfMultipleImpacts =
      Parameters._calculateMonetisedAnnualReturnsOfMultipleImpacts(
        measure,
        monetisedMultipleImpacts,
        userOptions
      );

    const measureSpecificParameters = {
      measure,
      lifetime,
      subsidyRate,
      reductionOfEnergyCost: reductionOfEnergyCostForMeasure,
      reductionOfAirPollution: reductionOfAirPollutionForMeasure,
      monetisedAnnualReturnsOfMultipleImpacts
    };
    Parameters._checkIfParametersAreEmpty(measureSpecificParameters);
    return measureSpecificParameters;
  }

  static _checkIfParametersAreEmpty(parameters) {
    if (CostBenefitAnalysisTools.emptyParameters(parameters)) {
      throw new Error(
        'Warning! Some of the parameters needed for cost-benefit analysis are empty. Please check:' +
          parameters
      );
    }
  }

  static annualMeasureSpecificParameters(year, measure) {
    const energySaving = measure.savings[year];
    const annualMeasureSpecificParameters = {
      year,
      energySaving
    };
    const parametersToCheck = [year, energySaving];
    Parameters._checkIfParametersAreEmpty(parametersToCheck);
    return annualMeasureSpecificParameters;
  }

  static _aggregateAndInterpolateParameters(annualData, aggregationName) {
    const aggregatedAnnualValues = Parameters._aggregateAnnualValuesPerMeasure(
      annualData,
      aggregationName
    );
    const interpolatedAnnualValues =
      IndicatorInterpolation.annualIndicatorInterpolation(
        aggregatedAnnualValues,
        aggregationName
      );
    return interpolatedAnnualValues;
  }

  static _aggregateAnnualValuesPerMeasure(annualData, aggregationName) {
    const aggregatedAnnualData = [];
    const measureIds = new Set(annualData.map(row => row.id_measure));
    for (const measureId of measureIds) {
      let dataForMeasure = annualData.filter(
        row => row.id_measure === measureId
      );
      dataForMeasure = dataForMeasure.map(row =>
        ObjectTools.annualKeysAndValues(row)
      );
      const annualAggregations = {};
      for (const year of Object.keys(dataForMeasure[0])) {
        let sum = 0;
        for (const values of dataForMeasure) {
          sum += values[year];
        }
        annualAggregations[year] = sum;
      }
      aggregatedAnnualData.push({
        id_measure: measureId,
        [aggregationName]: annualAggregations
      });
    }
    return aggregatedAnnualData;
  }

  static yearsFromSavingsData(savingsData) {
    const years = Object.keys(savingsData.measures[0].savings);
    return years;
  }

  static lifetimeForMeasure(lifetimeParameters, idMeasure) {
    const lifetime = lifetimeParameters.find(lifetime => {
      return lifetime.id_measure === idMeasure;
    });
    return lifetime.value;
  }

  static annualValuesForMeasure(
    annualValuesPerMeasure,
    idMeasure,
    parameterName
  ) {
    let annualValues;
    const filteredParameter = annualValuesPerMeasure.find(annualParameters => {
      return annualParameters.id_measure === idMeasure;
    });
    if (filteredParameter) {
      annualValues = filteredParameter[parameterName];
    }
    return annualValues;
  }

  static _calculateMonetisedAnnualReturnsOfMultipleImpacts(
    measure,
    monetisedMultipleImpacts,
    userOptions
  ) {
    const monetisedAnnualReturnsOfMultipleImpacts = {};
    const energySavings = measure.savings;
    const years = Object.keys(energySavings).sort();
    for (const year of years) {
      let annualSum = 0;
      for (const indicatorName of Object.keys(userOptions.indicators)) {
        if (userOptions.indicators[indicatorName]) {
          annualSum += monetisedMultipleImpacts[indicatorName][year];
        }
      }
      monetisedAnnualReturnsOfMultipleImpacts[year] = annualSum;
    }
    return monetisedAnnualReturnsOfMultipleImpacts;
  }

  static _checkIfSelectableIndicatorsArePresent(measureSpecificParameters, userOptions) {
    const indicatorNamesUserOptions = Object.keys(userOptions.indicators);
    const hasAllKeys = ObjectTools.hasAllKeys(
      indicatorNamesUserOptions,
      measureSpecificParameters
    );
    if (!hasAllKeys) {
      throw new Error(
        'The selectable indicators of the cost-benefit-analysis do not correspond to the monetized indicators.'
      );
    }
  }
}
