// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class ChartUtils {
  static prepareData(data) {
    const reductionOfLostWorkDaysMonetization =
      data.reductionOfLostWorkDaysMonetization;
    reductionOfLostWorkDaysMonetization.title =
      'Avoided lost working days due to air pollution';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    reductionOfLostWorkDaysMonetization.yLabel = 'Value in M€';
    reductionOfLostWorkDaysMonetization.unitFactor = 1e-6;

    const reductionOfGreenHouseGasEmissionMonetization =
      data.reductionOfGreenHouseGasEmissionMonetization;
    reductionOfGreenHouseGasEmissionMonetization.title =
      'Reduction of greenhouse gas emissions';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    reductionOfGreenHouseGasEmissionMonetization.yLabel = 'Value in M€';
    reductionOfGreenHouseGasEmissionMonetization.unitFactor = 1e-6;

    const reductionOfEnergyCost = data.reductionOfEnergyCost;
    reductionOfEnergyCost.title = 'Reduction of energy costs';
    reductionOfEnergyCost.yLabel = 'Savings in M€';
    reductionOfEnergyCost.unitFactor = 1e-6;

    const reductionOfMortalityMorbidityMonetization =
      data.reductionOfMortalityMorbidityMonetization;
    reductionOfMortalityMorbidityMonetization.title =
      'Premature deaths due to air pollution';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    reductionOfMortalityMorbidityMonetization.yLabel = 'Value in M€';
    reductionOfMortalityMorbidityMonetization.unitFactor = 1e-6;

    const impactOnTargetsMonetization =
      data.impactOnResTargetsMonetization;
    impactOnTargetsMonetization.title = 'Impact on RES targets';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    impactOnTargetsMonetization.yLabel = 'Value in M€';
    impactOnTargetsMonetization.unitFactor = 1e-6;

    const impactOnGrossDomesticProduct = data.impactOnGrossDomesticProduct;
    impactOnGrossDomesticProduct.title = 'Impact on gross domestic product';
    impactOnGrossDomesticProduct.yLabel = 'Added value in M€';
    impactOnGrossDomesticProduct.unitFactor = 1e-6;

    const addedAssetValueOfBuildings = data.addedAssetValueOfBuildings;
    addedAssetValueOfBuildings.title = 'Added asset value of buildings';
    addedAssetValueOfBuildings.yLabel = 'Value in M€'; // eslint-disable-line sonarjs/no-duplicate-string
    addedAssetValueOfBuildings.unitFactor = 1; // TO DO: check unit of calculation

    const reductionOfAdditionalCapacitiesInGridMonetization = data.reductionOfAdditionalCapacitiesInGridMonetization;
    reductionOfAdditionalCapacitiesInGridMonetization.title = 'Reduction of additional capacities';
    reductionOfAdditionalCapacitiesInGridMonetization.yLabel = 'Value in €';
    reductionOfAdditionalCapacitiesInGridMonetization.unitFactor = 1;

    return {
      reductionOfAdditionalCapacitiesInGridMonetization,
      reductionOfLostWorkDaysMonetization,
      reductionOfGreenHouseGasEmissionMonetization,
      reductionOfEnergyCost,
      reductionOfMortalityMorbidityMonetization,
      impactOnResTargetsMonetization: impactOnTargetsMonetization,
      impactOnGrossDomesticProduct,
      addedAssetValueOfBuildings
    };
  }
}
