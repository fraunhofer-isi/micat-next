// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ColumnFactory from './column-factory';
import Mode from '../../calculation/mode';
import InputFilter from './input-filter';

export default class InputValidator {
  static validateDefaultSavings(
    defaultSavings,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ){
    const savingsData = InputValidator._removeHeader(defaultSavings);
    const subsectorIndex = 0;
    const actionTypeIndex = 1;
    for (const row of savingsData) {
      const subsectorLabel = row[subsectorIndex];
      InputValidator._validateSubsector(subsectorLabel, subsectorItems);
      const subsectorItem = subsectorItems.find(subsectorItem => subsectorItem.label === subsectorLabel);
      const actionTypeLabel = row[actionTypeIndex];
      const filteredActionTypeItems = InputFilter.filterActionTypesBySubsector(
        subsectorItem,
        actionTypeItems,
        actionTypeMapping
      );
      InputValidator._validateActionType(subsectorLabel, actionTypeLabel, filteredActionTypeItems);
    }
  }

  static validateHeaders(headers, idMode, keyColumnHeaders){
    for (const keyColumnHeader of keyColumnHeaders){
      if(!headers.includes(keyColumnHeader)){
        return 'Headers need to include "' + keyColumnHeader + '"';
      }
    }
    return this._validateYears(idMode, headers);
  }

  static validateSavings(savings) {
    if(savings.length === 0) {
      return false;
    }
    return !savings.some(row => this._rowIsNotValid(row));
  }

  static _removeHeader(savings){
    return savings.slice(1, savings.length);
  }

  static _validateYears(idMode, headers){
    const includesYear = this._includesInteger(headers);
    if(!includesYear){
      return 'No year column found.';
    }
    const firstAnnualIndex = ColumnFactory.numberOfKeyColumns();
    const annualHeaders = headers.slice(firstAnnualIndex);

    const minYear = Mode.minYear(idMode);
    const maxYear = Mode.maxYear(idMode);
    for(const year of annualHeaders){
      const isInValidRange = (year >= minYear) && (year <= maxYear);
      if(isInValidRange){
        return;
      }
    }

    return 'No year column found that is in the allowed range ' + minYear + ' <= year <= ' + maxYear;
  }

  static _validateSubsector(subsectorLabel, subsectorItems){
    if(!this._subsectorValid(subsectorLabel, subsectorItems)) {
      const subsectorLabels = subsectorItems.map(item => ' ' + item.label);
      const message = 'Invalid subsector "' + subsectorLabel +
          '" in debug data. Please revise your settings file.' +
          ' Valid values are:\n\n' + subsectorLabels;
      throw new Error(message);
    }
  }

  static _validateActionType(subsectorLabel, actionTypeLabel, actionTypeItems){
    if(!this._actionTypeValid(actionTypeLabel, actionTypeItems)) {
      const actionTypes = actionTypeItems.map(item => ' ' + item.label);
      const message = "Invalid action type of '" + actionTypeLabel + "'. Please revise " +
                      "your settings file. Valid values for the subsector '" + subsectorLabel +
                      "' are:\n\n" + actionTypes;
      throw new Error(message);
    }
  }

  static _subsectorValid(subsectorLabel, subsectorItems) {
    return subsectorItems.some(item => item.label === subsectorLabel);
  }

  static _actionTypeValid(actionTypeLabel, filteredActionTypeItems) {
    return filteredActionTypeItems.some(item => item.label.trim() === actionTypeLabel);
  }

  static _rowIsNotValid(row){
    const isNotValid = row.id_subsector === undefined || row.id_action_type === undefined;
    return isNotValid;
  }

  static _includesInteger(values) {
    for(const value of values) {
      if(Number.isInteger(value)) {
        return true;
      }
    }
    return false;
  }
}
