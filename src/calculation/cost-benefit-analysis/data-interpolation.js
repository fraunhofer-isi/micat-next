// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Interpolation from '../interpolation';

export class SavingsInterpolation {
  static annualSavingsInterpolation(savingsData) {
    if (!savingsData) {
      return;
    }
    const interpolatedSavingsTable = structuredClone(savingsData);
    for (const measure of interpolatedSavingsTable.measures) {
      SavingsInterpolation._interpolateMeasureSavings(measure);
    }
    return interpolatedSavingsTable;
  }

  static _interpolateMeasureSavings(measure) {
    const interpolatedSavings = Interpolation.annualLinearInterpolation(
      measure.savings,
      true
    );
    measure.savings = interpolatedSavings;
  }
}

export class IndicatorInterpolation {
  static annualIndicatorInterpolation(indicatorData, indicatorName) {
    if (!indicatorData) {
      return;
    }
    const interpolatedIndicatorData = structuredClone(indicatorData);
    for (const measureData of interpolatedIndicatorData) {
      measureData[indicatorName] =
        IndicatorInterpolation._interpolateIndicator(
          measureData[indicatorName]
        );
    }
    return interpolatedIndicatorData;
  }

  static _interpolateIndicator(indicator) {
    const interpolatedIndicator = Interpolation.annualLinearInterpolation(
      indicator,
      true
    );
    return interpolatedIndicator;
  }
}
