// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import BarMekkoEChart, {
  _BarMekkoEChart
} from '../../../src/components/charts/bar-mekko-echart';
import { ChartUtils } from '../../../src/components/charts/chart-utils';

const mockedDataDimensionNames = ['from', 'to', 'height'];

describe('BarMekkoEChart', () => {
  beforeAll(() => {
    spyOn(_BarMekkoEChart, 'options');
  });
  it('construction with all properties', () => {
    const mockedProperties = {
      title: 'mockedTitle',
      'x-label': 'mockedXLabel',
      'y-label': 'mockedYLabel',
      data: {},
      dataDimensionNames: mockedDataDimensionNames,
      description: 'mockedDescription',
      width: 800,
      height: 400
    };
    const result = BarMekkoEChart(mockedProperties);
    expect(result).toBeDefined();
  });
  it('construction with default values', () => {
    const result = BarMekkoEChart({});
    expect(result).toBeDefined();
  });
});

describe('_BarMekkoEChart', () => {
  it('options', () => {
    spyOn(ChartUtils, 'xAxis');
    spyOn(ChartUtils, 'yAxis');
    spyOn(_BarMekkoEChart, 'series');
    spyOn(ChartUtils, 'dataZoom');
    spyOn(ChartUtils, 'grid');
    const result = _BarMekkoEChart.options(
      {},
      mockedDataDimensionNames,
      'mockedTitle',
      'mockedXLabel',
      'mockedYLabel'
    );
    expect(result).toBeDefined();
  });
  describe('labelLayout', () => {
    const mockedParameters = {
      rect: {
        x: 1,
        y: 1,
        width: 1,
        height: 1
      },
      dataIndex: 0
    };
    it('bar height is positive', () => {
      const mockedData = [{ value: [0, 1, 2] }];
      const result = _BarMekkoEChart.labelLayout(mockedParameters, mockedData);
      expect(result).toBeDefined();
    });
    it('bar height is negative', () => {
      const mockedData = [{ value: [0, 1, -2] }];
      const result = _BarMekkoEChart.labelLayout(mockedParameters, mockedData);
      expect(result).toBeDefined();
    });
  });
  describe('series', () => {
    let mockedItem;
    beforeAll(() => {
      mockedItem = [1, 5, 50, 'mockedDescription'];
      spyOn(ChartUtils, 'defaultColors').and.returnValue(['mockedColor']);
      spyOn(_BarMekkoEChart, 'renderItem');
      spyOn(_BarMekkoEChart, 'labelLayout');
      window.structuredClone = () => mockedItem;
    });
    it('bar has no width', () => {
      const result = _BarMekkoEChart.series(
        [[0, 0, 50, 'mockedDescription']],
        mockedDataDimensionNames
      );
      expect(result[0].data[0].value).toStrictEqual([0, 0, 0, 0, '']);
    });
    it('normal bar', () => {
      const result = _BarMekkoEChart.series(
        [mockedItem],
        mockedDataDimensionNames
      );
      result[0].renderItem('mockedParameters', 'mockedSeries');
      result[0].labelLayout('mockedParameters');
      expect(result[0].data[0].value).toStrictEqual([
        1,
        5,
        50,
        4,
        'mockedDescription'
      ]);
    });
  });
  describe('renderItem', () => {
    const mockedApi = {
      value: jest.fn().mockReturnValue(1),
      size: jest.fn().mockReturnValue(1),
      coord: jest.fn().mockReturnValue([1, 2]),
      visual: jest.fn()
    };
    it('y value > 0 and showHeight is true', () => {
      const result = _BarMekkoEChart.renderItem(
        'mockedParameters',
        mockedApi,
        true
      );
      expect(result).toBeDefined();
    });
    it('y value < 0 and showHeight is false', () => {
      mockedApi.value = jest.fn().mockReturnValue(-1);
      const result = _BarMekkoEChart.renderItem(
        'mockedParameters',
        mockedApi,
        false
      );
      expect(result).toBeDefined();
    });
  });
});
