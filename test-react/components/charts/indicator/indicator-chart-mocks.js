// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dc from 'dc';

const mockedData = [
  ['2020', 10],
  ['2025', 30],
  ['2030', 30]
];
const mockedLegend = 'mockedLegend';
const mockedChartData = {
  legend: mockedLegend,
  rows: mockedData
};

const indicatorChartMocks = {
  dc,
  data: {
    reductionOfAirPollution: mockedChartData,
    reductionOfGreenHouseGasEmission: mockedChartData,
    reductionOfImportDependency: mockedChartData,
    energyIntensity: mockedChartData,
    energySaving: mockedChartData,
    reductionOfMortalityMorbidity: mockedChartData,
    reductionOfLostWorkDays: mockedChartData,
    reductionOfLostWorkDaysMonetization: mockedChartData
  },
  description: () => { return 'mockedDescription'; }
};

export default indicatorChartMocks;
