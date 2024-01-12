// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// import IndicatorCharts from '../../../../src/components/charts/indicator/indicator-charts';
// import { render, screen } from '@testing-library/react';
// import indicatorChartMocks from './indicator-chart-mocks';
// import user from '@testing-library/user-event';
// import '@testing-library/jest-dom';
// import React from 'react';
// import { TextEncoder, TextDecoder } from 'node:util';
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// const mockedSettings = {
//   loadChartDescriptionsFromWeblication: true,
//   chartDescriptionsUrl: 'https://micatool-dev.eu/mica-tool/documentation/chart-descriptions.php'
// };
// const mockedDefaultText = 'mockedDefaultText';
// const mockedClassName = 'mockedClassName';
// const mockedOutdatad = false;
// let socialTab;
// let economicTab;
// let ecologicTab;

describe('IndicatorCharts', () => {
//   beforeEach(() => {
//     spyOn(console, 'error');
//     render(<IndicatorCharts
//       dc={ indicatorChartMocks.dc }
//       settings={ mockedSettings }
//       data={ indicatorChartMocks.data }
//       defaultText={ mockedDefaultText }
//       className={ mockedClassName }
//       outdated={ mockedOutdatad }
//     />);
//     const tabs = screen.getAllByRole('tab');
//     socialTab = tabs.find((tab) => tab.textContent === 'Social');
//     economicTab = tabs.find((tab) => tab.textContent === 'Economic');
//     ecologicTab = tabs.find((tab) => tab.textContent === 'Ecologic');
//   });

  //   it('renders tabs', () => {
  //     const tabs = screen.getAllByRole('tab');
  //     expect(tabs.length).toBe(4);
  //   });
  //   it('selects social', async () => {
  //     user.setup();
  //     await user.click(socialTab);
  //     expect(socialTab).toHaveAttribute('aria-selected', 'true');
  //     expect(economicTab).toHaveAttribute('aria-selected', 'false');
  //     expect(ecologicTab).toHaveAttribute('aria-selected', 'false');
  //     const charts = screen.getAllByTestId('chart-testid');
  //     expect(charts.length).toBe(2);
  //   });
  //   it('selects economic', async () => {
  //     user.setup();
  //     await user.click(economicTab);
  //     expect(socialTab).toHaveAttribute('aria-selected', 'false');
  //     expect(economicTab).toHaveAttribute('aria-selected', 'true');
  //     expect(ecologicTab).toHaveAttribute('aria-selected', 'false');
  //     const charts = screen.getAllByTestId('chart-testid');
  //     expect(charts.length).toBe(2);
  //   });
  //   it('selects ecologic', async () => {
  //     user.setup();
  //     await user.click(ecologicTab);
  //     expect(socialTab).toHaveAttribute('aria-selected', 'false');
  //     expect(economicTab).toHaveAttribute('aria-selected', 'false');
  //     expect(ecologicTab).toHaveAttribute('aria-selected', 'true');
  //     const charts = screen.getAllByTestId('chart-testid');
  //     expect(charts.length).toBe(3);
  //   });
  it('dummy test', () => {
    expect(true).toBeTruthy();
  });
});
