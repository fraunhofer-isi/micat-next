// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import ReactDomClient from 'react-dom/client';

import * as TabulatorTables from 'tabulator-tables';

import styles from './annual-table.module.scss';

import ColumnManager from './column-manager';
import RowManager from './row-manager';
import Toolbar from './toolbar/toolbar';
import ErrorBar from './error-bar/error-bar';
import Footer from './footer';

import StringUtils from '../../../utils/string-utils';

export default function AnnualTable(properties) {
  const [columnManager, setColumnManager] = React.useState();
  const [rowManager, setRowManager] = React.useState();
  const [tabulator, setTabulator] = React.useState();
  const [dataIsValid, setDataIsValid] = React.useState(false);
  const [dataIsStale, setDataIsStale] = React.useState(false);
  const [tabulatorValidationFailed, setTabulatorValidationFailed] = React.useState(false);
  const [tabulatorValidationValue, setTabulatorValidationValue] = React.useState();
  const [previouslyAppliedDisplayDataString, setPreviouslyAppliedDisplayDataString] = React.useState();

  const extendedProperties = {
    ...properties,
    dataIsValid,
    setDataIsValid,
    dataIsStale,
    setDataIsStale,
    tabulatorValidationFailed,
    setTabulatorValidationFailed,
    tabulatorValidationValue,
    setTabulatorValidationValue,
    previouslyAppliedDisplayDataString,
    setPreviouslyAppliedDisplayDataString
  };

  const toolbar = _AnnualTable.toolbar(extendedProperties, tabulator, columnManager, rowManager);
  const footer = _AnnualTable.footer(extendedProperties, rowManager);
  const errorBar = _AnnualTable.errorBar(extendedProperties);
  const [footerRoot, setFooterRoot] = React.useState();

  React.useEffect(() => {
    if(!tabulator){
      _AnnualTable.initializeTabulator(
        extendedProperties,
        setColumnManager,
        setRowManager,
        setTabulator,
        setFooterRoot
      );
    }
  }, []);

  React.useEffect(() => {
    if(footerRoot){
      footerRoot.render(footer);
    }
  }, [footerRoot, tabulatorValidationFailed]);

  return <div className={styles['annual-table']}>
      {toolbar}
      <div id="tabulator-placeholder"></div>
      {errorBar}
    </div>;
}

export class _AnnualTable {
  static initializeTabulator(
    properties,
    setColumnManager,
    setRowManager,
    setTabulator,
    setFooterRoot
  ){
    const columnManager = this._createColumnManager(properties);
    const rowManager = this._createRowManager(properties);

    const placeholder = '#tabulator-placeholder';
    const options = this._tabulatorOptions(properties, columnManager, rowManager);

    const tabulator = new TabulatorTables.TabulatorFull(placeholder, options);

    columnManager.setTabulator(tabulator);
    rowManager.setTabulator(tabulator);

    const dataChanged = displayData => {
      _AnnualTable._dataChanged(
        displayData,
        properties,
        tabulator,
        columnManager
      );
    };
    columnManager.setDataChanged(dataChanged);
    tabulator.on('dataChanged', dataChanged);
    tabulator.on('dataLoaded', properties.savingsDataChanged);
    tabulator.on('validationFailed', (_cell, value) =>
      _AnnualTable._tabulatorValidationFailed(value, properties)
    );
    tabulator.on('tableBuilt', () => {
      _AnnualTable._tabulatorBuilt(
        properties,
        setFooterRoot,
        tabulator,
        columnManager
      );
    });

    setColumnManager(columnManager);
    setRowManager(rowManager);
    setTabulator(tabulator);
  }

  static toolbar(
    properties,
    tabulator,
    columnManager,
    rowManager
  ){
    let defaultYear;
    if(columnManager){
      defaultYear = columnManager.createNewColumnYear();
    }

    return (<Toolbar
      defaultNewColumnYear={defaultYear}
      columnManager={columnManager}
      minYear={properties.minYear}
      maxYear={properties.maxYear}
      reset={ () => _AnnualTable._reset(properties, tabulator, columnManager)}
      clear={ () => _AnnualTable._clear(properties, tabulator, columnManager, rowManager)}
      updateTable={columnsAndData => _AnnualTable._updateTable(columnsAndData, tabulator)}
      apply={ () => {
        const data = _AnnualTable._data(properties, tabulator, columnManager);
        _AnnualTable._apply(data, properties, tabulator, columnManager);
      }}
      applyDisabled={!properties.dataIsStale || !properties.dataIsValid}
      disabled={properties.tabulatorValidationFailed}
      downloadFileName = {'micat_energy_savings.xlsx'}
      downloadBlob={ fileName => _AnnualTable._downloadBlob(fileName, properties, tabulator, columnManager, rowManager)}
      validateAndConvertUploadedData={ data => properties.validateAndConvertUploadedData(data)}
    />);
  }

  static footer(properties, rowManager){
    return <Footer
      addRow={() => rowManager.addRow()}
      disabled={properties.tabulatorValidationFailed}
    />;
  }

  static errorBar(properties){
    return <ErrorBar
      value={properties.tabulatorValidationValue}
      reset={() => this._resetErrorBar(properties)}
    />;
  }

  static _createColumnManager(properties){
    const columnManager = new ColumnManager(properties);
    return columnManager;
  }

  static _createRowManager(properties){
    return new RowManager(properties);
  }

  static _data(
    properties,
    tabulator,
    columnManager
  ){
    const columns = columnManager.columns;
    const displayData = _AnnualTable._displayData(properties, tabulator, columnManager);
    // const displayDataWithoutId = ColumnManager.removeId(displayData);
    const filteredDisplayData = properties.filterData(displayData);
    const data = _AnnualTable._convertValues(filteredDisplayData, columns);
    return data;
  }

  static _displayData(properties, tabulator, columnManager){
    const allData = tabulator.initialized
      ? tabulator.getData()
      : properties.defaultData;
    const dataForColumns = columnManager.filterDataByColumns(allData);
    return dataForColumns;
  }

  static _resetErrorBar(properties){
    properties.setTabulatorValidationValue();
    properties.setTabulatorValidationFailed(false);
  }

  static _tabulatorBuilt(
    properties,
    setFooterRoot,
    tabulator,
    columnManager
  ){
    const footerPlaceHolder = document.querySelector('#footer-element-placeholder');
    const footerRoot = ReactDomClient.createRoot(footerPlaceHolder);
    setFooterRoot(footerRoot);

    const data = this._data(properties, tabulator, columnManager);
    const isValid = this._validate(data, properties);
    properties.setDataIsValid(isValid);
    if(isValid){
      this._apply(data, properties, tabulator, columnManager);
    }
  }

  static _updateTable(columnsAndData, tabulator){
    const { columns, data } = columnsAndData;
    tabulator.clearData();
    tabulator.setColumns(columns);
    tabulator.replaceData(data);
  }

  static _tabulatorOptions(properties, columnManager, rowManager){
    const options = {
      key: `${Math.random()}`,
      selectable: true,
      movableRows: true,
      rowContextMenu: rowManager.rowContextMenu(),
      index: 'id',
      movableColumns: false,
      columns: columnManager.extendAnnualColumns(properties.defaultColumns),
      pagination: 'local',
      paginationSize: 5,
      data: properties.defaultData,
      clipboard: true,
      clipboardPasteAction: 'replace',
      layout: 'fitData',
      autoResize: true,
      resizableRows: false,
      layoutColumnsOnNewData: true,
      footerElement: "<div id='footer-element-placeholder' style='float:left'></div>",
      debugInvalidOptions: false
    };
    return options;
  }

  static _validate(data, properties) {
    const dataIsValid = properties.validate
      ? properties.validate(data)
      : true;
    return dataIsValid;
  }

  static _tabulatorValidationFailed(value, properties){
    properties.setTabulatorValidationFailed(true);
    properties.setTabulatorValidationValue(value);
  }

  static _dataChanged(displayData, properties, tabulator, columnManager){
    if(properties.savingsDataChanged) {
      properties.savingsDataChanged(displayData);
    }
    const isPreviouslyAppliedDisplayData = this._isPreviouslyApplied(displayData, properties);
    if(isPreviouslyAppliedDisplayData){
      this._updateIsStale(false, properties);
    } else {
      this._updateIsStale(true, properties);
      const data = _AnnualTable._data(properties, tabulator, columnManager);
      const isValid = _AnnualTable._validate(data, properties);
      properties.setDataIsValid(isValid);
    }
  }

  static _isPreviouslyApplied(currentData, properties){
    const oldDataString = properties.previouslyAppliedDisplayDataString;
    const newDataString = StringUtils.stringify(currentData);
    const isEqual = newDataString === oldDataString;
    return isEqual;
  }

  static _apply(data, properties, tabulator, columnManager){
    this._updateIsStale(false, properties);
    properties.change(data);
    const displayData = _AnnualTable._displayData(properties, tabulator, columnManager);
    const previouslyAppliedDisplayDataString = StringUtils.stringify(displayData);
    properties.setPreviouslyAppliedDisplayDataString(previouslyAppliedDisplayDataString);
  }

  static async _updateIsStale(isStale, properties){
    properties.setDataIsStale(isStale); // sets internal state of annaul-table
    if (properties.staleHandler){
      properties.staleHandler(isStale); // informs parent component about change
    }
  }

  static _reset(
    properties,
    tabulator,
    columnManager
  ){
    columnManager.resetColumns();
    tabulator.setData(properties.defaultData);
    const displayData = _AnnualTable._displayData(properties, tabulator, columnManager);
    this._dataChanged(displayData, properties, tabulator, columnManager);
  }

  static _clear(
    properties,
    tabulator,
    columnManager,
    rowManager
  ){
    const selectedRows = rowManager.selectedRows;
    if(selectedRows.length === 0){
      const isConfirmed = window.confirm('Are you sure you want to clear the whole table?');
      if(isConfirmed) {
        tabulator.setData([]);
        rowManager.addRow();
        const displayData = _AnnualTable._displayData(properties, tabulator, columnManager);
        this._dataChanged(displayData, properties, tabulator, columnManager);
      }
    } else {
      rowManager.deleteRows(selectedRows);
    }
  }

  static async _downloadBlob(
    fileName,
    properties,
    tabulator,
    columnManager,
    rowManager
  ) {
    const data = this._dataForDownload(tabulator, columnManager, rowManager);
    const blob = await properties.downloadBlob(fileName, data);
    return blob;
  }

  static _dataForDownload(tabulator, columnManager, rowManager){
    if(tabulator) {
      const headers = columnManager.dataHeaders;
      const rowData = rowManager.rowData;
      const tableData = [
        headers,
        ...rowData
      ];
      return tableData;
    } else {
      return [];
    }
  }

  static _convertValues(displayData, columns){
    const data = structuredClone(displayData);
    for (const column of columns){
      const valueConverter = _AnnualTable._valueConverter(column);
      if(valueConverter){
        const field = column.field;
        for(const row of data){
          const value = row[field];
          const convertedValue = valueConverter(value);
          let convertedFieldName = 'id_' + field;
          if (field === 'details'){
            convertedFieldName = field;
          }
          row[convertedFieldName] = convertedValue;
          if (field !== 'details'){
            delete row[field];
          }
        }
      }
    }
    return data;
  }

  static _valueConverter(column){
    if (column.editorParams){
      if (column.editorParams.valueConverter){
        return column.editorParams.valueConverter;
      }

      if (column.editorParams instanceof Function) {
        const editorParameters = column.editorParams();
        if(editorParameters.valueConverter){
          return editorParameters.valueConverter;
        }
      }
    }
  }
}
/* eslint-enable max-lines */
