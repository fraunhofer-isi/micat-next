// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ArrayTools from './array-tools';
import ObjectTools from './object-tools';

export default class Interpolation {
  static _linearInterpolateFilledValues(values, fillValue) {
    let index = 0;
    values.push(0);
    values.unshift(0);
    for (const element of values) {
      if (element === fillValue) {
        let previousIndex = index - 1;
        // while (values[previousIndex] === fillValue) {
        //   previousIndex = previousIndex - 1;
        // }
        const previousValidValue = values[previousIndex];
        previousIndex = index + 1;
        while (values[previousIndex] === fillValue) {
          previousIndex = previousIndex + 1;
        }
        const nextValidValue = values[previousIndex];
        const step =
          Math.abs(nextValidValue - previousValidValue) /
          (previousIndex - index + 1);
        values[index] =
          nextValidValue > previousValidValue
            ? values[index - 1] + step
            : values[index - 1] - step;
      }
      index = index + 1;
    }
    values.pop();
    values.shift();
    return values;
  }

  static annualLinearInterpolation(
    objectWithAnnualData,
    returnOnlyAnnualData = false
  ) {
    const annualData = ObjectTools.annualKeysAndValues(objectWithAnnualData);
    const years = Object.keys(annualData).map(year => Number.parseInt(year));
    const values = Object.values(annualData);
    const interpolatedYears = ArrayTools.yearRange(
      years[0],
      years.at(-1)
    );
    let interpolatedValues = ArrayTools.emptyArray(interpolatedYears.length);
    for (const year of years) {
      const yearIndex = years.indexOf(year);
      const yearIndexInterpolation = interpolatedYears.indexOf(year);
      interpolatedValues[yearIndexInterpolation] = values[yearIndex];
    }
    interpolatedValues =
      Interpolation._linearInterpolateFilledValues(interpolatedValues);
    const interpolatedData = returnOnlyAnnualData
      ? ArrayTools.zip(interpolatedYears, interpolatedValues, {})
      : ArrayTools.zip(
        interpolatedYears,
        interpolatedValues,
        objectWithAnnualData
      );
    return interpolatedData;
  }
}
