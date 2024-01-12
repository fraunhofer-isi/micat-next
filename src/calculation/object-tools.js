// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class ObjectTools {
  static annualKeysAndValues(objectWithAnnualData) {
    const annualData = Object.keys(objectWithAnnualData)
      .filter(key => {
        return Number.isInteger(Number.parseInt(key));
      })
      .sort()
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((resultObject, year) => {
        return Object.assign(resultObject, {
          [year]: objectWithAnnualData[year]
        });
      }, {});
    return annualData;
  }

  static zipKeysAndValues(object_) {
    const zipped = [];
    for (const key of Object.keys(object_)) {
      zipped.push([key, object_[key]]);
    }
    return zipped;
  }

  static hasAllKeys(listOfKeys, object_) {
    // eslint-disable-next-line no-prototype-builtins
    const keysContained = listOfKeys.every(item => object_.hasOwnProperty(item));
    return keysContained;
  }
}
