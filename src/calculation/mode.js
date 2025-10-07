// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class Mode {
  static filterHeadersForMode(idMode, dataHeaders, firstAnnualIndex){
    const years = dataHeaders.slice(firstAnnualIndex);
    const minYear = Mode.minYear(idMode);
    const maxYear = Mode.maxYear(idMode);

    const filteredHeaders = dataHeaders.slice(0, firstAnnualIndex);
    for(const year of years){
      const yearIsValid = (year >= minYear) && (year <= maxYear);
      if(yearIsValid){
        filteredHeaders.push(year);
      }
    }
    return filteredHeaders;
  }

  static maxYear(idMode){
    switch(idMode){
      case 1: {
        return 2050;
      }
      case 2: {
        return 2050;
      }
      case 3: {
        return 2020;
      }
      case 4: {
        return 2020;
      }
      default: {
        throw new Error('Not yet implemented');
      }
    }
  }

  static minYear(idMode){
    switch(idMode){
      case 1: {
        return 2015;
      }
      case 2: {
        return 2015;
      }
      case 3: {
        return 2000;
      }
      case 4: {
        return 2000;
      }
      default: {
        throw new Error('Not yet implemented');
      }
    }
  }
}
