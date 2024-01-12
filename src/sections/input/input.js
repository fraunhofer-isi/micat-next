// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */

import React from 'react';
import Image from 'next/image';
import AnnualTable from './table/annual-table';
import ColumnFactory from './column-factory';
import Mode from '../../calculation/mode';
import DataFactory from './data-factory';
import InputValidator from './input-validator';
import InputFilter from './input-filter';
import Parameters from './parameters/parameters';
import Runtime from '../../server/runtime';
import styles from './input.module.scss';
import Region from './region/region';
import UnitConverter from './unit-converter';
import UnitSelector from './unit-selector';

export default function Input(properties) {
  const populationReference = React.useRef(null);
  const getPopulation = () => _Input.getPopulation(populationReference);

  const units = UnitConverter.units();
  const defaultUnit = units.ktoe;
  const [unit, setUnit] = React.useState(defaultUnit);

  const [savings, setSavings] = React.useState();
  const [optionalParameters, setOptionalParameters] = React.useState();

  const savingsTable = _Input.savingsTable(properties, setSavings, unit, getPopulation);

  const parameters = _Input.parameters(properties, setOptionalParameters);

  const projectLogo = <div className={styles['project-logo']}>
    <Image src="../logo.svg" alt="logo"/>
  </div>;

  const projectLinks = <div className={styles['project-links']}>
        <a href="https://micatool.eu/">Project</a>
        <a href="https://doc.micatool.eu/">Documentation</a>
        <a href="https://micatool.eu/micat-project-en/data-protection/">Data protection</a>
        <a href="https://micatool.eu/micat-project-en/publishing-notes/">Publishing notes</a>
  </div>;

  React.useEffect(() => {
    const population = getPopulation();
    const payload = _Input.savingsTableToJsonPayload(
      savings,
      unit,
      population,
      optionalParameters
    );

    _Input.handleInputChanged(payload, properties);
  }, [unit, savings, optionalParameters]);

  return (
    <div className={styles['main-container']}>
      {projectLinks}
      {projectLogo}
      <Region
        context={properties.context}
        change={(idRegion, currentPopulation) =>
          _Input._regionChanged(
            idRegion,
            currentPopulation,
            properties,
            savings,
            unit
          )
       }
       populationReference={populationReference}
      />
      <UnitSelector units={units} defaultUnit={defaultUnit} setUnit={setUnit} />
      {savingsTable}
      <div>Global parameters</div>
      {parameters}
    </div>
  );
}

export class _Input {
  static savingsTableToJsonPayload(savings, unit, population, globalParameters = {}) {
    if(!savings){
      return;
    }

    const measures = savings.map((annualValues, index) => {
      if (unit.factor !== 1) {
        annualValues = UnitConverter.convertAnnualValues(annualValues, unit);
      }
      return {
        id: index + 1,
        savings: annualValues,
        parameters: {}
      };
    });
    const payload = {
      measures,
      population,
      parameters: globalParameters
    };
    return payload;
  }

  static getPopulation(populationReference){
    const element = populationReference.current;
    if(!element){
      return;
    }
    return Number(element.value);
  }

  static async _regionChanged(idRegion, population, properties, savings, unit) {
    const context = properties.context;
    const idMode = context.idMode;
    const route = '/' + idMode + '/' + idRegion;
    await context.router.push(route);
    const payload = _Input.savingsTableToJsonPayload(savings, unit, population);
    await properties.change(idRegion, payload);
  }

  static async handleInputChanged(payload, properties) {
    if (payload) {
      const idRegion = properties.context.idRegion;
      await properties.change(idRegion, payload);
    }
  }

  static unitChanged(unit, units, setUnit, setShowModal) {
    setUnit(units[unit]);
    setShowModal(true);
  }

  /* static savingsTemplateDownloader(_properties) {
    // const context = properties.context;
    // const runtime = new Runtime(context.settings);
    // const savingsTemplateFileName = 'savings_template.xlsx';
    return (
      <>
         (
      <Download
          title="Download an empty energy savings Excel template"
          fileName={savingsTemplateFileName}
          blob={async () => this._savingsBlob(savingsTemplateFileName, undefined, context, runtime)}
          text="download Excel savings template"
      />)
      </>
    );
  } */

  static savingsTable(
    properties,
    setSavings,
    unit,
    getPopulation
  ) {
    const context = properties.context;
    const idMode = context.idMode;

    const defaultSavings = _Input._defaultSavings(context);

    const subsectorItems = ColumnFactory.subsectorItems(context);
    const actionTypeItems = ColumnFactory.actionTypeItems(context);
    const actionTypeMapping = context.actionTypeMapping;

    const runtime = new Runtime(context.settings);

    const defaultColumns = ColumnFactory.createDefaultColumns(
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
    const headers = ColumnFactory.dataHeaders(defaultColumns);

    const defaultData = DataFactory.createDefaultData(
      headers,
      defaultSavings,
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );

    return (
      <AnnualTable
        defaultColumns={defaultColumns}
        defaultData={defaultData}
        change={async savings => await setSavings(savings)}
        staleHandler={isStale => properties.staleHandler(isStale)}
        validate={savings => InputValidator.validateSavings(savings)}
        validateAndConvertUploadedData={uploadedData =>
          _Input._validateAndConvertUploadedSavings(
            idMode,
            uploadedData,
            subsectorItems,
            actionTypeItems,
            actionTypeMapping
          )
        }
        filterData={displayData => InputFilter.filterDisplayData(displayData)}
        createAnnualColumn={year => ColumnFactory.createAnnualColumn(year)}
        createNewRowData={(id, columns) =>
          DataFactory.createNewRowData(id, columns)
        }
        minYear={Mode.minYear(idMode)}
        maxYear={Mode.maxYear(idMode)}
        downloadBlob={async (fileName, savings) =>
          await this._savingsBlob(fileName, savings, unit, context, runtime)
        }
        savingsDataChanged={data => this._savingsDataChanged(data, properties)}
        structureChange
      />
    );
  }

  static _savingsDataChanged(data, properties) {
    if (properties.savingsDataChanged) {
      properties.savingsDataChanged(data);
    }
  }

  static parameters(properties, setOptionalParameters) {
    const context = properties.context;
    const runtime = new Runtime(context.settings);
    return (
      <Parameters
        context={context}
        change={jsonData =>
          this._parametersChanged(jsonData, properties, setOptionalParameters)
        }
        templateBlob={async fileName =>
          await this._parameterTemplateBlob(fileName, context, runtime)
        }
      />
    );
  }

  static _parametersChanged(jsonData, properties, setOptionalParameters) {
    const parameters = this._validateAndConvertUploadedParameters(
      jsonData,
      properties
    );
    setOptionalParameters(parameters);
  }

  static async _savingsBlob(fileName, savings, unit, context, runtime) {
    let route =
      'savings?' +
      'id_mode=' +
      context.idMode +
      '&id_region=' +
      context.idRegion +
      '&file_name=' +
      fileName;
    if (savings) {
      let savingsString = JSON.stringify(savings);
      savingsString = savingsString.replace('&', '%26');
      route = route + '&savings=' + savingsString;
    }
    const savingsBlob = await runtime.apiCall(route);
    return savingsBlob;
  }

  static async _parameterTemplateBlob(fileName, context, runtime) {
    const route =
      'parameters?id_mode=' +
      context.idMode +
      '&id_region=' +
      context.idRegion +
      '&file_name=' +
      fileName;
    const templateBlob = await runtime.apiCall(route);
    return templateBlob;
  }

  static _defaultSavings(context) {
    const settings = context.settings;
    return settings.useDefaultSavings ? settings.defaultSavings : undefined;
  }

  static _validateAndConvertUploadedSavings(
    idMode,
    jsonData,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ) {
    const keyColumnHeaders = ColumnFactory.keyColumnHeadersForSavings();
    const headers = this._headersFromJsonRow(jsonData[0], keyColumnHeaders);
    const validationError = InputValidator.validateHeaders(
      headers,
      idMode,
      keyColumnHeaders
    );
    if (validationError) {
      const message = 'Invalid savings input format.\n' + validationError;
      alert(message);
    } else {
      const data = this._annualJsonTableToArrayOfArrays(jsonData, headers);
      const tableColumnsAndData = this._convertUploadedSavingData(
        idMode,
        headers,
        data,
        subsectorItems,
        actionTypeItems,
        actionTypeMapping
      );
      return tableColumnsAndData;
    }
  }

  static _validateAndConvertUploadedParameters(jsonData){ //, properties) {
    const data = {};
    for (const key in jsonData) {
      if (key === 'Options') {
        continue;
      }
      const entry = jsonData[key];
      data[key] = entry; // currently disabled for easy implementation of all sheets

      // this._validateAndConvertUploadedParameter(
      //  key,
      //  entry,
      //  properties
      // );
    }
    return data;
  }

  static _validateAndConvertUploadedParameter(
    parameterName,
    jsonData,
    properties
  ) {
    const context = properties.context;
    const idMode = context.idMode;
    const keyColumnHeaders =
      ColumnFactory.keyColumnHeadersForParameter(parameterName);
    if (keyColumnHeaders) {
      const headers = this._headersFromJsonRow(jsonData[0], keyColumnHeaders);
      const validationError = InputValidator.validateHeaders(
        headers,
        idMode,
        keyColumnHeaders
      );
      if (validationError) {
        const message = 'Invalid parameter input format.\n' + validationError;
        alert(message);
        return {};
      } else {
        const jsonWithNumericIds = DataFactory.convertUploadedParameter(
          idMode,
          headers,
          jsonData,
          properties
        );
        return jsonWithNumericIds;
      }
    } else {
      const message =
        'Parameter "' + parameterName + '" is not yet implemented.';
      console.warn(message);
      return [];
    }
  }

  static _headersFromJsonRow(jsonRow, keyColumnHeaders) {
    const headerStrings = Object.keys(jsonRow);
    const unsortedHeaders = this._convertNumericHeaderStrings(headerStrings);
    const remainingHeaders = unsortedHeaders.filter(
      header => !keyColumnHeaders.includes(header)
    );
    const headers = [...keyColumnHeaders, ...remainingHeaders];
    return headers;
  }

  static _annualJsonTableToArrayOfArrays(jsonData, headers) {
    const table = [headers];
    for (const jsonRow of jsonData) {
      const dataRow = headers.map(header => jsonRow[header]);
      table.push(dataRow);
    }
    return table;
  }

  static _convertNumericHeaderStrings(headerStrings) {
    const headers = [];
    for (const headerString of headerStrings) {
      const representsInteger = this._representsInteger(headerString);
      if (representsInteger) {
        const integer = Number.parseInt(headerString);
        headers.push(integer);
      } else {
        headers.push(headerString);
      }
    }
    return headers;
  }

  static _representsInteger(text) {
    const number = Number.parseFloat(text);
    return (
      typeof number === 'number' &&
      Number.isFinite(number) &&
      Math.floor(number) === number
    );
  }

  static _convertUploadedSavingData(
    idMode,
    headers,
    data,
    subsectorItems,
    actionTypeItems,
    actionTypeMapping
  ) {
    const firstAnnualIndex = ColumnFactory.numberOfKeyColumns();
    const filteredHeaders = Mode.filterHeadersForMode(idMode, headers, firstAnnualIndex);
    const columns = ColumnFactory.createColumns(
      filteredHeaders,
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );

    const tableData = DataFactory.createTableData(
      filteredHeaders,
      data,
      subsectorItems,
      actionTypeItems,
      actionTypeMapping
    );

    return {
      columns,
      data: tableData
    };
  }
}
/* eslint-enable max-lines */
