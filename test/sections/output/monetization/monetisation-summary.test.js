// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import MonetizationSummary, {
  _MonetizationSummary
} from '../../../../src/sections/output/monetization/monetization-summary';

const mockedSummaryData = [
  {
    legend: 'mockedLegend',
    rows: [
      ['2020', 10, 20, 30],
      ['2025', 40, 50, 60],
      ['2030', 70, 80, 90]
    ],
    unitFactor: 1
  },
  {
    legend: 'mockedLegend',
    rows: [
      ['2020', 100, 200, 300],
      ['2025', 400, 500, 600],
      ['2030', 700, 800, 900]
    ],
    unitFactor: 1
  }
];

describe('MonetizationSummary', () => {
  it('main', () => {
    spyOn(React, 'useState').and.returnValue([2030, jest.fn()]);
    const mockedProperties = {
      title: 'mockedTitle',
      year: 2030,
      height: 400,
      summaryData: mockedSummaryData
    };
    spyOn(_MonetizationSummary, 'option');
    const result = MonetizationSummary(mockedProperties);
    result.props.children[0].props.change();
    expect(result).toBeDefined();
  });
});

describe('_MonetizationSummary', () => {
  it('yearSearchFn', () => {
    const mockedElement = ['2020'];
    const result = _MonetizationSummary.yearSearchFn(mockedElement, 2020);
    expect(result).toBeTruthy();
  });

  describe('sortSummaryData', () => {
    it('descending order sumA < sumB', () => {
      spyOn(_MonetizationSummary, 'yearSearchFn').and.returnValues(['2030', 70, 80, 90], ['2030', 700, 800, 900]);
      _MonetizationSummary.sortSummaryData(mockedSummaryData, 2030);
    });
    it('descending order sumA > sumB', () => {
      spyOn(_MonetizationSummary, 'yearSearchFn').and.returnValues(['2030', 700, 800, 900], ['2030', 70, 80, 90]);
      _MonetizationSummary.sortSummaryData(mockedSummaryData, 2030);
    });
    it('ascending order sumA < sumB', () => {
      spyOn(_MonetizationSummary, 'yearSearchFn').and.returnValues(['2030', 70, 80, 90], ['2030', 700, 800, 900]);
      _MonetizationSummary.sortSummaryData(mockedSummaryData, 2030, 'ascending');
    });
    it('ascending order sumA > sumB', () => {
      spyOn(_MonetizationSummary, 'yearSearchFn').and.returnValues(['2030', 700, 800, 900], ['2030', 70, 80, 90]);
      _MonetizationSummary.sortSummaryData(mockedSummaryData, 2030, 'ascending');
    });
  });

  describe('option', () => {
    it('without summaryData', () => {
      const result = _MonetizationSummary.option(undefined, 2030, 'mockedTitle');
      expect(result).toBeUndefined();
    });
    it('wit summaryData', () => {
      spyOn(_MonetizationSummary, '_title');
      spyOn(_MonetizationSummary, '_xAxis');
      spyOn(_MonetizationSummary, '_legend');
      spyOn(_MonetizationSummary, '_tooltip');
      spyOn(_MonetizationSummary, '_yAxis');
      spyOn(_MonetizationSummary, '_series');
      spyOn(_MonetizationSummary, '_grid');
      spyOn(_MonetizationSummary, 'sortSummaryData');
      const result = _MonetizationSummary.option(mockedSummaryData, 2030, 'mockedTitle');
      expect(result).toBeDefined();
    });
  });

  it('_data', () => {
    const result = _MonetizationSummary._data(mockedSummaryData);
    expect(result).toBeDefined();
  });

  describe('_series', () => {
    it('with unit factor', () => {
      const result = _MonetizationSummary._series(mockedSummaryData, 2030);
      expect(result).toBeDefined();
    });

    it('without unit factor', () => {
      delete mockedSummaryData[0].unitFactor;
      const result = _MonetizationSummary._series(mockedSummaryData, 2030);
      expect(result).toBeDefined();
      mockedSummaryData[0].unitFactor = 1;
    });

    it('year not in data', () => {
      const result = _MonetizationSummary._series(mockedSummaryData, 2050);
      expect(result).toBeDefined();
    });

    it('legend === 1', () => {
      mockedSummaryData[0].legend = 'a';
      const result = _MonetizationSummary._series(mockedSummaryData, 2030);
      expect(result).toBeDefined();
      mockedSummaryData[0].legend = 'mockedLegend';
    });
  });

  it('title', () => {
    const result = _MonetizationSummary._title('mockedTitle');
    expect(result).toBeDefined();
  });

  it('_xAxis', () => {
    const result = _MonetizationSummary._xAxis(mockedSummaryData);
    expect(result).toBeDefined();
  });

  describe('_limitLengthOfTickLabel', () => {
    it('short label', () => {
      const mockedLabel = 'This is a label';
      const result = _MonetizationSummary._limitLengthOfTickLabel(mockedLabel);
      expect(result.length).toBe(15);
    });
    it('too long label', () => {
      const mockedLabel = 'This is a very veery veeery veeeery veeeeery loooooong label';
      const result = _MonetizationSummary._limitLengthOfTickLabel(mockedLabel);
      expect(result.length).toBe(44);
    });
  });

  it('_legend', () => {
    const result = _MonetizationSummary._legend();
    expect(result).toBeDefined();
  });

  it('_tooltip', () => {
    const result = _MonetizationSummary._tooltip();
    expect(result).toBeDefined();
  });

  it('_yAxis', () => {
    const result = _MonetizationSummary._yAxis();
    expect(result).toBeDefined();
  });

  it('_grid', () => {
    const result = _MonetizationSummary._grid();
    expect(result).toBeDefined();
  });
});
