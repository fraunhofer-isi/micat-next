// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ColumnFactory from './column-factory';
import Mode from '../../calculation/mode';

import InputValidator from './input-validator';
import InputFilter from './input-filter';
import StringUtils from '../../utils/string-utils';

export default class DataFactory {
  static createDefaultData(
    headers,
    defaultSavings,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ){
    if(defaultSavings) {
      InputValidator.validateDefaultSavings(
        defaultSavings,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping
      );
      const newData = this.createTableData(
        headers,
        defaultSavings,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping
      );
      return newData;
    } else {
      const newData = [this._rowTemplate(headers)];
      return newData;
    }
  }

  static createTableData(
    headers,
    data,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ) {
    const dataHeaders = data[0];
    const tableData = [];
    for(let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const rowData = data[rowIndex];
      const filteredRowData = this._filterRow(rowData, dataHeaders, headers);
      const row = this._convertTableRow(
        rowIndex,
        filteredRowData,
        headers,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping
      );
      tableData.push(row);
    }
    return tableData;
  }

  static convertUploadedParameter(
    idMode,
    headers,
    jsonData,
    properties
  ){
    const firstAnnualIndex = ColumnFactory.numberOfKeyColumns();
    const filteredHeaders = Mode.filterHeadersForMode(idMode, headers, firstAnnualIndex);
    const itemMap = ColumnFactory.itemMap(properties);

    const tableData = [];
    for(const rowData of jsonData) {
      const row = this._convertParameterRow(
        rowData,
        filteredHeaders,
        itemMap
      );
      tableData.push(row);
    }
    return tableData;
  }

  static convertMainParameters(details, rawDetails){
    const parameterRows = rawDetails.main;
    for(const row of parameterRows){
      const idParameter = row.id_parameter;

      const entry = {
        id_parameter: idParameter
      };
      let containsYearColumn = false;
      for (const [key, value] of Object.entries(row)){
        if(StringUtils.isNumeric(key)){
          containsYearColumn = true;
          entry[key] = value;
        }
      }
      if (containsYearColumn){
        const idFinalEnergyCarrier = row.id_final_energy_carrier;
        if (idFinalEnergyCarrier){
          entry.id_final_energy_carrier = idFinalEnergyCarrier;
          details.finalParameters.push(entry);
        } else {
          details.parameters.push(entry);
        }
      }
      if(row.constants) {
        entry.value = row.constants;
        details.constants.push(entry);
      }
    }
    return details;
  }

  static convertFuelSwitch(details, rawDetails){
    const parameterRows = rawDetails.fuelSwitch;
    for(const row of parameterRows){
      const idParameter = row.id_parameter;
      const idFinalEnergyCarrier = row.id_final_energy_carrier;

      const entry = {
        id_parameter: idParameter,
        id_final_energy_carrier: idFinalEnergyCarrier
      };

      let containsYearColumn = false;
      for (const [key, value] of Object.entries(row)){
        if(StringUtils.isNumeric(key)){
          containsYearColumn = true;
          entry[key] = value;
        }
      }
      if(containsYearColumn){
        details.finalParameters.push(entry);
      }
    }

    return details;
  }

  static convertResidential(details, rawDetails){
    const parameterRows = rawDetails.residential;
    for(const row of parameterRows){
      const idParameter = row.id_parameter;

      const entry = {
        id_parameter: idParameter
      };

      let containsYearColumn = false;
      for (const [key, value] of Object.entries(row)){
        if(StringUtils.isNumeric(key)){
          containsYearColumn = true;
          entry[key] = value;
        }
      }
      if(containsYearColumn){
        details.parameters.push(entry);
      }
    }
    return details;
  }

  static createNewRowData(id, columns) {
    const rowData = {
      id,
      row_number: id,
      active: true,
      subsector: undefined,
      action_type: undefined
    };
    const firstAnnualIndex = ColumnFactory.numberOfKeyColumns();
    const annualColumns = columns.slice(firstAnnualIndex);
    for(const column of annualColumns){
      rowData[column.field] = 0;
    }
    return rowData;
  }

  static extractSavings(jsonData){
    const mainParameters = jsonData.main;
    // removes savings from jsonData on purpose; we do *not* want to store savings twice,
    // in savings table and in details ... but only in the annual columns of the savings table
    const rawSavings = mainParameters.splice(0, 1)[0];
    const savings = DataFactory._extractAnnualData(rawSavings);
    return [savings, jsonData];
  }

  static synchronizeEntries(row, entries){
    const data = row.getData();
    for (const [key, value] of Object.entries(entries)) {
      if (key in data){
        data[key] = value;
      }
    }
    return data;
  }

  static _convertTableRow(
    index,
    rowData,
    headers,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ){
    const subSectorLabel = rowData[0];
    const actionTypeLabel = rowData[1];

    const subsectorItem = InputFilter.itemByLabelOrFirstItem(subsectorItems, subSectorLabel);

    // In order to avoid invalid combinations of subsector end actionType:
    // * We get the corresponding actionTypes for the given subsector.
    // * Then we lookup the wanted actionType from the corresponding actionTypes.
    // We could also lookup the actionType from all available actionTypes. However,
    // that would not correct a wrong actionType.
    const correspondingActionTypeItems = InputFilter.filterActionTypesBySubsector(
      subsectorItem,
      actionTypeItems,
      actionTypeMapping
    );
    const actionTypeItem = InputFilter.itemByLabelOrFirstItem(correspondingActionTypeItems, actionTypeLabel);

    let row = {
      id: index,
      row_number: index,
      active: true,
      subsector: subsectorItem,
      action_type: actionTypeItem
    };
    row = this._includeAnnualEntries(row, headers, rowData);
    row.details = DataFactory._convertDetails(rowData.details);
    return row;
  }

  static _convertDetails(_rawDetails){
    const details = {};

    return details;
  }

  static _convertParameterRow(
    rowData,
    headers,
    itemMap
  ){
    const row = {};
    for(const header of headers){
      let key = header;
      let value = rowData[header];
      if(header in itemMap){
        const entry = itemMap[header];
        key = entry.key;
        const items = entry.items;
        value = this._convertToId(value, items);
      }
      row[key] = value;
    }
    return row;
  }

  static _convertToId(value, items){
    const item = InputFilter.itemByLabelOrFirstItem(items, value);
    return item.id;
  }

  static _extractAnnualData(rawSavings){
    const savings = {};
    for (const [key, value] of Object.entries(rawSavings)) {
      if (StringUtils.isNumeric(key)){
        const yearNumber = Number(key);
        savings[yearNumber] = value;
      }
    }
    return savings;
  }

  static _filterRow(rowData, dataHeaders, headers){
    const filteredRowData = [];
    for (const [columnIndex, header] of dataHeaders.entries()){
      if(headers.includes(header)){
        const value = rowData[columnIndex];
        filteredRowData.push(value);
      }
    }
    return filteredRowData;
  }

  static _includeAnnualEntries(row, headers, rowData){
    const firstAnnualIndex = ColumnFactory.numberOfKeyColumns();
    for(let columnIndex = firstAnnualIndex; columnIndex < rowData.length; columnIndex++) {
      const annualHeader = headers[columnIndex];
      const annualValue = rowData[columnIndex];
      row[annualHeader] = annualValue;
    }
    return row;
  }

  static _rowTemplate(){
    return {
      id: 1,
      row_number: 1,
      active: true,
      subsector: undefined,
      action_type: undefined,
      2000: 0,
      2010: 0,
      2015: 0,
      2020: 0,
      2025: 0,
      2030: 0,
      details: {}
    };
  }
}
