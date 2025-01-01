// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import ChartSummary, {
  _ChartSummary
} from './../../../src/sections/output/chart-summary';
import DescriptionLoader from '../../../src/sections/output/description-loader';
import CostBenefitAnalysis from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis';

const mockedProperties = {};
const mockedIndicatorData = {};
const mockedInputIsInitialized = true;
const mockedInputIsStale = false;
const mockedChartsUnfolded = true;
const mockedSetChartsUnfolded = jest.fn();
const mockedDescription = jest.fn();
const mockedSetUserOptions = jest.fn();

describe('ChartSummary', () => {
  it('construction', () => {
    spyOn(React, 'useState').and.returnValues(
      [true, jest.fn()],
      ['mockedDescriptions', jest.fn()],
      [{}, jest.fn()],
      [{}, jest.fn()]
    );
    const mockedUseEffect = jest.fn();
    spyOn(React, 'useEffect').and.callFake(mockedUseEffect);
    spyOn(_ChartSummary, 'analysisModeTabs').and.returnValue(
      'mockedChartSummary'
    );
    spyOn(DescriptionLoader, 'useIfEnabled');
    spyOn(DescriptionLoader, 'getDescription').and.returnValue(
      'mockedDescriptions'
    );
    spyOn(_ChartSummary, 'calculateCostBenefitAnalysis');
    const result = ChartSummary(
      mockedProperties,
      mockedIndicatorData,
      mockedInputIsInitialized,
      mockedInputIsStale
    );
    const changeFunction = mockedUseEffect.mock.calls[0][0];
    changeFunction();
    expect(result).toBeDefined();
  });
});

describe('_ChartSummary', () => {
  it('calculateCostBenefitAnalysis', () => {
    spyOn(CostBenefitAnalysis, 'calculateCostBenefitAnalysis');
    const mockedSetCostBenefitAnalysis = jest.fn();
    _ChartSummary.calculateCostBenefitAnalysis(
      {},
      {},
      {},
      mockedSetCostBenefitAnalysis
    );
    expect(mockedSetCostBenefitAnalysis).toBeCalled();
  });
  it('description', () => {
    spyOn(DescriptionLoader, 'getDescription').and.returnValue(
      'mockedDescription'
    );
    const result = _ChartSummary.description('mockedDescriptions');
    const description = result('mockedKey');
    expect(typeof result).toBe('function');
    expect(description).toBe('mockedDescription');
  });
  it('analysisModeTabs', () => {
    spyOn(DescriptionLoader, 'getDescription');
    spyOn(_ChartSummary, 'toggleCollapseButton');
    spyOn(_ChartSummary, 'quantificationCharts');
    spyOn(_ChartSummary, 'monetizationCharts');
    spyOn(_ChartSummary, 'aggregationCharts');
    spyOn(_ChartSummary, 'costBenefitAnalysis');
    const result = _ChartSummary.analysisModeTabs(
      mockedProperties,
      mockedIndicatorData,
      mockedInputIsInitialized,
      mockedInputIsStale,
      mockedDescription,
      mockedChartsUnfolded,
      mockedSetChartsUnfolded,
      mockedSetUserOptions
    );
    expect(result).toBeDefined();
  });

  it('toggleCollapseButton', () => {
    const result = _ChartSummary.toggleCollapseButton(
      mockedChartsUnfolded,
      mockedSetChartsUnfolded
    );
    const setChartsUnfolded = result.props.onClick;
    setChartsUnfolded();
    expect(result).toBeDefined();
  });

  describe('costBenefitAnalysis', () => {
    it('without indicator data', () => {
      const result = _ChartSummary.costBenefitAnalysis();
      expect(result).toBeDefined();
    });
    it('with indicator data', () => {
      spyOn(_ChartSummary, '_convertUserOptions');
      const result = _ChartSummary.costBenefitAnalysis(
        {},
        false,
        {},
        jest.fn(),
        jest.fn(),
        false
      );
      const userOptionsChanged =
        result.props.children[0].props.userOptionsChanged;
      const description = result.props.children[1].props.description;
      userOptionsChanged();
      description('mockedKey');
      expect(result).toBeDefined();
    });
  });

  it('_convertUserOptions', () => {
    const mockedUserOptions = {
      parameters: {
        energyPriceSensivity: 100,
        investmentsSensivity: 100,
        discountRate: 100
      }
    };
    const mockedSetUserOptions = jest.fn();
    window.structuredClone = () => mockedUserOptions;
    _ChartSummary._convertUserOptions(mockedUserOptions, mockedSetUserOptions);
    for (const parameterName of Object.keys(mockedUserOptions.parameters)) {
      expect(mockedUserOptions.parameters[parameterName]).toBe(1);
    }
    expect(mockedSetUserOptions).toBeCalled();
  });

  it('aggregationCharts', () => {
    const result = _ChartSummary.aggregationCharts(
      mockedIndicatorData,
      mockedInputIsInitialized,
      mockedInputIsStale,
      mockedDescription,
      mockedChartsUnfolded
    );
    result.props.description('mockedKey');
    expect(result).toBeDefined();
  });

  it('monetizationCharts', () => {
    const result = _ChartSummary.monetizationCharts(
      mockedIndicatorData,
      mockedInputIsInitialized,
      mockedInputIsStale,
      mockedDescription,
      mockedChartsUnfolded
    );
    result.props.description('mockedKey');
    expect(result).toBeDefined();
  });

  it('quantificationCharts', () => {
    const result = _ChartSummary.quantificationCharts(
      mockedProperties,
      mockedIndicatorData,
      mockedInputIsInitialized,
      mockedInputIsStale,
      mockedDescription,
      mockedChartsUnfolded
    );
    result.props.description('mockedKey');
    expect(result).toBeDefined();
  });
});
