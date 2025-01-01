// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import {
  ArrowCounterclockwise,
  PlayFill,
  PlusSquare,
  Trash
} from 'react-bootstrap-icons';
import parentStyles from '../annual-table.module.scss';
import styles from './toolbar.module.scss';
// import Download from '../../../download/download';
// import ExcelUpload from '../../../upload/excel-upload';

export default function Toolbar(properties) {
  const defaultNewColumnYear = properties.defaultNewColumnYear;
  const [newColumnYear, setNewColumnYear] = React.useState(defaultNewColumnYear);

  const extendedProperties = {
    ...properties,
    newColumnYear,
    setNewColumnYear
  };

  const newColumnYearInputReference = React.createRef();
  const newColumnYearInput = _Toolbar.newColumnYearInput(extendedProperties, newColumnYearInputReference);

  React.useEffect(() => {
    setNewColumnYear(defaultNewColumnYear);
  }, [defaultNewColumnYear]);

  React.useEffect(() => {
    // without this hook the update of the input value does not work after
    // adding a new column using an interim year (don't know why)
    _Toolbar.updateNewColumnYear(newColumnYearInputReference, newColumnYear);
  }, [newColumnYear]);

  return _Toolbar.render(extendedProperties, newColumnYearInput);
}

export class _Toolbar {
  static render(properties, newColumnYearInput){
    const iconButtonStyle = parentStyles['icon-button'];
    return (<div className={styles.toolbar}>
      <div className={styles['left-toolbar']}>
        <button
          title="Reset"
          onClick={async () => await properties.reset()}
          className={iconButtonStyle}
          disabled={properties.disabled}
        >
          <ArrowCounterclockwise />
        </button>

        <button
          title="Clear"
          onClick={async () => await properties.clear()}
          className={iconButtonStyle}
          disabled={properties.disabled}
        >
          <Trash />
        </button>

        {/*
        <ExcelUpload
          title={'Upload'}
          onlyFirstSheet={true}
          change={jsonData => this._fileChanged(jsonData, properties)}
          disabled={properties.disabled}
        />

        <Download
          title="Download"
          fileName={properties.downloadFileName}
          blob={async fileName => await properties.downloadBlob(fileName)}
          disabled={properties.disabled}
        />
        */}

        <button
          title="Apply"
          onClick={async () => await properties.apply()}
          className={`${iconButtonStyle} ${styles['apply-button']}`}
          disabled={properties.disabled || properties.applyDisabled}
        >
          <PlayFill /> Apply
        </button>
      </div>

      <div className={styles['right-toolbar']}>
        {newColumnYearInput}

        <button
          title="Add year"
          onClick={async () => await this._addAnnualColumn(properties)}
          className={iconButtonStyle}
          disabled={properties.disabled}
        >
          <PlusSquare /> Year
        </button>
      </div>
    </div>);
  }

  static newColumnYearInput(properties, newColumnYearInputReference){
    const columnManager = properties.columnManager;
    return columnManager
      ? <input
      type={'number'}
      min={properties.minYear} // only restricts usage of arrow button
      max={properties.maxYear} // only restricts usage of arrow button
      name="newColumnName"
      placeholder={columnManager.newColumnPlaceholder}
      defaultValue={properties.newColumnYear}
      className={styles['year-input']}
      onChange={event => columnManager.newColumnYearChanged(
        event,
        properties.newColumnYear,
        properties.setNewColumnYear
      )}
      disabled={properties.disabled}
      ref={newColumnYearInputReference}
    />
      : <div>Loading...</div>;
  }

  static updateNewColumnYear(newColumnYearInputReference, newColumnYear){
    if(newColumnYearInputReference.current){
      newColumnYearInputReference.current.value = newColumnYear;
    }
  }

  static async _addAnnualColumn(properties){
    const columnManager = properties.columnManager;
    const newColumnYear = properties.newColumnYear || properties.defaultNewColumnYear;
    columnManager.addAnnualColumn(newColumnYear, properties.setNewColumnYear);
  }

  static async _fileChanged(jsonData, properties) {
    if(confirm('The current data will be replaced with the uploaded data. Are you sure?')) {
      const columnsAndData = properties.validateAndConvertUploadedData(jsonData);
      if(columnsAndData){
        properties.updateTable(columnsAndData);
        await properties.apply();
      }
    }
  }
}
