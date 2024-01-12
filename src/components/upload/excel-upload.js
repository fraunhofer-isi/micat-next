// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import { Upload as UploadIcon } from 'react-bootstrap-icons';
import styles from './excel-upload.module.scss';
import xlsx from 'xlsx';

export default function ExcelUpload(properties) {
  const fileInputReference = React.useRef(null);
  const [hasFile, setHasFile] = React.useState(properties.hasFile);

  return (
    <div
      className={styles['excel-upload']}
      onDragOver={event => event.preventDefault()}
      onDrop={event => _ExcelUpload.fileDropped(event, properties, setHasFile)}
    >
      <input
        className={styles['excel-upload-input']}
        onChange={event => _ExcelUpload.fileChanged(event, properties, setHasFile)}
        type="file"
        ref={fileInputReference}
        data-testid="file-input"
      />

      <button
        className={_ExcelUpload.buttonStyle(hasFile)}
        title={properties.title}
        onClick={() => fileInputReference.current.click()}
        type="button"
        disabled={properties.disabled}
      >
        <UploadIcon />
      </button>
    </div>
  );
}

export class _ExcelUpload {
  static buttonStyle(hasFile){
    return hasFile ? styles['colored-icon-button'] : styles['icon-button'];
  }

  static async fileChanged(event, properties, setHasFile) {
    const file = event.target.files[0];
    if (file) {
      await this._handleFile(file, properties, setHasFile);
    }
    event.target.value = '';
  }

  static async fileDropped(event, properties, setHasFile){
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if(file){
      await this._handleFile(file, properties, setHasFile);
    }
  }

  static async _handleFile(file, properties, setHasFile) {
    const workbook = await this._readWorkbook(file);
    const requireSheetName = 'context';
    const hasContextSheet = this._sheetExists(workbook, requireSheetName);

    if (properties.allowWithoutContext) {
      // For Parameters section, upload only if 'context' is not present
      if (hasContextSheet === false) {
        const jsonData = properties.onlyFirstSheet
          ? this._sheetToJson(workbook)
          : this._sheetsToJson(workbook);

        setHasFile(true);
        properties.change(jsonData);
      } else {
        alert('Please check and upload the global parameters file');
      }
    } else {
      // For the other section, upload only if 'context' is present
      if (hasContextSheet) {
        const jsonData = properties.onlyFirstSheet
          ? this._sheetToJson(workbook)
          : this._sheetsToJson(workbook);

        setHasFile(true);
        properties.change(jsonData);
      } else {
        alert('Please check and upload the micat_measure file');
      }
    }
  }

  static async _readWorkbook(file) {
    const data = await file.arrayBuffer();
    const workbook = xlsx.read(data);
    return workbook;
  }

  static _sheetToJson(workbook) {
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    return jsonData;
  }

  static _sheetsToJson(workbook) {
    const data = {};
    for(const sheetName of workbook.SheetNames){
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      data[sheetName] = jsonData;
    }
    return data;
  }

  static _sheetExists(workbook, sheetName) {
    return workbook.SheetNames.includes(sheetName);
  }
}
