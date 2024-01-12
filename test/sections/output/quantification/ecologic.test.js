// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Ecologic from '../../../../src/sections/output/quantification/ecologic';

describe('main', () => {
  let result;
  beforeEach(() => {
    const mockedPlotData = {
      legend: [],
      rows: []
    };

    const mockedData = {
      reductionOfAdditionalCapacitiesInGrid: mockedPlotData,
      reductionOfAirPollution: mockedPlotData,
      reductionOfGreenHouseGasEmission: mockedPlotData,
      reductionOfEnergyCost: mockedPlotData,
      renewableEnergyDirectiveTargets: mockedPlotData,
      energySaving: mockedPlotData
    };

    const properties = {
      data: mockedData,
      description: jest.fn(),
      chartsUnfolded: true
    };

    result = new Ecologic(properties);
  });

  it('construction', () => {
    expect(result).toBeDefined();
  });
});
