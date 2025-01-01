// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// eslint-disable-next-line max-len
import CostBenefitAnalysisCharts, {
  _CostBenefitAnalysisCharts
} from '../../../../src/sections/output/cost-benefit-analysis/cost-benefit-analysis-charts';

describe('CostBenefitAnalysisCharts', () => {
  describe('construction', () => {
    beforeAll(() => {
      spyOn(_CostBenefitAnalysisCharts, 'costBenefitAnalysisFacility');
      spyOn(_CostBenefitAnalysisCharts, 'netPresentValue');
      spyOn(_CostBenefitAnalysisCharts, 'costBenefitRatio');
      spyOn(_CostBenefitAnalysisCharts, 'levelisedCosts');
      spyOn(_CostBenefitAnalysisCharts, 'fundingEfficiency');
      spyOn(_CostBenefitAnalysisCharts, 'marginalCostCurves');
    });
    it('without data', () => {
      const result = CostBenefitAnalysisCharts({});
      expect(result).toBeDefined();
    });
    it('with undefined cost-benefit analysis data', () => {
      const mockedProperties = {
        costBenefitAnalysisData: {
          mockedData: undefined
        }
      };
      const result = CostBenefitAnalysisCharts(mockedProperties);
      expect(result).toBeDefined();
    });
    it('with data', () => {
      const mockedProperties = {
        costBenefitAnalysisData: {
          mockedData: { 2020: 10 }
        }
      };
      const result = CostBenefitAnalysisCharts(mockedProperties);
      expect(result).toBeDefined();
    });
  });
});

const mockedLineChartData = {
  2020: 10,
  2025: 20
};
const mockedBarMekkoChartData = [
  {
    id_measure: 1,
    data: {}
  }
];
const mockedCostBenefitAnalysisData = {
  costBenefitAnalysisFacility: {
    newEnergySavings: mockedLineChartData,
    newInvestments: mockedLineChartData
  },
  netPresentValue: {
    netPresentValues: mockedLineChartData,
    annuatisedEnergyCosts: mockedLineChartData,
    annuatisedMultipleImpacts: mockedLineChartData
  },
  costBenefitRatio: {
    costBenefitRatios: mockedLineChartData,
    benefitCostRatios: mockedLineChartData
  },
  levelisedCosts: {
    levelisedCostsOfSavedEnergies: mockedLineChartData,
    levelisedCostsOfSavedCo2: mockedLineChartData
  },
  fundingEfficiency: {
    fundingEfficiencyOfEnergySavings: mockedLineChartData,
    fundingEfficiencyOfCo2Reductions: mockedLineChartData
  },
  marginalCostCurves: {
    marginalEnergySavingsCostCurves: mockedBarMekkoChartData,
    marginalCo2SavingsCostCurves: mockedBarMekkoChartData
  }
};

describe('_CostBenefitAnalysisCharts', () => {
  describe('chart construction', () => {
    const mockedProperties = {
      chartsUnfolded: true,
      description: jest.fn(),
      userOptions: {
        parameters: {
          year: '2020'
        }
      }
    };
    beforeAll(() => {
      spyOn(
        _CostBenefitAnalysisCharts,
        'convertDataForLineChart'
      ).and.returnValue({});
    });
    it('marginalCostCurves', () => {
      spyOn(
        _CostBenefitAnalysisCharts,
        'convertDataForBarMekkoChart'
      ).and.returnValue({});
      const result = _CostBenefitAnalysisCharts.marginalCostCurves(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
    it('fundingEfficiency', () => {
      const result = _CostBenefitAnalysisCharts.fundingEfficiency(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
    it('levelisedCosts', () => {
      const result = _CostBenefitAnalysisCharts.levelisedCosts(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
    it('costBenefitRatio', () => {
      const result = _CostBenefitAnalysisCharts.costBenefitRatio(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
    it('netPresentValue', () => {
      const result = _CostBenefitAnalysisCharts.netPresentValue(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
    it('costBenefitAnalysisFacility', () => {
      const result = _CostBenefitAnalysisCharts.costBenefitAnalysisFacility(
        mockedProperties,
        mockedCostBenefitAnalysisData
      );
      expect(result).toBeDefined();
    });
  });
  describe('convertDataForLineChart', () => {
    const mockedData = [
      {
        id_measure: 1,
        data: {
          2020: 10,
          2025: 20,
          2030: 30
        }
      }
    ];
    beforeAll(() => {
      window.structuredClone = () => mockedData[0].data;
    });
    it('all years', () => {
      // spyOn(ObjectTools, 'zipKeysAndValues').and.returnValue([[]]);
      const result =
        _CostBenefitAnalysisCharts.convertDataForLineChart(mockedData);
      expect(typeof result[0]).toStrictEqual('object');
      expect(result[0].data.length).toStrictEqual(3);
    });
    it('selection of years', () => {
      const result = _CostBenefitAnalysisCharts.convertDataForLineChart(
        mockedData,
        ['2020']
      );
      expect(typeof result[0]).toStrictEqual('object');
      expect(result[0].data.length).toStrictEqual(1);
    });
  });
  describe('convertDataForBarMekkoChart', () => {
    const mockedData = [
      {
        id_measure: 1,
        data: {
          2020: { barWidth: 10, barHeight: 20 },
          2025: { barWidth: 10, barHeight: 40 },
          2030: { barWidth: 10, barHeight: 50 }
        }
      },
      {
        id_measure: 2,
        data: {
          2020: { barWidth: 20, barHeight: 30 },
          2025: { barWidth: 20, barHeight: 60 },
          2030: { barWidth: 20, barHeight: 90 }
        }
      },
      {
        id_measure: 3,
        data: {
          2020: { barWidth: 30, barHeight: 10 },
          2025: { barWidth: 30, barHeight: 5 },
          2030: { barWidth: 30, barHeight: 0 }
        }
      }
    ];
    it('data sorted with default parameter', () => {
      const result = _CostBenefitAnalysisCharts.convertDataForBarMekkoChart(
        mockedData,
        2020
      );
      expect(result[0][2]).toStrictEqual(30);
    });
    it('data not sorted', () => {
      const result = _CostBenefitAnalysisCharts.convertDataForBarMekkoChart(
        mockedData,
        2020,
        false
      );
      expect(result[0][2]).toStrictEqual(30);
    });
    it('year not present', () => {
      const result = _CostBenefitAnalysisCharts.convertDataForBarMekkoChart(
        mockedData,
        2021,
        false
      );
      expect(result.length).toBe(0);
    });
  });
});
