// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SavingsInterpolation } from './data-interpolation';
import CostBenefitAnalysisFacility from './cost-benefit-analysis-facility';
import NetPresentValue from './net-present-value';
import CostBenefitRatio from './cost-benefit-ratio';
import DataStructures from './data-structures';
import Parameters from './parameters';
import LevelisedCosts from './levelised-costs';
import FundingEfficiency from './funding-efficiency';
import MarginalCostCurves from './marginal-cost-curves';
import ObjectTools from '../object-tools';

export default class CostBenefitAnalysis {
  static calculateCostBenefitAnalysis(savingsData, indicatorData, userOptions) {
    if (!savingsData || !indicatorData || !userOptions) {
      return;
    }
    const results = DataStructures.prepareResultDataStructure();
    const supportingYears = ObjectTools.annualKeysAndValues(
      savingsData.measures[0].savings
    );
    results.supportingYears = Object.keys(supportingYears);
    const interpolatedSavingsData =
      SavingsInterpolation.annualSavingsInterpolation(savingsData);
    const years = Parameters.yearsFromSavingsData(interpolatedSavingsData);

    for (const measure of interpolatedSavingsData.measures) {
      const measureSpecificResults =
        DataStructures.prepareMeasureSpecificResultsDataStructure(measure.id);
      const measureSpecificParameters = Parameters.measureSpecificParameters(
        measure,
        indicatorData,
        userOptions
      );

      for (const year of years) {
        const annualMeasureSpecificParameters =
          Parameters.annualMeasureSpecificParameters(year, measure);
        // Do not change the calculation order, because a calculation depends on the results of the previous one(s)!
        CostBenefitAnalysisFacility.calculateCostBenefitAnalysisFacility(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
        NetPresentValue.calculateNetPresentValue(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
        CostBenefitRatio.calculateCostBenefitRatio(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
        LevelisedCosts.calculateLevelisedCosts(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
        FundingEfficiency.calculateFundingEfficiency(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
        MarginalCostCurves.calculateMarginalCostCurves(
          measureSpecificParameters,
          annualMeasureSpecificParameters,
          measureSpecificResults,
          userOptions
        );
      }

      DataStructures.appendMeasureSpecificResults(
        measureSpecificResults,
        results
      );
    }
    return results;
  }
}
