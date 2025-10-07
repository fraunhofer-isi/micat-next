// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class StringUtils {
  static stringify(object){
    const string = JSON.stringify(object, (_key, value) => this._replaceUndefined(value));
    return string;
  }

  static isNumeric(string_) {
    // source: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
    if (typeof string_ !== 'string') return false;
    return !Number.isNaN(string_) &&
           !Number.isNaN(Number.parseFloat(string_));
  }

  static _replaceUndefined(value){
    // replaces undefined with null, so that the
    // corresponding attributes are not lost during stringification
    const isUndefined = (value) === undefined;
    return isUndefined
      // eslint-disable-next-line unicorn/no-null
      ? null
      : value;
  }
}
