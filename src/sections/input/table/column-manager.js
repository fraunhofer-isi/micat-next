// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ColumnFactory from '../column-factory';

export default class ColumnManager {
  constructor(properties){
    this.props = properties;
    this._tabulator = undefined;
    this._dataChanged = undefined;
    this.newColumnPlaceholder = 'Enter extra year';
    this._defaultYearIncrement = 5;
    this._startYear = properties.minYear;
  }

  static removeId(data){
    const dataCopy = structuredClone(data);
    for(const row of dataCopy){
      delete row.id;
    }
    return dataCopy;
  }

  setTabulator(tabulator){
    this._tabulator = tabulator;
  }

  setDataChanged(dataChanged){
    this._dataChanged = dataChanged;
  }

  async addAnnualColumn(newColumnYear, setNewColumnYear){
    const warning = this._validateNewColumnYear(newColumnYear);
    if(warning){
      alert(warning);
      return;
    }
    const previousColumnValues = this._previousAnnualColumnValues(newColumnYear);
    this._insertNewAnnualColumn(newColumnYear);
    this._fillNewColumnWithPreviousColumnValues(newColumnYear, previousColumnValues);
    this._updateNewColumnYear(setNewColumnYear);
    await this._dataChanged(this._displayData);
  }

  createNewColumnYear(){
    const columns = this.columns;
    const numberOfColumns = columns.length;
    const numberOfColumnsWithoutDetails = numberOfColumns - 1;
    const offset = ColumnFactory.annualOffset();
    const noAnnualColumnExists = numberOfColumnsWithoutDetails < offset + 1;
    if (noAnnualColumnExists){
      return this._startYear;
    }

    const singleAnnualColumnExists = numberOfColumnsWithoutDetails < offset + 2;
    if (singleAnnualColumnExists){
      const firstAnnualColumn = columns[offset];
      const nextYear = this._applyDefaultIncrement(firstAnnualColumn);
      return nextYear;
    } else {
      const lastTwoAnnualColumns = columns.slice(-3, -1);
      const nextYear = this._increaseByDifference(lastTwoAnnualColumns);
      return nextYear;
    }
  }

  filterDataByColumns(data){
    const columns = this.columns;
    const filteredData = [];
    for (const row of data){
      const filteredRow = {};
      for (const column of columns){
        const field = column.field;
        filteredRow[field] = row[field];
      }
      filteredData.push(filteredRow);
    }
    return filteredData;
  }

  newColumnYearChanged(event, previousYearNumber, setNewColumnYear){
    const yearNumber = Number.parseInt(event.target.value);
    if(!yearNumber) {
      event.target.value = previousYearNumber;
      return;
    }
    setNewColumnYear(yearNumber);
  }

  resetColumns(){
    const defaultColumns = this.extendAnnualColumns(this.props.defaultColumns);
    this._tabulator.setColumns(defaultColumns);
  }

  extendAnnualColumns(columns){
    return columns.map(column => this._extendColumnWithMenuIfAnnual(column));
  }

  _applyDefaultIncrement(previousColumn){
    const previousYear = previousColumn.title; // we use integers as title
    return previousYear + this._defaultYearIncrement;
  }

  _increaseByDifference(previousColumns){
    const leftYear = previousColumns[0].title; // we use integers as title
    const rightYear = previousColumns[1].title;
    const increment = rightYear - leftYear;
    return rightYear + increment;
  }

  _extendColumnWithMenuIfAnnual(column){
    const isAnnual = Number.isInteger(column.title);
    if(isAnnual){
      column.headerContextMenu = this._headerMenu();
    }
    return column;
  }

  _fillNewColumnWithPreviousColumnValues(title, previousColumnValues){
    const previousValuesExist = previousColumnValues.length > 0;
    const displayData = this._tabulator.getData();
    for(const [index, row] of displayData.entries()){
      const value = previousValuesExist
        ? previousColumnValues[index]
        : 0;
      row[title] = value;
    }
    this._tabulator.setData(displayData);
  }

  _insertNewAnnualColumn(newColumnYear){
    const newPosition = this._newPosition(newColumnYear);
    const newColumn = this._createNewAnnualColumn(newColumnYear);
    this._tabulator.addColumn(newColumn, newPosition.before, newPosition.referenceField);
  }

  _newPosition(newColumnYear){
    const newAnnualIndex = this._newAnnualColumnIndex(newColumnYear);

    const offset = ColumnFactory.annualOffset();
    const columns = this.columns;

    const isFirstAnnualColumn = (newAnnualIndex === 0);
    if(isFirstAnnualColumn){
      const lastKeyColumn = columns[offset - 1];
      return {
        before: false,
        referenceField: lastKeyColumn.field
      };
    }

    const newIndex = offset + newAnnualIndex;
    const isAfterLastColumn = newIndex === columns.length;
    if(isAfterLastColumn){
      const lastColumn = columns.at(-1);
      return {
        before: false,
        referenceField: lastColumn.field
      };
    }

    const existingColumn = this.columns[newIndex];
    return {
      before: true,
      referenceField: existingColumn.field
    };
  }

  _newAnnualColumnIndex(newColumnYear) {
    const yearNumbers = this._annualHeaders;
    yearNumbers.push(newColumnYear);
    yearNumbers.sort();
    const annualIndex = yearNumbers.indexOf(newColumnYear);
    return annualIndex;
  }

  _validateNewColumnYear(newColumnYear){
    if(!newColumnYear) {
      return 'Please enter a valid year for the new column first.';
    }
    const minYear = this.props.minYear;
    const maxYear = this.props.maxYear;
    if(newColumnYear < minYear || newColumnYear > maxYear){
      return 'Please enter a year within ' + minYear + ' <= year <= ' + maxYear + '.';
    }
    if(this._containsColumn(newColumnYear)){
      return 'Column already exists. Please choose a unique column name.';
    }
  }

  _updateNewColumnYear(setNewColumnYear){
    const newColumnYear = this.createNewColumnYear();
    setNewColumnYear(newColumnYear);
  }

  _containsColumn(title) {
    const cols = this._tabulator.getColumns();
    for(const col_ of cols) {
      const col = col_._column.definition;
      if(col.title === title) {
        return true;
      }
    }
    return false;
  }

  _createNewAnnualColumn(newColumnYear){
    const column = this.props.createAnnualColumn(newColumnYear);
    return this._extendColumnWithMenuIfAnnual(column);
  }

  _previousAnnualColumnValues(yearNumber){
    const previousAnnualColumn = this._previousAnnualColumn(yearNumber);
    if(previousAnnualColumn){
      const values = previousAnnualColumn.cells.map(cell => cell.value);
      return values;
    } else {
      return [];
    }
  }

  _previousAnnualColumn(yearNumber){
    const previousYear = this._previousYear(yearNumber);
    return previousYear ? this._fullColumnByTitle(previousYear) : undefined;
  }

  _fullColumnByTitle(title){
    const fullColumns = this._tabulator.columnManager.columns;
    return fullColumns.find(column => column.definition.title === title);
  }

  _previousYear(yearNumber){
    const reversedYears = this._annualHeaders.reverse();
    for(const year of reversedYears){
      if(year < yearNumber){
        return year;
      }
    }
  }

  _headerMenu(){
    return [
      {
        label: 'Delete year column',
        action: async (_event, column) => {
          column.delete();
          await this._dataChanged(this._displayData);
        }
      }
    ];
  }

  _removeDetailsHeader(headers){
    headers.pop();
    return headers;
  }

  get _annualHeaders(){
    // returns the annual titles as integers
    const rightHeaders = this.dataHeaders.slice(ColumnFactory.numberOfKeyColumns());
    const annualHeaders = this._removeDetailsHeader(rightHeaders);
    return annualHeaders;
  }

  get _headers(){
    // some of the headers are strings and some are integers
    const columns = this._tabulator.columnManager.columns;
    const headers = columns.map(column => column.definition.title);
    return headers;
  }

  get columns(){
    // all column definitions, including
    // prefix columns and key columns
    return this._tabulator.initialized
      ? this._tabulator.columnManager.columns.map(column => column.definition)
      : this.props.defaultColumns;
  }

  get dataHeaders(){
    // headers without prefix headers and with key headers
    // key headers are strings, annual headers are integers
    return this._headers.slice(ColumnFactory.numberOfPrefixColumns());
  }
}
