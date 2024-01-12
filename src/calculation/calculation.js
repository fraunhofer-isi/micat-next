// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Runtime from '../server/runtime';

export default class Calculation {
  static async calculateIndicatorData(settings, idMode, idRegion, payload) {
    let message =
      'Calculating indicator data for mode ' +
      idMode +
      ', region ' +
      idRegion;
    if (payload.population){
      message += ' and population ' + payload.population;
    }

    console.log(message);

    const dataRoute =
      'indicator_data?id_mode=' + idMode + '&id_region=' + idRegion;

    console.log('Data route:', dataRoute);
    console.log('Payload:', payload);

    const runtime = new Runtime(settings);
    const data = await runtime.apiCall(
      dataRoute,
      payload,
      'application/json',
      'POST'
    );
    const convertedData = _Calculation.convert(data);
    return convertedData;
  }
}

export class _Calculation {
  static convert(data) {
    const dataset = structuredClone(data);
    const resultDataset = {};
    for (const indicatorName of Object.keys(dataset)) {
      const indicatorData = dataset[indicatorName];
      const yearColumnNames = indicatorData.yearColumnNames;
      const rows = this._toJson(indicatorData);
      let indicatorResult;
      if (indicatorName !== 'lifetime' && indicatorName !== 'subsidyRate') {
        const aggregations = this._aggregateIdMeasure(rows, yearColumnNames);
        indicatorResult = this._indicatorResult(aggregations, yearColumnNames);
      }
      resultDataset[indicatorName] = indicatorResult;
    }
    resultDataset.costBenefitAnalysisData =
      this._convertCostBenefitAnalysisData(data);
    return resultDataset;
  }

  static _convertCostBenefitAnalysisData(data) {
    const resultDataset = {};
    for (const indicatorName of Object.keys(data)) {
      const indicatorData = data[indicatorName];
      const header = [
        ...indicatorData.idColumnNames,
        ...indicatorData.yearColumnNames
      ];
      const table = this._arrayOfArraysToJson(indicatorData.rows, header);
      resultDataset[indicatorName] = table;
    }
    return resultDataset;
  }

  static _arrayOfArraysToJson(data, header) {
    let startSliceIndex = 0;
    if (!header) {
      header = data[0];
      startSliceIndex = 1;
    }
    const resultDataset = data.slice(startSliceIndex).map(item =>
      // eslint-disable-next-line unicorn/no-array-reduce
      item.reduce((object_, value, index) => {
        object_[header[index]] = value;
        return object_;
      }, {})
    );
    return resultDataset;
  }

  static _convertLifetimeParameters(lifetimeParameters) {
    const convertedLifetimeParameters = [];
    for (const lifetimeParameter of lifetimeParameters) {
      convertedLifetimeParameters.push({
        idMeasure: lifetimeParameter.idMeasure,
        lifetime: lifetimeParameter.data[0]
      });
    }
    return convertedLifetimeParameters;
  }

  static _aggregateIdMeasure(rows, years) {
    let legendEntries = rows.map(row => row.legendEntry);
    if (legendEntries[0] === undefined) {
      legendEntries = ['#default#'];
    }

    const aggregations = {};
    for (const legendEntry of legendEntries) {
      let rowsForLegendEntry = rows.filter(
        row => row.legendEntry === legendEntry
      );
      if (legendEntry === '#default#') {
        rowsForLegendEntry = rows;
      }
      const dataArray = rowsForLegendEntry.map(row => row.data);
      const sumOfDataArray = this._elementwiseSum(dataArray);
      const aggregation = {};
      for (const [index, year] of years.entries()) {
        aggregation[year] = sumOfDataArray[index];
      }
      aggregations[legendEntry] = aggregation;
    }
    return aggregations;
  }

  static _elementwiseSum(arrayOfArrays) {
    // eslint-disable-next-line unicorn/no-array-reduce
    return arrayOfArrays.reduce((accumulator, array) => {
      return accumulator.map((sum, index) => {
        return sum + array[index];
        // eslint-disable-next-line unicorn/no-array-method-this-argument
      }, Array.from({ length: arrayOfArrays[0].length }).fill(0));
    });
  }

  static _indicatorResult(aggregations, years) {
    const legend = Object.keys(aggregations);
    const rows = [];

    for (const year of years) {
      const row = [];
      row.push(year);
      for (const legendEntry of legend) {
        const annualValue = aggregations[legendEntry][year];
        row.push(annualValue);
      }
      rows.push(row);
    }

    return {
      legend,
      rows
    };
  }

  static _toJson(indicatorData) {
    const idColumnNames = indicatorData.idColumnNames;
    const hasIdMeasure = idColumnNames.includes('id_measure');
    const hasLegend = hasIdMeasure
      ? idColumnNames.length > 1
      : idColumnNames.length > 0;

    const rows = indicatorData.rows;

    const rowObjects = rows.map(row => {
      let idMeasure;
      if (hasIdMeasure) {
        idMeasure = row.splice(0, 1)[0];
      }

      let legendEntry = 'Value';
      if (hasLegend) {
        legendEntry = row.splice(0, 1)[0];
      }
      const data = row;

      return {
        idMeasure,
        legendEntry,
        data
      };
    });
    return rowObjects;
  }
}
