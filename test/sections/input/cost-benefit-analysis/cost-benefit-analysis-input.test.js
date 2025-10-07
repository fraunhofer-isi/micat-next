// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import CostBenefitAnalysisInput, {
  _CostBenefitAnalysisInput
} from '../../../../src/sections/input/cost-benefit-analysis/cost-benefit-analysis-input';
import CostBenefitAnalysisFacility
  from '../../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis-facility';

const userOptions = {
  parameters: {
    energyPriceSensivity: 100,
    investmentsSensivity: 100,
    discountRate: 3,
    year: 2030
  },
  indicators: {
    workforcePerformance: false,
    healthImpactsDueToImprovedIndoorClimate: false,
    healthImpactsDueToReducedAirPollution: false,
    workingDaysLost: false,
    aggregatedEnergySecurity: false,
    energySavings: false,
    savingsOnMaterialResources: false,
    impactOnResTargets: false,
    greenHouseGasSavings: false,
    reductionInAirPollutants: false
  }
};
describe('CostBenefitAnalysisInput', () => {
  it('construction', () => {
    spyOn(_CostBenefitAnalysisInput, 'initialUserOptions').and.returnValue(
      userOptions
    );
    spyOn(_CostBenefitAnalysisInput, 'updateUserOptions');
    spyOn(React, 'useState').and.returnValue([userOptions, jest.fn()]);
    const mockedUseEffect = jest.fn();
    spyOn(React, 'useEffect').and.callFake(mockedUseEffect);
    spyOn(CostBenefitAnalysisFacility, 'calculateCostBenefitAnalysisFacility');
    const mockedProperties = {
      userOptionsChanged: jest.fn(),
      savingsData: 'mockedSavingsData',
      lifetime: 'mockedLifetime',
      outdated: false
    };
    const result = CostBenefitAnalysisInput(mockedProperties);
    const changeFunction = mockedUseEffect.mock.calls[0][0];
    changeFunction();
    expect(result).toBeDefined();
    const numberInputs =
      result.props.children.props.children[0].props.children[1].props.children;
    for (const numberInput of numberInputs) {
      numberInput.props.change();
    }
    const checkboxInputs =
      result.props.children.props.children[1].props.children[1].props.children;
    for (const checkboxInput of checkboxInputs) {
      checkboxInput.props.change();
    }
  });
});

describe('_CostBenefitAnalysisInput', () => {
  it('initialialUserOptions', () => {
    const result = _CostBenefitAnalysisInput.initialUserOptions();
    expect(result).toBeDefined();
  });
  it('updateUserOptions', () => {
    const mockedSetUserOptions = jest.fn();
    const mockedChange = jest.fn();
    _CostBenefitAnalysisInput.updateUserOptions(
      userOptions,
      mockedSetUserOptions,
      'indicators',
      'workforcePerformance',
      true,
      mockedChange
    );
    const newUserOptions = mockedSetUserOptions.mock.calls[0][0];
    expect(newUserOptions.indicators.workforcePerformance).toBe(true);
    expect(mockedChange).toBeCalledWith(newUserOptions);
  });
});
