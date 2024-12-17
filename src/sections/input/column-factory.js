// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import ReactDom from 'react-dom/client';
import SelectableItem from './table/selectable-item';
import InputValidator from './input-validator';
import DataFactory from './data-factory';
import InputFilter from './input-filter';
import Download from '../../components/download/download';
import ExcelUpload from '../../components/upload/excel-upload';

export default class ColumnFactory {
  static actionTypeItems(context){
    const rows = context.actionTypes.rows;
    const items = this._selectableItems(rows);
    return items;
  }

  static annualOffset(){
    return this.numberOfPrefixColumns() + this.numberOfKeyColumns();
  }

  static createAnnualColumn(year){
    return {
      title: year, // we use a number es title; makes it easier to calculate with it
      field: year.toString(),
      validator: ['numeric', 'required', 'min:0', 'max:1e9'],
      editor: 'number',
      formatter: cell => this._formatAnnualCell(cell)
    };
  }

  static createColumns(
    headers,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping,
    context,
    runtime,
    unit,
    getPopulation
  ){
    const basicColumns = this._createBasicColumns(
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );

    const firstIndex = this.numberOfKeyColumns();
    const years = headers.slice(firstIndex);
    const annualColumns = years.map(year => ColumnFactory.createAnnualColumn(year));

    const detailsColumn = ColumnFactory._createDetailsColumn(context, runtime, unit, getPopulation);

    const columns = [...basicColumns, ...annualColumns, detailsColumn];
    return columns;
  }

  static createDefaultColumns(
    idMode,
    defaultSavings,
    unit,
    getPopulation,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping,
    context,
    runtime
  ){
    if(defaultSavings) {
      const columns = this._createDefaultColumnsFromSavings(
        idMode,
        defaultSavings,
        unit,
        getPopulation,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping,
        context,
        runtime
      );
      return columns;
    } else {
      const columns = this._createDefaultColumnsFromScratch(
        idMode,
        unit,
        getPopulation,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping,
        context,
        runtime
      );
      return columns;
    }
  }

  static dataHeaders(columns){
    const headers = columns.map(column => column.title);
    const numberOfPrefixColumns = ColumnFactory.numberOfPrefixColumns();
    const dataHeaders = headers.slice(numberOfPrefixColumns);
    return dataHeaders;
  }

  static itemMap(properties){
    const context = properties.context;
    const subsectorItems = this.subsectorItems(context);
    const actionTypeItems = this.actionTypeItems(context);
    const finalEnergyCarrierItems = this._finalEnergyCarrierItems(context);

    return {
      Subsector: { key: 'id_subsector', items: subsectorItems },
      Improvement: { key: 'id_action_type', items: actionTypeItems },
      'Final energy carrier': { key: 'id_final_energy_carrier', items: finalEnergyCarrierItems }
    };
  }

  static keyColumnHeadersForParameter(parameterName){
    const keyColumnHeadersMap = {
      FuelSplitCoefficient: ['Subsector', 'Final energy carrier'],
      EnergyPrice: ['Subsector', 'Final energy carrier'],
      ElectricityGeneration: ['Primary energy carrier'],
      HeatGeneration: ['Primary energy carrier'],
      MonetisationFactors: ['Monetisation factor']
    };
    const keyColumnHeaders = keyColumnHeadersMap[parameterName];
    return keyColumnHeaders;
  }

  static keyColumnHeadersForSavings(){
    return ['Subsector', 'Improvement'];
  }

  static numberOfKeyColumns(){
    const length = this.keyColumnHeadersForSavings().length;
    return length;
  }

  static numberOfPrefixColumns(){
    // columns: row_number, active
    return 2;
  }

  static subsectorItems(context){
    const rows = context.subsectors.rows;
    const items = this._selectableItems(rows);
    return items;
  }

  static _actionTypeEditorParameters(
    cellProxy,
    actionTypeItems,
    actionTypeMapping,
    filterDelegate
  ) {
    let values = [];
    if (cellProxy){
      const cell = Object.assign({}, cellProxy);
      const row = cell._cell.row;
      const subsectorItem = row.data.subsector;
      const filteredActionTypeItems = filterDelegate(subsectorItem, actionTypeItems, actionTypeMapping);
      values = this._toEditorValues(filteredActionTypeItems);
    }

    return {
      values,
      itemFormatter: this._optionFormatter,
      valueConverter: this._valueConverter
    };
  }

  static _actionTypeIsValidForSubsector(
    subsectorItem,
    actionTypeItem,
    actionTypeItems,
    actionTypeMapping
  ) {
    if(actionTypeItem){
      const actionTypeItemsForSubSector = InputFilter.filterActionTypesBySubsector(
        subsectorItem,
        actionTypeItems,
        actionTypeMapping
      );
      const actionTypeIsValid = actionTypeItemsForSubSector.includes(actionTypeItem);
      return actionTypeIsValid;
    } else {
      return true;
    }
  }

  static _createActionTypeColumn(actionTypeItems, actionTypeMapping, filterDelegate) {
    const title = this.keyColumnHeadersForSavings()[1];
    const actionTypeColumn = {
      title,
      field: 'action_type',
      editor: 'list',
      formatter: this._listEditorFormatter,
      editorParams: (cellProxy) => {
        return this._actionTypeEditorParameters(cellProxy, actionTypeItems, actionTypeMapping, filterDelegate);
      }
    };
    return actionTypeColumn;
  }

  static _createBasicColumns(
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ){
    const rowNumberColumn = this._createRowNumberColumn();

    const selectionColumn = this._createSelectionColumn();

    const subsectorColumn = this._createSubsectorColumn(
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );

    const actionTypeColumn = this._createActionTypeColumn(
      actionTypeItems,
      actionTypeMapping,
      (subsectorItem, actionTypeItems, actionTypeMapping) => InputFilter.filterActionTypesBySubsector(
        subsectorItem,
        actionTypeItems,
        actionTypeMapping
      )
    );

    const basicColumns = [
      rowNumberColumn,
      selectionColumn,
      subsectorColumn,
      actionTypeColumn
    ];
    return basicColumns;
  }

  static _createDefaultColumnsFromSavings(
    idMode,
    savings,
    unit,
    getPopulation,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping,
    context,
    runtime
  ){
    const dataHeaders = savings[0];
    const keyColumnHeaders = this.keyColumnHeadersForSavings();
    const validationError = InputValidator.validateHeaders(dataHeaders, idMode, keyColumnHeaders);
    if(validationError){
      const columnNames = dataHeaders.join(' ');
      const message = 'Invalid columns:\n' + columnNames + '\n' +
                'Please revise your settings file.\n' +
                validationError;
      throw new Error(message);
    } else {
      const filteredDefaultHeaders = this._filterDefaultHeadersForMode(dataHeaders, idMode);
      const columns = this.createColumns(
        filteredDefaultHeaders,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping,
        context,
        runtime,
        unit,
        getPopulation
      );
      return columns;
    }
  }

  static _createDefaultColumnsFromScratch(
    idMode,
    unit,
    population,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping,
    context,
    runtime
  ){
    const basicColumns = this._createBasicColumns(
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );
    const defaultYears = this._defaultYears(idMode);
    const annualColumns = defaultYears.map(year => this.createAnnualColumn(year));
    const detailsColumn = ColumnFactory._createDetailsColumn(context, runtime, unit, population);
    const columns = [...basicColumns, ...annualColumns, detailsColumn];
    return columns;
  }

  static _createDetailsColumn(context, runtime, unit, getPopulation){
    return {
      title: 'Details',
      field: 'details',
      formatter: cell => this._formatDetailsCell(cell, context, runtime, unit, getPopulation),
      editorParams: {
        valueConverter: this._detailsValueConverter
      }
    };
  }

  static _createRowNumberColumn(){
    const rowNumberColumn = {
      field: 'row_number'
    };
    return rowNumberColumn;
  }

  static _createSelectionColumn() {
    const selectionColumn = {
      field: 'active',
      cellClick: (_event, cell) => this._toggleBooleanCellValue(cell),
      formatter: cell => this._selectionColumnFormatter(cell)
    };
    return selectionColumn;
  }

  static _createSubsectorColumn(
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ) {
    const values = this._toEditorValues(subsectorItems);
    const title = this.keyColumnHeadersForSavings()[0];
    const subsectorColumn = {
      title,
      field: 'subsector',
      editor: 'list',
      formatter: this._listEditorFormatter,
      editorParams: {
        values,
        itemFormatter: this._optionFormatter,
        valueConverter: this._valueConverter,
        placeholderEmpty: 'Please select...'
      },
      cellEdited: async event => this._subsectorColumnChanged(
        event,
        actionTypeItems,
        actionTypeMapping
      )
    };
    return subsectorColumn;
  }

  static _detailsValueConverter(rawDetails){
    let details = {
      parameters: [], // id_parameter, ...yearColumns
      finalParameters: [], // id_parameter, id_final_energy_carrier, ...yearColumns
      constants: []
    };
    const isEmpty = Object.keys(rawDetails).length === 0;
    if (isEmpty){
      return details;
    } else {
      details = DataFactory.convertMainParameters(details, rawDetails);
      details = DataFactory.convertFuelSwitch(details, rawDetails);
      details = DataFactory.convertResidential(details, rawDetails);
      return details;
    }
  }

  static _defaultYears(idMode){
    switch(idMode){
      case 1: {
        return [2020, 2025, 2030];
      }
      case 2: {
        return [2020, 2025, 2030];
      }
      case 3: {
        return [2010, 2015, 2020];
      }
      case 4: {
        return [2000, 2010, 2020];
      }
      default: {
        throw new Error('Not yet implemented');
      }
    }
  }

  /* eslint-disable unused-imports/no-unused-vars */
  static async _downloadMeasure(fileName, cell, context, runtime, unit, getPopulation){
    const route = 'measure?id_mode=' + context.idMode +
        '&id_region=' + context.idRegion +
        '&file_name=' + fileName;

    const payload = cell._cell.row.data;
    payload.unit = unit;
    payload.population = getPopulation();

    const templateBlob = await runtime.apiCall(route, payload, 'application/json', 'POST');
    return templateBlob;
  }
  /* eslint-enable unused-imports/no-unused-vars */

  static _finalEnergyCarrierItems(context){
    const rows = context.finalEnergyCarriers.rows;
    const items = this._selectableItems(rows);
    return items;
  }

  static _filterDefaultHeadersForMode(dataHeaders, idMode){
    const firstAnnualIndex = this.numberOfKeyColumns();
    const years = dataHeaders.slice(firstAnnualIndex);
    const defaultYearsForMode = this._defaultYears(idMode);

    const filteredHeaders = dataHeaders.slice(0, firstAnnualIndex);
    for(const year of years){
      if (defaultYearsForMode.includes(year)){
        filteredHeaders.push(year);
      }
    }
    return filteredHeaders;
  }

  static _formatAnnualCell(cell){
    const value = cell.getValue();
    if(value === 0) {
      cell.getElement().style.backgroundColor = '#FDF6C4';
    } else {
      cell.getElement().style.backgroundColor = '';
    }
    return value;
  }

  static _formatDetailsCell(cell, context, runtime, unit, getPopulation){
    const div = document.createElement('div');
    const cellRoot = ReactDom.createRoot(div);

    const cellContent = <>
      <Download
        title="Download"
        fileName="micat_measure.xlsx"
        blob={
          async fileName => await ColumnFactory._downloadMeasure(
            fileName,
            cell,
            context,
            runtime,
            unit,
            getPopulation
          )
        }
        // disabled={properties.disabled}
      />

      <ExcelUpload
        title={'Upload'}
        onlyFirstSheet={false}
        change={jsonData => ColumnFactory._uploadMeasure(
          jsonData,
          cell,
          context,
          unit,
          getPopulation
        )}
        // disabled={properties.disabled}
      />
    </>;
    cellRoot.render(cellContent);

    return div;
  }

  static _listEditorFormatter(cell){
    const selectableItem = cell.getValue();
    const isEmpty = selectableItem === undefined;
    if (isEmpty) {
      cell.getElement().style.backgroundColor = '#FFCCCB';
      return 'Please select...';
    } else {
      cell.getElement().style.backgroundColor = '';
      return selectableItem.toString();
    }
  }

  static _optionFormatter(_label, value){
    const stringValue = value.toString();
    const fixedStringValue = stringValue.replace(/&/g, '%26');
    return fixedStringValue;
  }

  static async _resetActionTypeById(tabulator, id){
    const change = { id, action_type: undefined };
    await tabulator.updateData([change]);
  }

  static _selectableItems(idTableRows){
    const items = idTableRows.map(row => this._rowToSelectableItem(row));
    return items;
  }

  static _rowToSelectableItem(row){
    const id = row[0];
    const label = row[1];
    const description = row[2];
    const item = new SelectableItem(id, label, description);
    return item;
  }

  static _selectionColumnFormatter(cell){
    const isSelected = cell.getValue();
    return isSelected
      ? '<div style="color:#1494b2;font-weight:bold;">&nbsp;&nbsp;&#10003;</div>'
      : '<div style="color:grey;font-weight:bold;">&nbsp;&nbsp;&#10007;</div>';
  }

  static async _subsectorColumnChanged(
    event,
    actionTypeItems,
    actionTypeMapping
  ){
    const target = Object.assign({}, event);
    const cell = target._cell;
    const row = cell.row;
    const subsectorItem = row.data.subsector;
    const actionTypeItem = row.data.action_type;

    const actionTypeIsStillValid = this._actionTypeIsValidForSubsector(
      subsectorItem,
      actionTypeItem,
      actionTypeItems,
      actionTypeMapping
    );

    if(!actionTypeIsStillValid) {
      const id = row.data.id;
      const tabulator = row.table;
      await this._resetActionTypeById(tabulator, id);
    }
  }

  static _toEditorValues(selectableItems){
    // The tabultor library requires a distinct format for
    // the options of the list editor to work correctly.
    // Also see https://tabulator.info/docs/5.4/edit#editor-list
    // and the function _optionFormatter that defines how the
    // items are shown.
    const editorValues = selectableItems.map(item => {
      return {
        label: item.label,
        value: item
      };
    });
    return editorValues;
  }

  static _toggleBooleanCellValue(cell){
    cell.setValue(!cell.getValue());
  }

  static _uploadMeasure(jsonData, cell, _context, _unit, _population){
    const [savings, jsonDataWithoutSavings] = DataFactory.extractSavings(jsonData);
    const row = cell.getRow();
    const newRowData = DataFactory.synchronizeEntries(row, savings);
    newRowData.details = jsonDataWithoutSavings;
    row.update(newRowData);
  }

  static _valueConverter(selectableItem){
    return selectableItem
      ? selectableItem.id
      : undefined;
  }
}

/* eslint-enable max-lines */
