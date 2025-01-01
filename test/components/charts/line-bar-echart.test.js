// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import LineBarEChart, {
  _LineBarEChart
} from '../../../src/components/charts/line-bar-echart';
import { ChartUtils } from '../../../src/components/charts/chart-utils';

describe('LineBarEchart', () => {
  const mockedProperties = {
    title: 'mockedTitle',
    xLabel: 'mockedXLabel',
    xAxisType: 'mockedXAxisType',
    yLabel: 'mockedYLabel',
    yAxisType: 'mockedYAxisType',
    legend: 'mockedLegend',
    chartType: 'mockedChartType',
    data: [[], []],
    description: 'mockedDescription',
    'unit-factor': 1,
    width: 400,
    height: 400
  };
  it('without x-Axis type', () => {
    spyOn(_LineBarEChart, 'options');
    spyOn(_LineBarEChart, 'multiplyNumbers');
    delete mockedProperties.xAxisType;
    const result = LineBarEChart(mockedProperties);
    mockedProperties.xAxisType = 'mockedXAxisType';
    expect(result).toBeDefined();
  });
  it('without unit factor', () => {
    spyOn(_LineBarEChart, 'options');
    delete mockedProperties['unit-factor'];
    const result = LineBarEChart(mockedProperties);
    mockedProperties['unit-factor'] = 'mockedXAxisType';
    expect(result).toBeDefined();
  });
  it('without chart type', () => {
    spyOn(_LineBarEChart, 'options');
    spyOn(_LineBarEChart, 'multiplyNumbers');
    delete mockedProperties.chartType;
    const result = LineBarEChart(mockedProperties);
    mockedProperties.chartType = 'mockedChartType';
    expect(result).toBeDefined();
  });
  it('without width and height', () => {
    spyOn(_LineBarEChart, 'options');
    spyOn(_LineBarEChart, 'multiplyNumbers');
    delete mockedProperties.width;
    delete mockedProperties.height;
    const result = LineBarEChart(mockedProperties);
    mockedProperties.width = 400;
    mockedProperties.height = 400;
    expect(result).toBeDefined();
  });
});

describe('_LineBarEChart', () => {
  it('multiplyNumbers', () => {
    spyOn(_LineBarEChart, 'multiplyIfNumber').and.returnValues(
      'mockedData',
      5,
      10
    );
    const result = _LineBarEChart.multiplyNumbers(['mockedData', 1, 2], 5);
    expect(result).toStrictEqual(['mockedData', 5, 10]);
  });
  describe('multiplyIfNumber', () => {
    it('string type', () => {
      const result = _LineBarEChart.multiplyIfNumber('mockedString', 5);
      expect(result).toBe('mockedString');
    });
    it('number type', () => {
      const result = _LineBarEChart.multiplyIfNumber(1, 5);
      expect(result).toEqual(5);
    });
  });
  describe('options', () => {
    beforeAll(() => {
      spyOn(ChartUtils, 'title');
      spyOn(ChartUtils, 'xAxis');
      spyOn(ChartUtils, 'yAxis');
      spyOn(_LineBarEChart, 'series');
      spyOn(ChartUtils, 'tooltip');
      spyOn(ChartUtils, 'toolbox');
      spyOn(ChartUtils, 'legend');
      spyOn(ChartUtils, 'grid');
      spyOn(ChartUtils, 'defaultColors');
      spyOn(ChartUtils, 'typeChanged');
    });
    it('with data array', () => {
      const result = _LineBarEChart.options(
        [[]],
        'mockedLegend',
        'mockedTitle',
        'mockedxLabel',
        'mockedXAxisType',
        'mockedYLabel',
        'mockedYAxisType'
      );
      result.typeChanged('mockedChart', 'mockedEvent');
      expect(result).toBeDefined();
    });
    it('with object data', () => {
      const result = _LineBarEChart.options(
        {},
        'mockedLegend',
        'mockedTitle',
        'mockedxLabel',
        'mockedXAxisType',
        'mockedYLabel',
        'mockedYAxisType'
      );
      expect(result).toBeDefined();
    });
  });
  it('series', () => {
    spyOn(_LineBarEChart, 'getArrayColumns');
    const mockedData = [[1, 2, 3]];
    const result = _LineBarEChart.series(
      mockedData,
      'mockedLegend',
      'mockedChartType'
    );
    expect(result).toBeDefined();
  });
  it('getArrayColumns', () => {
    const mockedArray = [[], [], []];
    const mockedColumnIndices = [1, 2, 3];
    const result = _LineBarEChart.getArrayColumns(
      mockedArray,
      mockedColumnIndices
    );
    expect(result).toBeDefined();
  });
});
