// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export class ChartUtils {
  static defaultColors() {
    const defaultColors = [
      '#536ec4',
      '#90cb74',
      '#f9c757',
      '#ee6565',
      '#72bedd',
      '#39a171',
      '#fb8351',
      '#985fb3',
      '#e97aca'
    ];
    return defaultColors;
  }

  static grid() {
    const grid = {
      bottom: 60,
      right: '35%'
    };
    return grid;
  }

  static legend(data) {
    if (Array.isArray(data) && data.length < 2) {
      const legend = {
        show: false
      };
      return legend;
    }

    const legend = {
      orient: 'vertical',
      left: '66%',
      top: 'center',
      data
    };
    return legend;
  }

  static toolbox(enableDataView = true, enableMagicType = true) {
    const dataView = enableDataView
      ? {
          readOnly: false,
          optionToContent: this.optionToContent
        }
      : undefined;
    const magicType = enableMagicType ? { type: ['bar'] } : undefined;

    const toolbox = {
      feature: {
        saveAsImage: {},
        dataZoom: {
          show: true
        },
        dataView,
        magicType,
        brush: {
          type: 'rect'
        }
      },
      orient: 'horizontal',
      left: 40
    };
    return toolbox;
  }

  static optionToContent(option) {
    const series = option.series;
    const table = ChartUtils.createDataTable(series);
    return table;
  }

  static createDataTable(series) {
    const table = `<table style="width:100%; text-align:center">
      <tbody>
        ${ChartUtils.createSeriesParts(series)}
      </tbody>
    </table>`;
    return table;
  }

  static createSeriesParts(series) {
    let parts = '';
    for (const seriesPart of series) {
      parts += ChartUtils.createSeriesRows(seriesPart);
      parts += `<tr class="blank_row">
        <td style="height:10px"; colspan="2"></td>
      </tr>`;
    }
    return parts;
  }

  static createSeriesRows(seriesPart) {
    let rows = '';
    rows += `<tr>
      <td><b>Year</b></td>
      <td><b>${seriesPart.name}</b></td>
    </tr>`;
    for (const row of seriesPart.data) {
      rows += `<tr>
        <td>${row[0]}</td>
        <td>${row[1].toFixed(4)}</td>
      </tr>`;
    }
    return rows;
  }

  static tooltip() {
    const tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    };
    return tooltip;
  }

  static typeChanged(chart, event) {
    const hasSeveralSeries = chart.getModel().getSeries().length > 1;

    if (event.currentType === 'line') {
      chart.setOption({
        toolbox: {
          feature: {
            magicType: { type: ['bar'] }
          }
        }
      });
    }

    if (event.currentType === 'bar') {
      const types = ['line'];
      if (hasSeveralSeries) {
        types.push('stack');
      }

      chart.setOption({
        toolbox: {
          feature: {
            magicType: { type: types }
          }
        }
      });
    }

    if (event.currentType === 'stack') {
      const types = ['line'];
      if (hasSeveralSeries) {
        types.push('stack');
      }

      chart.setOption({
        toolbox: {
          feature: {
            magicType: { type: types }
          }
        }
      });
    }
  }

  static formatTickLabel(number) {
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });
    if (number < 1 && this.countDecimalPlaces(number) > 3) {
      formatter = Intl.NumberFormat('en', { notation: 'scientific' });
    }
    return formatter.format(number);
  }

  static countDecimalPlaces(value) {
    if (!Number.isFinite(value) || Number.isNaN(value)) {
      return 0;
    }
    let multiplicator = 1;
    let decimalPlaces = 0;
    while (Math.round(value * multiplicator) / multiplicator !== value) {
      multiplicator *= 10;
      decimalPlaces++;
    }
    return decimalPlaces;
  }

  static title(titleText) {
    const title = {
      text: titleText,
      x: 'center'
    };
    return title;
  }

  static xAxis(xAxisLabel, xAxisData, xAxisType = 'value') {
    const xAxis = {
      type: xAxisType,
      name: xAxisLabel,
      nameLocation: 'center',
      nameGap: 25,
      nameTextStyle: {
        padding: 1
      },
      axisLabel: {
        margin: 10,
        showMaxLabel: true,
        rotate: 0
      },
      data: xAxisData
    };
    return xAxis;
  }

  static yAxis(yAxisLabel, yAxisType = 'value') {
    const yAxis = {
      type: yAxisType,
      name: yAxisLabel,
      nameLocation: 'center',
      nameGap: 50,
      axisLabel: {
        formatter: value => ChartUtils.formatTickLabel(value)
      }
    };
    return yAxis;
  }

  static tooltipFormatter() {
    return {
      formatter: function(parameters) {
        const year = new Date(parameters.value[0]).getFullYear();
        const value = parameters.value[1];
        const legendName = parameters.seriesName;
        return `${year}<br />${legendName}: ${value.toFixed(3)}`;
      }

    };
  }

  static dataZoom() {
    const dataZoom_ = [
      {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'filter',
        height: 15,
        bottom: 5
      },
      {
        id: 'dataZoomY',
        type: 'slider',
        yAxisIndex: [0],
        filterMode: 'filter',
        width: 15,
        right: 15
      }
    ];
    return dataZoom_;
  }
}
