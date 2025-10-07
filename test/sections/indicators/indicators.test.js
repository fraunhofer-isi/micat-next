// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable unicorn/consistent-function-scoping */
import React from 'react';
import Calculation from '../../../src/calculation/calculation';
import Indicators, { _Indicators } from '../../../src/sections/indicators/indicators';
import * as ChartSummary from '../../../src/sections/output/chart-summary';

it('construction', () => {
  spyOn(_Indicators, 'input').and.returnValue('mocked_input');
  spyOn(_Indicators, 'chartSummary').and.returnValue('mocked_chart_summary');
  spyOn(React, 'useState').and.returnValue(['mocked_attribute', 'mocked_setter']);
  const result = Indicators('mocked_properties');
  expect(result).toBeDefined();
});

describe('_Indicators', () => {
  it('input', () => {
    const properties = {
      router: 'mocked_router'
    };
    const mockedSetIndicatorData = jest.fn();
    const mockedSetInputIsInitialized = jest.fn();
    const mockedSetInputIsStale = jest.fn();
    const result = _Indicators.input(
      properties,
      'mocked_indicatorData',
      mockedSetIndicatorData,
      'mocked_inputIsInitialized',
      mockedSetInputIsInitialized,
      'mocked_inputIsStale',
      mockedSetInputIsStale
    );
    expect(result).toBeDefined();

    const change = result.props.change;
    spyOn(_Indicators, '_inputChanged');
    change();
    expect(_Indicators._inputChanged).toHaveBeenCalled();

    const staleHandler = result.props.staleHandler;
    staleHandler();
  });

  it('chartSummary', () => {
    spyOn(ChartSummary, 'default').and.returnValue('mocked_chartSummary');
    const result = _Indicators.chartSummary(
      'mocked_properties',
      'mocked_indicatorData',
      'mocked_inputIsInitialized',
      'mocked_inputIsStale'
    );
    expect(result).toBeDefined();
  });

  it('_inputChanged', async () => {
    const properties = {
      settings: 'mocked_settings',
      idRegion: 'mocked_idRegion',
      idMode: 1
    };

    const mockedSetIndicatorData = () => {};
    const mockedSetInputIsInitialized = () => {};
    const mockedSetSavingsData = () => {};

    spyOn(Calculation, 'calculateIndicatorData');
    await _Indicators._inputChanged(
      'mocked_idRegion',
      {},
      properties,
      mockedSetIndicatorData,
      mockedSetInputIsInitialized,
      mockedSetSavingsData
    );
    expect(Calculation.calculateIndicatorData).toHaveBeenCalled();
  });
});
/* eslint-enable unicorn/consistent-function-scoping */
