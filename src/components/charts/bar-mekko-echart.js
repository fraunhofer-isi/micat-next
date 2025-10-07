// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import ReactECharts from './react-echarts';
import styles from './echart.module.scss';
import { ChartUtils } from './chart-utils';

export default function BarMekkoEChart(properties) {
  const title = properties.title;
  const xLabel = properties['x-label'];
  const yLabel = properties['y-label'];

  const data = properties.data;
  const dataDimensionNames = properties.dataDimensionNames || [
    'from',
    'to',
    'height',
    'width'
  ];

  const description = properties.description;

  const width = properties.width || 800;
  const height = properties.height || 400;

  return (
    <div className={styles['chart-container']}>
      <div className={styles.chart}>
        <ReactECharts
          option={_BarMekkoEChart.options(
            data,
            dataDimensionNames,
            title,
            xLabel,
            yLabel
          )}
          width={width}
          height={height}
        />
      </div>
      <div className={styles['chart-description']}> {description}</div>
    </div>
  );
}

export class _BarMekkoEChart {
  static options(data, dataDimensionNames, title, xLabel, yLabel) {
    const options = {
      title: ChartUtils.title(title),
      tooltip: {},
      grid: ChartUtils.grid(),
      xAxis: ChartUtils.xAxis(xLabel),
      yAxis: ChartUtils.yAxis(yLabel),
      legend: ChartUtils.legend(),
      toolbox: ChartUtils.toolbox(false, false),
      series: this.series(data, dataDimensionNames),
      dataZoom: ChartUtils.dataZoom()
    };
    return options;
  }

  static labelLayout(parameters, data) {
    return {
      x: parameters.rect.x + parameters.rect.width / 2,
      y:
        data[parameters.dataIndex].value[2] <= 0
          ? parameters.rect.y + parameters.rect.height + 10
          : parameters.rect.y - 10,
      verticalAlign: 'middle',
      align: 'center'
    };
  }

  static series(rawData, dataDimensionNames) {
    const colorPalette = ChartUtils.defaultColors();
    const data = rawData.map((item, index) => {
      if (item[0] === item[1]) {
        return {
          value: [0, 0, 0, 0, ''],
          itemStyle: {}
        };
      }
      const width = item[1] - item[0];
      const newItem = structuredClone(item);
      newItem.splice(3, 0, width);
      return {
        value: newItem,
        itemStyle: {
          color: colorPalette[index % colorPalette.length]
        }
      };
    });
    const series_ = [
      {
        type: 'custom',
        renderItem: (parameters, series) =>
          this.renderItem(parameters, series, true),
        label: {
          show: true,
          position: 'inside',
          offset: [0, -15]
        },
        labelLayout: parameters => this.labelLayout(parameters, data),
        dimensions: dataDimensionNames,
        encode: {
          x: [0, 1],
          y: 2,
          tooltip: [0, 1, 2, 3],
          itemName: 4
        },
        data
      }
    ];
    return series_;
  }

  static renderItem(_parameters, api, showLabel) {
    const text = showLabel ? api.value(4) : undefined;
    const yValue = api.value(2);
    const start =
      yValue >= 0
        ? api.coord([api.value(0), yValue])
        : api.coord([api.value(0), 0]);
    const size = api.size([api.value(1) - api.value(0), yValue]);
    const renderItem_ = {
      type: 'rect',
      shape: {
        x: start[0],
        y: start[1],
        width: size[0],
        height: size[1]
      },
      style: {
        fill: api.visual('color'),
        fontFamily: 'Microsoft YaHei',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal',
        legacy: true,
        rich: undefined,
        text,
        textDistance: 5,
        textFill: '#333',
        textPosition: 'inside'
      }
    };
    return renderItem_;
  }
}
