// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import CostBenefitAnalysis from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis';
import { SavingsInterpolation } from '../../../src/calculation/cost-benefit-analysis/data-interpolation';
import DataStructures from '../../../src/calculation/cost-benefit-analysis/data-structures';
import Parameters from '../../../src/calculation/cost-benefit-analysis/parameters';
import CostBenefitAnalysisFacility from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis-facility';
import NetPresentValue from '../../../src/calculation/cost-benefit-analysis/net-present-value';
import CostBenefitRatio from '../../../src/calculation/cost-benefit-analysis/cost-benefit-ratio';
import LevelisedCosts from '../../../src/calculation/cost-benefit-analysis/levelised-costs';
import FundingEfficiency from '../../../src/calculation/cost-benefit-analysis/funding-efficiency';
import MarginalCostCurves from '../../../src/calculation/cost-benefit-analysis/marginal-cost-curves';
import ObjectTools from '../../../src/calculation/object-tools';

describe('CostBenefitAnalysis', () => {
  it('undefined arguments', () => {
    const result = CostBenefitAnalysis.calculateCostBenefitAnalysis();
    expect(result).toBeUndefined();
  });
  it('defined arguments', () => {
    const mockedSaving = {
      id: 1,
      savings: {
        2020: 6,
        2021: 7,
        2022: 8
      }
    };
    const mockedIndicatorData = {};
    const mockedUserOptions = {};
    const mockedSavingsData = {
      measures: [
        mockedSaving
      ]
    };
    spyOn(SavingsInterpolation, 'annualSavingsInterpolation').and.returnValue(mockedSavingsData);
    spyOn(DataStructures, 'prepareResultDataStructure').and.returnValue({});
    spyOn(DataStructures, 'prepareMeasureSpecificResultsDataStructure');
    spyOn(DataStructures, 'appendMeasureSpecificResults');
    spyOn(Parameters, 'yearsFromSavingsData').and.returnValue([2020, 2021, 2022]);
    spyOn(Parameters, 'measureSpecificParameters');
    spyOn(Parameters, 'annualMeasureSpecificParameters');
    spyOn(CostBenefitAnalysisFacility, 'calculateCostBenefitAnalysisFacility');
    spyOn(NetPresentValue, 'calculateNetPresentValue');
    spyOn(CostBenefitRatio, 'calculateCostBenefitRatio');
    spyOn(LevelisedCosts, 'calculateLevelisedCosts');
    spyOn(FundingEfficiency, 'calculateFundingEfficiency');
    spyOn(MarginalCostCurves, 'calculateMarginalCostCurves');
    spyOn(ObjectTools, 'annualKeysAndValues').and.returnValue(mockedSaving.savings);
    const result = CostBenefitAnalysis.calculateCostBenefitAnalysis(
      mockedSavingsData,
      mockedIndicatorData,
      mockedUserOptions
    );
    expect(result.supportingYears).toStrictEqual(['2020', '2021', '2022']);
  });
});
