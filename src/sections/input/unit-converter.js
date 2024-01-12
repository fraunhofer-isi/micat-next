// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class UnitConverter {
  static units() {
    return {
      ktoe: {
        name: 'kilotonne of oil equivalent',
        symbol: 'ktoe',
        factor: 1
      },
      MJ: {
        name: 'mega joule',
        symbol: 'MJ',
        factor: 2.388e-8
      },
      GJ: {
        name: 'giga joule',
        symbol: 'GJ',
        factor: 2.388e-5
      },
      MWh: {
        name: 'megawatt hour',
        symbol: 'MWh',
        factor: 8.598e-5
      }
    };
  }

  static convertAnnualValues(annualValues, unit) {
    const convertedAnnualValues = structuredClone(annualValues);
    for (const key of Object.keys(annualValues)) {
      if(Number.parseInt(key)) {
        convertedAnnualValues[key] = annualValues[key] * unit.factor;
      }
    }
    return convertedAnnualValues;
  }
}
