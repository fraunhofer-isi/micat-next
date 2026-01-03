// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
// import * as echarts from 'echarts';
// Explicitly specify the used components to reduce the bundle size
import * as echarts from 'echarts';

export default function ReactECharts(properties) {
  const style = properties.style;
  const theme = properties.theme;
  const option = properties.option;
  const typeChanged = option.typeChanged;
  const settings = properties.settings;
  const loading = properties.loading;
  const width = properties.width;
  const height = properties.height;
  const renderer = properties.renderer;

  const chartReference = React.useRef();

  React.useEffect(() => {
    return _ReactECharts.initializeECharts(chartReference, renderer, theme);
  }, [theme]);

  React.useEffect(() => {
    const chart = _ReactECharts.chartInstance(chartReference);
    _ReactECharts.setOptions(chart, option, settings);

    chart.on('magictypechanged', function(event) {
      if(typeChanged){
        typeChanged(chart, event);
      }
    });
  }, [option, settings, theme]);

  React.useEffect(() => {
    const chart = _ReactECharts.chartInstance();
    _ReactECharts.showLoading(chart, loading);
  }, [loading, theme]);

  return (
    <div
      ref={chartReference}
      style={{ width: width || '100%', height: height || '100%', ...style }}
    />
  );
}

export class _ReactECharts {
  static initializeECharts(chartReference, renderer, theme) {
    if (!chartReference.current) {
      return;
    }
    const chart = echarts.init(chartReference.current, theme, { renderer: renderer || 'svg' });
    return _ReactECharts.resizeHandler(chart);
  }

  static chartInstance(chartReference) {
    if(!chartReference || !chartReference.current) {
      return;
    }
    return echarts.getInstanceByDom(chartReference.current);
  }

  static resizeHandler(chart) {
    function resizeChart() {
      if(!chart) {
        return;
      }
      chart.resize({ width: 'auto', height: 'auto' });
    }
    window.addEventListener('resize', resizeChart);
    return () => {
      if(chart) {
        chart.dispose();
      }
      window.removeEventListener('resize', resizeChart);
    };
  }

  static setOptions(chart, option, settings) {
    if(!chart) {
      return;
    }
    chart.setOption(option, settings);
  }

  static showLoading(chart, loading) {
    if (!chart) {
      return;
    }
    loading === true ? chart.showLoading() : chart.hideLoading();
  }
}
