// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class CostBenefitAnalysisTools {
  static findObjectById(dataArray, objectId) {
    const result = dataArray.find(object => {
      return object.id === objectId;
    });
    return result;
  }

  static emptyParameters(parameters) {
    if(Array.isArray(parameters)) {
      for (const parameter of parameters) {
        const emptyParameter = CostBenefitAnalysisTools._emptyParameter(parameter);
        if(emptyParameter){
          return true;
        }
      }
    } else {
      for(const parameterName of Object.keys(parameters)) {
        const parameter = parameters[parameterName];
        const emptyParameter = CostBenefitAnalysisTools._emptyParameter(parameter);
        if(emptyParameter){
          return true;
        }
      }
    }
    return false;
  }

  static _emptyParameter(parameter) {
    if(parameter === 0) {
      return false;
    } else if (!parameter) {
      return true;
    } else if (parameter.constructor === Array && parameter.length === 0) {
      return true;
    } else if (parameter.constructor === Object && Object.keys(parameter).length === 0) {
      return true;
    }
    return false;
  }
}
