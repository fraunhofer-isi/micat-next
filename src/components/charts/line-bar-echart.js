// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import ReactECharts from './react-echarts';
import styles from './echart.module.scss';
import { ChartUtils } from './chart-utils';

export default function LineBarEChart(properties) {
  const title = properties.title;
  const xLabel = properties['x-label'];
  const xAxisData = properties.xAxisData;

  let xAxisType = 'time';
  if (properties.xAxisType) {
    xAxisType = properties.xAxisType;
  }

  const yLabel = properties['y-label'];
  const yAxisType = properties.yAxisType;
  const legend = properties.legend;

  let data = properties.series ?? properties.data;
  if (properties['unit-factor'] && properties.data) {
    const unitFactor = properties['unit-factor'];
    data = data.map(row => _LineBarEChart.multiplyNumbers(row, unitFactor));
  }

  const description = properties.description;
  let chartType = 'line';
  if (properties.chartType) {
    chartType = properties.chartType;
  }

  let width = 800;
  if (properties.width) {
    width = properties.width;
  }
  let height = 450;
  if (properties.height) {
    height = properties.height;
  }

  return (
    <div className={styles['chart-container']}>
      <div className={styles.chart}>
        <ReactECharts
          option={_LineBarEChart.options(
            data,
            legend,
            title,
            xLabel,
            xAxisData,
            xAxisType,
            yLabel,
            yAxisType,
            chartType
          )}
          width={width}
          height={height}
        />
      </div>
      <div className={styles['chart-description']}> {description}</div>
    </div>
  );
}

export class _LineBarEChart {
  static multiplyNumbers(row, factor) {
    const newRow = row.map(entry => this.multiplyIfNumber(entry, factor));
    return newRow;
  }

  static multiplyIfNumber(value, factor) {
    return typeof value === 'string' ? value : value * factor;
  }

  static options(
    data,
    legend,
    title,
    xLabel,
    xAxisData,
    xAxisType,
    yLabel,
    yAxisType,
    chartType
  ) {
    const series_ = Array.isArray(data[0])
      ? this.series(data, legend, chartType)
      : data;
    const options = {
      title: ChartUtils.title(title),
      xAxis: ChartUtils.xAxis(xLabel, xAxisData, xAxisType),
      yAxis: ChartUtils.yAxis(yLabel, yAxisType),
      series: series_,
      tooltip: ChartUtils.tooltipFormatter(),
      toolbox: ChartUtils.toolbox(),
      legend: ChartUtils.legend(legend),
      grid: ChartUtils.grid(),
      color: ChartUtils.defaultColors(),
      typeChanged: (chart, event) => ChartUtils.typeChanged(chart, event)
    };
    return options;
  }

  static series(data, legend, chartType) {
    const lines = [];
    for (let columnIndex = 1; columnIndex < data[0].length; columnIndex++) {
      const lineData = this.getArrayColumns(data, [0, columnIndex]);
      lines.push({
        name: legend[columnIndex - 1],
        data: lineData,
        type: chartType
      });
    }
    return lines;
  }

  static getArrayColumns(array, columnIndices) {
    const columns = array.map(row => columnIndices.map(index => row[index]));
    return columns;
  }
}
