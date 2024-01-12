// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Social from '../../../../src/sections/output/quantification/social';

describe('main', () => {
  let result;
  beforeEach(() => {
    const mockedPlotData = {
      legend: [],
      rows: []
    };

    const mockedData = {
      reductionOfMortalityMorbidity: mockedPlotData,
      reductionOfLostWorkDays: mockedPlotData,
      alleviationOfEnergyPovertyM2: mockedPlotData
    };

    const properties = {
      data: mockedData,
      description: () => {},
      chartsUnfolded: true
    };

    result = new Social(properties);
  });

  it('construction', () => {
    expect(result).toBeDefined();
  });
});
