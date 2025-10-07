// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import ReactECharts from '../../../components/charts/react-echarts';
import SelectionInput from '../../../components/input/dropdown/selection-input';

export default function MonetizationSummary (properties) {
  const title = properties.title;
  const [year, setYear] = React.useState(properties.year);
  const summaryData = properties.summaryData;
  // const year = properties.year;
  const width = properties.width;
  const height = properties.height;
  const years = properties.summaryData[0].rows.map(row => row[0]);
  return (
    <>
      <SelectionInput
        label={'Overview year:'}
        options={years}
        defaultValue={years.at(-1)}
        change={(event, year) => setYear(year)}
      />
      <ReactECharts
          option={ _MonetizationSummary.option(summaryData, year, title) }
          width={ width }
          height={ height }
        />
    </>
  );
}

export class _MonetizationSummary {
  static yearSearchFn(element, year) {
    return element[0] === String(year);
  }

  static sortSummaryData(summaryData, year, order = 'descending') {
    summaryData.sort((a, b) => {
      const unitFactorA = a.unitFactor;
      const unitFactorB = b.unitFactor;
      a = a.rows.find((element) => this.yearSearchFn(element, year));
      b = b.rows.find((element) => this.yearSearchFn(element, year));
      a = a.slice(1);
      b = b.slice(1);
      const sumA = a.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * unitFactorA;
      const sumB = b.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * unitFactorB;
      if(order === 'descending') {
        return sumA < sumB ? 1 : -1;
      }
      return sumA < sumB ? -1 : 1;
    });
  }

  static option(summaryData, year, title) {
    if(!summaryData) {
      return;
    }
    this.sortSummaryData(summaryData, year);
    const option = {
      title: this._title(title),
      xAxis: this._xAxis(summaryData),
      legend: this._legend(),
      tooltip: this._tooltip(),
      yAxis: this._yAxis(),
      series: this._series(summaryData, year),
      grid: this._grid()
    };
    return option;
  }

  static _data(summaryData){
    return summaryData.map(data => data.title);
  }

  static _series(summaryData, year) {
    const series = [];
    for(let summaryIndex = 0; summaryIndex < summaryData.length; summaryIndex++) {
      const currentData = summaryData[summaryIndex];
      for(let legendIndex = 0; legendIndex < currentData.legend.length; legendIndex++) {
        const data = Array.from({ length: summaryData.length });
        let unitFactor = 1;
        if(currentData.unitFactor) {
          unitFactor = currentData.unitFactor;
        }
        const selectedYearRow = currentData.rows.find(row => row[0] === year.toString());
        if(selectedYearRow){
          const scaledYearValue = selectedYearRow[legendIndex + 1] * unitFactor;
          data[summaryIndex] = scaledYearValue;
          let name = currentData.legend[legendIndex];
          if(currentData.legend.length === 1) {
            name = currentData.title;
          }
          const seriesObject = {
            name,
            emphasis: {
              focus: 'series'
            },
            data,
            stack: 'stackbar',
            type: 'bar'
          };
          series.push(seriesObject);
        }
      }
    }
    return series;
  }

  static _title(title) {
    return {
      text: title,
      left: 'center'
    };
  }

  static _xAxis(summaryData) {
    return {
      type: 'category',
      data: this._data(summaryData),
      axisLabel: {
        margin: 10,
        showMaxLabel: true,
        rotate: 20,
        formatter: this._limitLengthOfTickLabel
      }
    };
  }

  static _limitLengthOfTickLabel(value){
    const maxLength = 45;
    const items = value.split(' ');
    let label = '';
    let itemCount = 0;
    for (const item of items){
      const newLength = label.length + item.length + 1;
      if (newLength < maxLength){
        label += ' ' + item;
        itemCount += 1;
      }
    }
    label = label.trim();
    if (itemCount < items.length){
      label += '...';
    }
    return label;
  }

  static _legend() {
    return {
      show: true,
      top: '6%'
    };
  }

  static _tooltip() {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    };
  }

  static _yAxis() {
    return {
      name: 'Value in M€',
      nameLocation: 'center',
      nameGap: 50,
      type: 'value'
    };
  }

  static _grid() {
    return {
      bottom: 0,
      top: '30%',
      containLabel: true
    };
  }
}
