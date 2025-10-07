// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Economic from '../../../../src/sections/output/quantification/economic';

describe('main', () => {
  let result;
  beforeEach(() => {
    const mockedPlotData = {
      legend: [],
      rows: []
    };

    const mockedData = {
      additionalEmployment: mockedPlotData,
      addedAssetValueOfBuildings: mockedPlotData,
      changeInUnitCostsOfProduction: mockedPlotData,
      changeInSupplierDiversityByEnergyEfficiencyImpact: mockedPlotData,
      energyIntensity: mockedPlotData,
      impactOnGrossDomesticProduct: mockedPlotData,
      reductionOfImportDependency: mockedPlotData,
      turnoverOfEnergyEfficiencyGoods: mockedPlotData
    };

    const properties = {
      data: mockedData,
      description: jest.fn(),
      chartsUnfolded: true
    };

    result = new Economic(properties);
  });

  it('construction', () => {
    expect(result).toBeDefined();
  });
});
