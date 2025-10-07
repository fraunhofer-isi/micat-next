// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ReactECharts, {
  _ReactECharts
} from '../../../src/components/charts/react-echarts';
import React from 'react';
import * as echarts from 'echarts';
import { fireEvent, render } from '@testing-library/react';

describe('construction', () => {
  const mockedChartInstance = { on: jest.fn() };
  const mockedProperties = {
    option: {
      typeChanged: jest.fn()
    }
  };
  const event = new Event('magictypechanged', []);
  beforeEach(() => {
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(React, 'useRef').and.returnValue({
      current: {
        childMethod: jest.fn()
      }
    });
    spyOn(_ReactECharts, 'initializeECharts');
    spyOn(_ReactECharts, 'setOptions');
    spyOn(_ReactECharts, 'chartInstance').and.returnValue(mockedChartInstance);
    spyOn(_ReactECharts, 'showLoading');
  });
  it('with type changed', () => {
    const result = ReactECharts(mockedProperties);
    const onMagicTypeChanged = mockedChartInstance.on.mock.calls[0][1];
    onMagicTypeChanged(event);
    expect(result).toBeDefined();
  });
  it('without type changed', () => {
    delete mockedProperties.option.typeChanged;
    const result = ReactECharts(mockedProperties);
    const onMagicTypeChanged = mockedChartInstance.on.mock.calls[0][1];
    onMagicTypeChanged(event);
    expect(result).toBeDefined();
  });
});

describe('_ReactECharts', () => {
  describe('chartInstance', () => {
    it('chart reference undefined', () => {
      const result = _ReactECharts.chartInstance();
      expect(result).toBeUndefined();
    });
    it('current chart reference undefined', () => {
      _ReactECharts.chartReference = {
        current: undefined
      };
      const result = _ReactECharts.chartInstance();
      expect(result).toBeUndefined();
    });
    // it('chart reference defined', () => {
    //   _ReactECharts.chartReference = {
    //     current: jest.fn()
    //   };
    //   spyOn(echarts, 'getInstanceByDom').and.returnValue('mockedInstance');
    //   const result = _ReactECharts.chartInstance();
    //   expect(result).toBeDefined();
    // });
  });
  describe('initializeECharts', () => {
    const mockedRenderer = 'svg';
    const mockedTheme = {};
    it('undefined chart reference', () => {
      const mockedChartReference = {
        current: undefined
      };
      const result = _ReactECharts.initializeECharts(
        mockedChartReference,
        mockedRenderer,
        mockedTheme
      );
      expect(result).toBeUndefined();
    });
    it('defined chart reference and undefined renderer', () => {
      const mockedChartReference = {
        current: {
          childMethod: jest.fn()
        }
      };
      spyOn(_ReactECharts, 'resizeHandler').and.returnValue(
        'mockedResizeHandler'
      );
      spyOn(echarts, 'init');
      const result = _ReactECharts.initializeECharts(
        mockedChartReference,
        undefined,
        mockedTheme
      );
      expect(result).toBe('mockedResizeHandler');
    });
    it('defined chart reference and renderer', () => {
      const mockedChartReference = {
        current: {
          childMethod: jest.fn()
        }
      };
      spyOn(_ReactECharts, 'resizeHandler').and.returnValue(
        'mockedResizeHandler'
      );
      spyOn(echarts, 'init');
      const result = _ReactECharts.initializeECharts(
        mockedChartReference,
        mockedRenderer,
        mockedTheme
      );
      expect(result).toBe('mockedResizeHandler');
    });
  });
  describe('resizeHandler', () => {
    it('undefined chart', () => {
      const result = _ReactECharts.resizeHandler();
      expect(result).toBeDefined();
      result();
    });
    it('defined chart', () => {
      const mockedChart = {
        resize: jest.fn(),
        dispose: jest.fn()
      };
      const result = _ReactECharts.resizeHandler(mockedChart);
      expect(result).toBeDefined();
      result();
      expect(mockedChart.dispose).toBeCalled();
    });
    it('fires resize event on undefined chart', () => {
      _ReactECharts.resizeHandler();
      render(<ReactECharts option={{}} />);
      fireEvent.resize(window);
    });
    it('fires resize event on defined chart', () => {
      const mockedChart = {
        resize: jest.fn(),
        dispose: jest.fn()
      };
      _ReactECharts.resizeHandler(mockedChart);
      render(<ReactECharts option={{}} />);
      fireEvent.resize(window);
      expect(mockedChart.resize).toBeCalled();
    });
  });
  describe('setOptions', () => {
    it('defined chart', () => {
      const mockedChart = {
        setOption: jest.fn()
      };
      _ReactECharts.setOptions(mockedChart, 'mockedOption', 'mockedSettings');
      expect(mockedChart.setOption).toBeCalled();
    });
    it('undefined chart', () => {
      const mockedChart = {
        setOption: jest.fn()
      };
      _ReactECharts.setOptions(undefined, 'mockedOption', 'mockedSettings');
      expect(mockedChart.setOption).not.toBeCalled();
    });
  });
  describe('showLoading', () => {
    const mockedChart = {
      showLoading: jest.fn(),
      hideLoading: jest.fn()
    };
    it('chart undefined', () => {
      _ReactECharts.showLoading(undefined, true);
      expect(mockedChart.showLoading).not.toBeCalled();
      expect(mockedChart.hideLoading).not.toBeCalled();
    });
    it('show loading', () => {
      _ReactECharts.showLoading(mockedChart, true);
      expect(mockedChart.showLoading).toBeCalled();
    });
    it('hide loading', () => {
      _ReactECharts.showLoading(mockedChart, false);
      expect(mockedChart.hideLoading).toBeCalled();
    });
  });
});
