// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChartUtils } from '../../../src/components/charts/chart-utils';

describe('ChartUtils', () => {
  it('defaultColors', () => {
    const result = ChartUtils.defaultColors();
    expect(result).toBeDefined();
  });

  it('grid', () => {
    const result = ChartUtils.grid();
    expect(result).toBeDefined();
  });

  describe('legend', () => {
    it('without data', () => {
      const result = ChartUtils.legend([]);
      expect(result.show).toBe(false);
    });

    it('with data', () => {
      const mockedData = [
        'mocked_row',
        'mocked_row'
      ];
      const result = ChartUtils.legend(mockedData);
      expect(result.orient).toBe('vertical');
      expect(result.data).toStrictEqual(mockedData);
    });
  });

  describe('toolbox', () => {
    it('dataView disabled', () => {
      const result = ChartUtils.toolbox(false, true);
      expect(result.dataView).toBeUndefined();
    });
    it('magicType disabled', () => {
      const result = ChartUtils.toolbox(true, false);
      expect(result.magicType).toBeUndefined();
    });
    it('default configuration', () => {
      const result = ChartUtils.toolbox();
      expect(result).toBeDefined();
    });
  });

  it('optionToContent', () => {
    const mockedOption = {
      series: []
    };
    spyOn(ChartUtils, 'createDataTable').and.returnValue('mockedContent');
    const result = ChartUtils.optionToContent(mockedOption);
    expect(result).toBe('mockedContent');
  });

  it('createDataTable', () => {
    const mockedSeries = [];
    spyOn(ChartUtils, 'createSeriesParts').and.returnValue('<tr></tr>');
    const result = ChartUtils.createDataTable(mockedSeries);
    expect(result.slice(0, 6)).toBe('<table');
  });

  it('createSeriesParts', () => {
    const mockedSeries = [{}, {}];
    spyOn(ChartUtils, 'createSeriesRows').and.returnValue('<tr></tr>');
    const result = ChartUtils.createSeriesParts(mockedSeries);
    expect(result.slice(0, 4)).toBe('<tr>');
  });

  it('createSeriesRows', () => {
    const mockedSeriesPart = {
      name: 'mockedName',
      data: [['2020', 10.01], ['2025', 20.02]]
    };
    const result = ChartUtils.createSeriesRows(mockedSeriesPart);
    expect(result.slice(0, 4)).toBe('<tr>');
  });

  it('tooltip', () => {
    const result = ChartUtils.tooltip();
    expect(result).toBeDefined();
  });

  describe('typeChanged', () => {
    it('line', () => {
      const mockedModel = {
        getSeries: () => { return { length: 2 }; }
      };

      let passedOption;
      const mockedChart = {
        getModel: () => { return mockedModel; },
        setOption: (option) => { passedOption = option; }
      };
      const mockedEvent = {
        currentType: 'line'
      };

      ChartUtils.typeChanged(mockedChart, mockedEvent);
      const magicType = passedOption.toolbox.feature.magicType;
      expect(magicType.type).toStrictEqual(['bar']);
    });

    describe('bar', () => {
      const mockedEvent = {
        currentType: 'bar'
      };

      it('multiple series', () => {
        const mockedModel = {
          getSeries: () => { return { length: 2 }; }
        };

        let passedOption;
        const mockedChart = {
          getModel: () => { return mockedModel; },
          setOption: (option) => { passedOption = option; }
        };

        ChartUtils.typeChanged(mockedChart, mockedEvent);
        const magicType = passedOption.toolbox.feature.magicType;
        expect(magicType.type).toStrictEqual(['line', 'stack']);
      });

      it('single series', () => {
        const mockedModel = {
          getSeries: () => { return { length: 1 }; }
        };

        let passedOption;
        const mockedChart = {
          getModel: () => { return mockedModel; },
          setOption: (option) => { passedOption = option; }
        };

        ChartUtils.typeChanged(mockedChart, mockedEvent);
        const magicType = passedOption.toolbox.feature.magicType;
        expect(magicType.type).toStrictEqual(['line']);
      });
    });

    describe('stack', () => {
      const mockedEvent = {
        currentType: 'stack'
      };

      it('multiple series', () => {
        const mockedModel = {
          getSeries: () => { return { length: 2 }; }
        };

        let passedOption;
        const mockedChart = {
          getModel: () => { return mockedModel; },
          setOption: (option) => { passedOption = option; }
        };

        ChartUtils.typeChanged(mockedChart, mockedEvent);
        const magicType = passedOption.toolbox.feature.magicType;
        expect(magicType.type).toStrictEqual(['line', 'stack']);
      });

      it('single series', () => {
        const mockedModel = {
          getSeries: () => { return { length: 1 }; }
        };

        let passedOption;
        const mockedChart = {
          getModel: () => { return mockedModel; },
          setOption: (option) => { passedOption = option; }
        };

        ChartUtils.typeChanged(mockedChart, mockedEvent);
        const magicType = passedOption.toolbox.feature.magicType;
        expect(magicType.type).toStrictEqual(['line']);
      });
    });
  });

  it('title', () => {
    const result = ChartUtils.title('mockedTitle');
    expect(result).toBeDefined();
  });
  it('xAxis', () => {
    const result = ChartUtils.xAxis('mockedXAxisLabel');
    expect(result).toBeDefined();
  });
  it('yAxis', () => {
    spyOn(ChartUtils, 'formatTickLabel');
    const result = ChartUtils.yAxis('mockedYAxisLabel');
    result.axisLabel.formatter('mockedValue');
    expect(result).toBeDefined();
  });

  describe('tooltipFormatter', () => {
    it('should format tooltip with year ,legend name and value', () => {
      const dateString = '2025-01-01';

      const parameters = {
        value: [dateString, 123.456],
        seriesName: 'Mortality_AP'

      };
      jest.spyOn(Intl, 'NumberFormat').mockImplementation(() => ({
        format: () => '123.456'
      }));
      const result = ChartUtils.tooltipFormatter().formatter(parameters);
      expect(result).toBe('2025<br />Mortality_AP: 123.456');
    });
  });

  describe('formatTickLabel', () => {
    it('tick label > 1', () => {
      const mockedFormatter = {
        // eslint-disable-next-line unused-imports/no-unused-vars
        format: number => '10'
      };
      spyOn(Intl, 'NumberFormat').and.returnValue(mockedFormatter);
      const result = ChartUtils.formatTickLabel(10.000_003);
      expect(result).toBe('10');
    });
    it('tick label < 1 with many decimal places', () => {
      const mockedFormatter = {
        // eslint-disable-next-line unused-imports/no-unused-vars
        format: number => '1e-7'
      };
      spyOn(Intl, 'NumberFormat').and.returnValue(mockedFormatter);
      const result = ChartUtils.formatTickLabel(0.000_000_1);
      expect(result).toBe('1e-7');
    });
  });
  describe('countDecimalPlaces', () => {
    it('number is NaN', () => {
      const result = ChartUtils.countDecimalPlaces(Number.NaN);
      expect(result).toBe(0);
    });
    it('number with decimal places', () => {
      const result = ChartUtils.countDecimalPlaces(0.001_23);
      expect(result).toBe(5);
    });
  });

  describe('dataZoom', () => {
    const result = ChartUtils.dataZoom();
    expect(result).toBeDefined();
  });
});
