// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dc from 'dc';
const chartMocks = {
  dc,
  data: [
    ['2020', 10],
    ['2025', 30],
    ['2030', 30]
  ],
  title: 'mockedTitle',
  'y-label': 'mockedYLabel',
  'x-label': 'mockedXLabel',
  legend: 'mockedLegend',
  colors: ['#F51414', '#A014F5'],
  description: 'mockedDescription'
};

export default chartMocks;
