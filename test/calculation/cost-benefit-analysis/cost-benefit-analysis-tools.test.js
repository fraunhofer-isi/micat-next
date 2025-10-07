// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import CostBenefitAnalysisTools from '../../../src/calculation/cost-benefit-analysis/cost-benefit-analysis-tools';

describe('CostBenefitAnalysisTools', () => {
  it('findObjectById', () => {
    const mockedDataArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const mockedObjectId = 2;
    const result = CostBenefitAnalysisTools.findObjectById(
      mockedDataArray,
      mockedObjectId
    );
    expect(result.id).toBe(2);
  });
  describe('emptyArguments', () => {
    it('parameters as object and contains empty parameter', () => {
      const mockedParameters = {
        mockedParameter1: 'mockedValue1',
        mockedParameter2: undefined
      };
      spyOn(CostBenefitAnalysisTools, '_emptyParameter').and.returnValue(true);
      const result = CostBenefitAnalysisTools.emptyParameters(mockedParameters);
      expect(result).toBeTruthy();
    });
    it('parameters as object and contains no empty parameter', () => {
      const mockedParameters = {
        mockedParameter1: 'mockedValue1',
        mockedParameter2: 'mockedValue2'
      };
      spyOn(CostBenefitAnalysisTools, '_emptyParameter').and.returnValue(false);
      const result = CostBenefitAnalysisTools.emptyParameters(mockedParameters);
      expect(result).toBeFalsy();
    });
    it('parameters as an array and contains empty parameter', () => {
      const mockedParameters = ['mockedValue', {}];
      spyOn(CostBenefitAnalysisTools, '_emptyParameter').and.returnValue(true);
      const result = CostBenefitAnalysisTools.emptyParameters(mockedParameters);
      expect(result).toBeTruthy();
    });
    it('parameters as an array and contains no empty parameter', () => {
      const mockedParameters = ['mockedValue1', 'mockedValue2'];
      spyOn(CostBenefitAnalysisTools, '_emptyParameter').and.returnValue(false);
      const result = CostBenefitAnalysisTools.emptyParameters(mockedParameters);
      expect(result).toBeFalsy();
    });
  });
  describe('_checkParameter', () => {
    it('contains zero', () => {
      const result =
        CostBenefitAnalysisTools._emptyParameter(0);
      expect(result).toBeFalsy();
    });
    it('contains undefined', () => {
      const result =
        CostBenefitAnalysisTools._emptyParameter();
      expect(result).toBeTruthy();
    });
    it('contains empty array', () => {
      const result =
        CostBenefitAnalysisTools._emptyParameter([]);
      expect(result).toBeTruthy();
    });
    it('contains empty object', () => {
      const result =
        CostBenefitAnalysisTools._emptyParameter({});
      expect(result).toBeTruthy();
    });
    it('contains arguments', () => {
      const result =
        CostBenefitAnalysisTools.emptyParameters('mockedArgument');
      expect(result).toBeFalsy();
    });
  });
});
