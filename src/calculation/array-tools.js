// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class ArrayTools {
  static emptyArray(arrayLength, fillValue) {
    const array = Array.apply(
      undefined,
      Array.from({ length: arrayLength })
    ).map(() => fillValue);
    return array;
  }

  static yearRange(firstYear, lastYear) {
    const years = [];
    for (let year = firstYear; year <= lastYear; year++) {
      years.push(year);
    }
    return years;
  }

  static numberOfYears(startYear, number, forward = true) {
    const years = [];
    if (forward) {
      const endYear = startYear + number;
      for (let year = startYear; year < endYear; year++) {
        years.push(year);
      }
    } else {
      const endYear = startYear - number;
      for (let year = startYear; year > endYear; year--) {
        years.unshift(year);
      }
    }
    return years;
  }

  static padArrayToLength(array, newLength, padValue, padEnd = true) {
    if (newLength <= array.length) {
      return array;
    }
    const paddedArray = ArrayTools.emptyArray(newLength, padValue);
    const deleteCount = array.length;
    if (padEnd) {
      paddedArray.splice(0, deleteCount, ...array);
    } else {
      const start = paddedArray.length - array.length;
      paddedArray.splice(start, deleteCount, ...array);
    }
    return paddedArray;
  }

  static zip(keys, values, resultObject = {}) {
    // eslint-disable-next-line array-callback-return
    keys.map((key, index) => {
      resultObject[key] = values[index];
    });
    return resultObject;
  }
}
