// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Calculation, { _Calculation } from '../../src/calculation/calculation';
import Runtime from '../../src/server/runtime';

describe('public API', () => {

  describe('calculateIndicatorData', ()=>{
    it('withoutPopulation', async () => {
      spyOn(Runtime.prototype, 'apiCall');
      spyOn(_Calculation, 'convert').and.returnValue('mocked_data');
      spyOn(console, 'log');

      const mockedPayload={}
      const data = await Calculation.calculateIndicatorData(
        'mockedSettings',
        'mockedIdMode',
        'mockedIdRegion', 
        mockedPayload
        );
      expect(data).toBe('mocked_data');
    });

    it('withPopulation', async () => {
      spyOn(Runtime.prototype, 'apiCall');
      spyOn(_Calculation, 'convert').and.returnValue('mocked_data');
      spyOn(console, 'log');

      const mockedPayload={population: 1000}
      const data = await Calculation.calculateIndicatorData(
        'mockedSettings',
        'mockedIdMode',
        'mockedIdRegion', 
        mockedPayload
        );
      expect(data).toBe('mocked_data');
    });

  });

 
});

describe('private API', () => {
  describe('convert', () => {
    beforeAll(() => {
      spyOn(_Calculation, '_toJson');
      spyOn(_Calculation, '_aggregateIdMeasure');
      spyOn(_Calculation, '_indicatorResult');
      spyOn(_Calculation, '_convertCostBenefitAnalysisData');
    });
    it('convert without aggregation', () => {
      const mockedDataset = {
        lifetime: [],
        subsidyRate: []
      };
      window.structuredClone = jest.fn().mockReturnValue(mockedDataset);
      const resultDataset = _Calculation.convert(mockedDataset);
      expect(resultDataset).toBeDefined();
    });
    it('convert with aggregation', () => {
      const annualData = {
        idColumnNames: ['id1', 'id2'],
        data: [],
        yearColumnNames: ['2010', '2020']
      };
      const mockedDataset = {
        measure1: annualData,
        measure2: annualData
      };
      window.structuredClone = jest.fn().mockReturnValue(mockedDataset);
      const resultDataset = _Calculation.convert(mockedDataset);
      expect(resultDataset).toBeDefined();
    });
  });
  it('_convertCostBenefitAnalysisData', () => {
    const mockedData = {
      indicator1: {
        idColumnNames: ['id1', 'id2'],
        yearColumnNames: ['2020', '2025', '2030']
      },
      indicator2: {
        idColumnNames: ['id1', 'id2'],
        yearColumnNames: ['2020', '2025', '2030']
      }
    };
    spyOn(_Calculation, '_arrayOfArraysToJson').and.returnValue('mockedTable');
    const result = _Calculation._convertCostBenefitAnalysisData(mockedData);
    expect(result.indicator1).toBe('mockedTable');
  });
  describe('_arrayOfArraysToJson', () => {
    it('with extra header', () => {
      const mockedData = [
        [1, 2],
        [3, 4]
      ];
      const mockedHeader = ['column1', 'column2'];
      const result = _Calculation._arrayOfArraysToJson(mockedData, mockedHeader);
      expect(result[0].column1).toStrictEqual(1);
      expect(result[0].column2).toStrictEqual(2);
    });
    it('with header included', () => {
      const mockedData = [
        ['column1', 'column2'],
        [1, 2]
      ];
      const result = _Calculation._arrayOfArraysToJson(mockedData);
      expect(result[0].column1).toStrictEqual(1);
      expect(result[0].column2).toStrictEqual(2);
    });
  });
  it('_convertLifetimeParameters', () => {
    const mockedLifetimeParameters = [
      {
        idMeasure: 1,
        data: [8]
      }
    ];
    const result = _Calculation._convertLifetimeParameters(
      mockedLifetimeParameters
    );
    expect(result).toStrictEqual([
      {
        idMeasure: 1,
        lifetime: 8
      }
    ]);
  });
  describe('_aggregateIdMeasure', () => {
    it('with legendEntry', () => {
      const mockedRows = [
        {
          data: [1, 2, 3],
          idMeasure: 1,
          legendEntry: 'mockedLegend'
        },
        {
          data: [4, 5, 6],
          idMeasure: 1,
          legendEntry: 'mockedLegend'
        }
      ];

      const mockedYears = [2020, 2025, 2030];
      spyOn(_Calculation, '_elementwiseSum').and.returnValue([5, 7, 9]);

      const result = _Calculation._aggregateIdMeasure(mockedRows, mockedYears);
      expect(result).toStrictEqual({
        mockedLegend: { 2020: 5, 2025: 7, 2030: 9 }
      });
    });

    it('without legendEntry', () => {
      const mockedRows = [
        {
          data: [1, 2, 3],
          idMeasure: 1
        },
        {
          data: [4, 5, 6],
          idMeasure: 1
        }
      ];

      const mockedYears = [2020, 2025, 2030];
      spyOn(_Calculation, '_elementwiseSum').and.returnValue([5, 7, 9]);

      const result = _Calculation._aggregateIdMeasure(mockedRows, mockedYears);
      expect(result).toStrictEqual({
        '#default#': { 2020: 5, 2025: 7, 2030: 9 }
      });
    });
  });

  it('_elementwiseSum', () => {
    const mockedArrayOfArrays = [
      [1, 2],
      [3, 4]
    ];
    const result = _Calculation._elementwiseSum(mockedArrayOfArrays);
    expect(result).toStrictEqual([4, 6]);
  });

  it('_indicatorResult', () => {
    const mockedAggregations = {
      mockedLegend: { 2020: 5, 2025: 7, 2030: 9 }
    };
    const mockedYears = [2020, 2025, 2030];
    const result = _Calculation._indicatorResult(
      mockedAggregations,
      mockedYears
    );
    expect(result).toStrictEqual({
      legend: ['mockedLegend'],
      rows: [
        [2020, 5],
        [2025, 7],
        [2030, 9]
      ]
    });
  });

  describe('_toJson', () => {
    describe('with id_measure', () => {
      it('with legend', () => {
        const mockedIndicatorData = {
          idColumnNames: ['id_measure', 'legendHeader'],
          rows: [[1, 'mockedLegendEntry', 1, 2, 3]]
        };

        const result = _Calculation._toJson(mockedIndicatorData);

        expect(result).toStrictEqual([
          {
            data: [1, 2, 3],
            idMeasure: 1,
            legendEntry: 'mockedLegendEntry'
          }
        ]);
      });

      it('without legend', () => {
        const mockedIndicatorData = {
          idColumnNames: ['id_measure'],
          rows: [[1, 10, 20, 30]]
        };

        const result = _Calculation._toJson(mockedIndicatorData);

        expect(result).toStrictEqual([
          {
            data: [10, 20, 30],
            idMeasure: 1,
            legendEntry: 'Value'
          }
        ]);
      });
    });

    describe('without id_measure', () => {
      it('with legend', () => {
        const mockedIndicatorData = {
          idColumnNames: ['legendHeader'],
          rows: [['mockedLegendEntry', 1, 2, 3]]
        };

        const result = _Calculation._toJson(mockedIndicatorData);

        expect(result).toStrictEqual([
          {
            data: [1, 2, 3],
            idMeasure: undefined,
            legendEntry: 'mockedLegendEntry'
          }
        ]);
      });

      it('without legend', () => {
        const mockedIndicatorData = {
          idColumnNames: [],
          rows: [[10, 20, 30]]
        };

        const result = _Calculation._toJson(mockedIndicatorData);

        expect(result).toStrictEqual([
          {
            data: [10, 20, 30],
            idMeasure: undefined,
            legendEntry: 'Value'
          }
        ]);
      });
    });
  });
});
