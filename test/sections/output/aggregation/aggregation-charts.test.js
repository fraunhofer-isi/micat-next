// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import AggregationCharts from '../../../../src/sections/output/aggregation/aggregation-charts';
import ChartUtils from '../../../../src/sections/output/chart-utils';

describe('AggregationCharts', () => {
  const mockedPlotData = {
    legend: [],
    rows: [
      ['2020', 10, 20, 30],
      ['2025', 40, 50, 60],
      ['2030', 70, 80, 90]
    ]
  };
  const mockedData = {
    reductionOfEnergyCost: mockedPlotData,
    reductionOfGreenHouseGasEmissionMonetization: mockedPlotData,
    impactOnResTargetsMonetization: mockedPlotData,
    impactOnGrossDomesticProduct: mockedPlotData,
    reductionOfMortalityMorbidityMonetization: mockedPlotData,
    reductionOfLostWorkDaysMonetization: mockedPlotData
  };
  const mockedProperties = {
    initialized: false,
    data: mockedData,
    chartsUnfolded: true,
    outdated: false
  };
  it('properties not initialized', () => {
    const result = AggregationCharts(mockedProperties);
    expect(result).toBeDefined();
  });
  it('properties initialized', () => {
    mockedProperties.initialized = true;
    spyOn(ChartUtils, 'prepareData').and.returnValue(mockedData);
    const result = AggregationCharts(mockedProperties);
    expect(result).toBeDefined();
  });
});
