// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import MonetizationCharts from '../../../../src/sections/output/monetization/monetization-charts';

const mockedPlotData = {
  legend: [],
  title: 'mocked_title',
  rows: [
    ['id_subsector', 'id_action_type', 2020, 2025, 2030],
    [1, 2, 10, 20, 30]
  ]
};

const mockedData = {
  reductionOfLostWorkDaysMonetization: mockedPlotData,
  reductionOfGreenHouseGasEmissionMonetization: mockedPlotData,
  reductionOfEnergyCost: mockedPlotData,
  reductionOfMortalityMorbidityMonetization: mockedPlotData,
  impactOnResTargetsMonetization: mockedPlotData,
  impactOnGrossDomesticProduct: mockedPlotData,
  addedAssetValueOfBuildings: mockedPlotData,
  reductionOfAdditionalCapacitiesInGridMonetization: mockedPlotData
};

const mockedProperties = {
  data: mockedData,
  description: () => {},
  initialized: false,
  outdated: false,
  chartsUnfolded: false
};

describe('MonetizationCharts', () => {
  it('not initialized', () => {
    const result = new MonetizationCharts(mockedProperties);
    expect(result).toBeDefined();
  });

  it('initialized', () => {
    mockedProperties.initialized = true;
    const result = new MonetizationCharts(mockedProperties);
    expect(result).toBeDefined();
  });
});
