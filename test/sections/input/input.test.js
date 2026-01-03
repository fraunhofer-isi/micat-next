// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import Input, { _Input } from './../../../src/sections/input/input';
import ColumnFactory from './../../../src/sections/input/column-factory';
import Mode from './../../../src/calculation/mode';
import DataFactory from './../../../src/sections/input/data-factory';
import InputValidator from './../../../src/sections/input/input-validator';
import InputFilter from './../../../src/sections/input/input-filter';
import UnitConverter from '../../../src/sections/input/unit-converter';

describe('construction', () => {
  const mockedProperties = {
    context: {
      idRegion: 0
    }
  };
  it('with savings', async () => {
    spyOn(React, 'useState').and.returnValues(
      [[{ id: 'mockedId' }], () => {}],
      [{}, () => {}],
      [true, () => {}],
      ['ktoe', () => {}]
    );
    spyOn(UnitConverter, 'units').and.returnValue({
      ktoe: {}
    });
    spyOn(_Input, 'savingsTable').and.returnValue('mocked_savingsTable');
    spyOn(_Input, 'parameters').and.returnValue('mocked_parameters');
    spyOn(_Input, 'getPopulation');
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(React, 'useRef');
    spyOn(_Input, 'handleInputChanged');
    spyOn(_Input, 'savingsTableToJsonPayload');

    const result = Input(mockedProperties);
    expect(result).toBeDefined();

    const region = result.props.children[2];
    const change = region.props.change;
    spyOn(_Input, '_regionChanged');
    change();
    expect(_Input._regionChanged).toBeCalled();
  });
  it('without savings', async () => {
    mockedProperties.context.idRegion = 1;
    spyOn(React, 'useState').and.returnValues(
      [undefined, () => {}],
      [{}, () => {}],
      [true, () => {}],
      ['ktoe', () => {}]
    );
    spyOn(_Input, 'savingsTable').and.returnValue('mocked_savingsTable');
    spyOn(_Input, 'parameters').and.returnValue('mocked_parameters');
    spyOn(_Input, 'getPopulation');
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(React, 'useRef');
    spyOn(_Input, 'handleInputChanged');
    spyOn(_Input, 'savingsTableToJsonPayload');
    const result = Input(mockedProperties);
    expect(result).toBeDefined();
  });
});

describe('_Input', () => {
  describe('handleInputChanged', () => {
    it('with saving', async () => {
      const mockedProperties = {
        change: async () => {},
        context: {
          idRegion: 'mocked_idRegion'
        }
      };
      spyOn(mockedProperties, 'change');
      await _Input.handleInputChanged({}, mockedProperties);
      expect(mockedProperties.change).toHaveBeenCalled();
    });
    it('without saving', async () => {
      const mockedProperties = {
        change: () => {}
      };
      spyOn(mockedProperties, 'change');
      await _Input.handleInputChanged(
        undefined,
        'mocked_optionalParameters',
        mockedProperties
      );
      expect(mockedProperties.change).not.toHaveBeenCalled();
    });
  });
  it('unitChanged', () => {
    const mockedUnits = {
      ktoe: {}
    };
    const mockedSetUnit = jest.fn();
    const mockedSetShowModal = jest.fn();
    _Input.unitChanged('ktoe', mockedUnits, mockedSetUnit, mockedSetShowModal);
    expect(mockedSetUnit).toBeCalled();
    expect(mockedSetShowModal).toBeCalled();
  });
  describe('savingsTableToJsonPayload', () => {
    it('without savings', () => {
      const mockedSavings = undefined;
      const result = _Input.savingsTableToJsonPayload(
        mockedSavings,
        'mockedUnit'
      );
      expect(result).not.toBeDefined();
    });

    it('with unit ktoe', () => {
      const mockedSavings = [
        {
          2020: 10,
          2025: 20
        }
      ];
      const mockedUnit = {
        factor: 1
      };
      const result = _Input.savingsTableToJsonPayload(
        mockedSavings,
        mockedUnit
      );
      expect(result.measures).toBeDefined();
      expect(result.parameters).toBeDefined();
    });
    it('with unit other than ktoe', () => {
      const mockedSavings = [
        {
          2020: 10,
          2025: 20
        }
      ];
      const mockedUnit = {
        factor: 2
      };
      spyOn(UnitConverter, 'convertAnnualValues').and.returnValue(
        'mocked_conversion'
      );
      const result = _Input.savingsTableToJsonPayload(
        mockedSavings,
        mockedUnit
      );
      expect(result.measures).toBeDefined();
      expect(result.parameters).toBeDefined();
      expect(result.measures[0].savings).toBe('mocked_conversion');
    });
  });

  describe('getPopulation', () => {
    it('without element', () => {
      const populationReference = { current: undefined };
      const result = _Input.getPopulation(populationReference);
      expect(result).toBeUndefined();
    });

    it('with element', () => {
      const populationReference = {
        current: {
          value: '55'
        }
      };
      const result = _Input.getPopulation(populationReference);
      expect(result).toBe(55);
    });
  });

  /*   it('savingsTemplateDownloader', () => {
    const properties = {
      context: {
        regions: 'mocked_regions',
        idRegion: '33',
        settings: 'mocked_settings'
      }
    };
    const result = _Input.savingsTemplateDownloader(properties);
    expect(result).toBeDefined();
    // const blob = result.props.children[1].props.blob;
    // spyOn(_Input, '_savingsBlob');
    // blob();
    // expect(_Input._savingsBlob).toHaveBeenCalled();
  }); */
  it('savingsTable', () => {
    const properties = {
      context: {
        idMode: 'mocked_idMode',
        actionTypeMapping: 'mocked_actionTypeMapping',
        settings: 'mocked_settings'
      },
      change: () => {},
      staleHandler: () => {}
    };
    spyOn(_Input, '_defaultSavings').and.returnValue('mocked_savings');
    spyOn(_Input, '_savingsDataChanged');
    spyOn(ColumnFactory, 'subsectorItems').and.returnValue(
      'mocked_subsectorItems'
    );
    spyOn(ColumnFactory, 'actionTypeItems').and.returnValue(
      'mocked_actionTypeItems'
    );
    spyOn(ColumnFactory, 'createDefaultColumns').and.returnValue(
      'mocked_defaultColumns'
    );
    spyOn(Mode, 'minYear').and.returnValue('mocked_minYear');
    spyOn(Mode, 'maxYear').and.returnValue('mocked_maxYear');
    spyOn(ColumnFactory, 'dataHeaders').and.returnValue('mocked_headers');
    spyOn(DataFactory, 'createDefaultData').and.returnValue(
      'mocked_defaultData'
    );
    const result = _Input.savingsTable(properties, () => {});
    expect(result).toBeDefined();
    result.props.savingsDataChanged();
    const change = result.props.change;
    spyOn(properties, 'change');
    change();
    const staleHandler = result.props.staleHandler;
    spyOn(properties, 'staleHandler');
    staleHandler();
    expect(properties.staleHandler).toHaveBeenCalled();
    const validate = result.props.validate;
    spyOn(InputValidator, 'validateSavings');
    validate();
    expect(InputValidator.validateSavings).toHaveBeenCalled();
    const validateAndConvertUploadedData =
      result.props.validateAndConvertUploadedData;
    spyOn(_Input, '_validateAndConvertUploadedSavings');
    validateAndConvertUploadedData();
    expect(_Input._validateAndConvertUploadedSavings).toHaveBeenCalled();
    const filterData = result.props.filterData;
    spyOn(InputFilter, 'filterDisplayData');
    filterData();
    expect(InputFilter.filterDisplayData).toHaveBeenCalled();
    const createAnnualColumn = result.props.createAnnualColumn;
    spyOn(ColumnFactory, 'createAnnualColumn');
    createAnnualColumn();
    expect(ColumnFactory.createAnnualColumn).toHaveBeenCalled();
    const createNewRowData = result.props.createNewRowData;
    spyOn(DataFactory, 'createNewRowData');
    createNewRowData();
    expect(DataFactory.createNewRowData).toHaveBeenCalled();
    const downloadBlob = result.props.downloadBlob;
    spyOn(_Input, '_savingsBlob');
    downloadBlob('mocked_fileName', 'mocked_savings');
    expect(_Input._savingsBlob).toHaveBeenCalled();
  });
  it('_savingsDataChanged', () => {
    const mockedProperties = {
      savingsDataChanged: jest.fn()
    };
    _Input._savingsDataChanged({}, {});
    _Input._savingsDataChanged({}, mockedProperties);
    expect(mockedProperties.savingsDataChanged).toBeCalled();
  });
  it('parameters', async () => {
    const properties = {
      context: {
        settings: 'mocked_settings'
      }
    };
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const mockedSetOptionalParameters = async () => {};
    const result = _Input.parameters(properties, mockedSetOptionalParameters);
    expect(result).toBeDefined();
    const change = result.props.change;
    await change();
    const templateBlob = result.props.templateBlob;
    spyOn(_Input, '_parameterTemplateBlob');
    templateBlob('mocked_fileName');
    expect(_Input._parameterTemplateBlob).toHaveBeenCalled();
  });
  it('_savingsBlob ', async () => {
    const mockedRuntime = {
      apiCall: async () => 'mocked_blob'
    };
    const mockedContext = {
      idMode: 'mocked_idMode',
      idRegion: 'mocked_idRegion'
    };
    const resultWithSavings = await _Input._savingsBlob(
      'mocked_fileName',
      'mocked_savings',
      'mocked_unit',
      mockedContext,
      mockedRuntime
    );
    expect(resultWithSavings).toBe('mocked_blob');
    const resultWithoutSavings = await _Input._savingsBlob(
      'mocked_fileName',
      undefined,
      'mocked_unit',
      mockedContext,
      mockedRuntime
    );
    expect(resultWithoutSavings).toBe('mocked_blob');
  });
  it('_parameterTemplateBlob ', async () => {
    const mockedRuntime = {
      apiCall: async () => 'mocked_blob'
    };
    const mockedContext = {
      idMode: 'mocked_idMode',
      idRegion: 'mocked_idRegion'
    };
    const result = await _Input._parameterTemplateBlob(
      'mocked_fileName',
      mockedContext,
      mockedRuntime
    );
    expect(result).toBe('mocked_blob');
  });
  it('_regionChanged', () => {
    const mockedRouter = {
      push: () => {}
    };
    spyOn(mockedRouter, 'push');
    const mockedContext = {
      idMode: 'mockedIdMode',
      router: mockedRouter
    };
    const mockedProperties = {
      context: mockedContext,
      change: () => {}
    };
    spyOn(_Input, 'savingsTableToJsonPayload').and.returnValue({});
    _Input._regionChanged(
      'mocked_idRegion',
      'mocked_population',
      mockedProperties,
      'mocked_savings'
    );
    expect(mockedRouter.push).toHaveBeenCalled();
  });
  describe('_defaultSavings', () => {
    it('using default savings', () => {
      const mockedContext = {
        settings: {
          useDefaultSavings: true,
          defaultSavings: 'mocked_defaultSavings'
        }
      };
      const result = _Input._defaultSavings(mockedContext);
      expect(result).toBe('mocked_defaultSavings');
    });
    it('without default savings', () => {
      const mockedContext = {
        settings: {
          useDefaultSavings: false
        }
      };
      const result = _Input._defaultSavings(mockedContext);
      expect(result).toBeUndefined();
    });
  });
  describe('_validateAndConvertUploadedSavings', () => {
    it('without validation error', () => {
      const mockedData = [['mocked_header'], ['mocked_entry']];
      spyOn(ColumnFactory, 'keyColumnHeadersForSavings');
      spyOn(_Input, '_headersFromJsonRow').and.returnValue('mocked_headers');
      spyOn(InputValidator, 'validateHeaders').and.returnValue(false);
      spyOn(_Input, '_annualJsonTableToArrayOfArrays').and.returnValue(
        mockedData
      );
      spyOn(_Input, '_convertUploadedSavingData').and.returnValue(
        'mocked_result'
      );
      const result = _Input._validateAndConvertUploadedSavings(
        'mocked_idMode',
        'mocked_jsonData',
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toBe('mocked_result');
    });
    it('with validation error', () => {
      const mockedData = [['mocked_header'], ['mocked_entry']];
      spyOn(ColumnFactory, 'keyColumnHeadersForSavings');
      spyOn(_Input, '_headersFromJsonRow').and.returnValue('mocked_headers');
      spyOn(InputValidator, 'validateHeaders').and.returnValue(true);
      spyOn(_Input, '_annualJsonTableToArrayOfArrays').and.returnValue(
        mockedData
      );
      spyOn(window, 'alert');
      const result = _Input._validateAndConvertUploadedSavings(
        'mocked_idMode',
        mockedData,
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toBe(undefined);
      expect(window.alert).toHaveBeenCalled();
    });
  });
  it('_validateAndConvertUploadedParameters', () => {
    const mockedJsonData = {
      mocked_key: 'mocked_parameter_data',
      Options: 'mocked_options'
    };
    spyOn(_Input, '_validateAndConvertUploadedParameter').and.returnValue(
      'mocked_result'
    );
    const result = _Input._validateAndConvertUploadedParameters(
      mockedJsonData,
      'mocked_properties'
    );
    expect(result).toBeDefined();
    expect(result.mocked_key).toBe('mocked_parameter_data');
  });
  describe('_validateAndConvertUploadedParameter', () => {
    it('without keyColumnHeader', () => {
      const properties = {
        context: {
          idMode: 'mocked_idMode'
        }
      };
      spyOn(ColumnFactory, 'keyColumnHeadersForParameter');
      spyOn(console, 'warn');
      const result = _Input._validateAndConvertUploadedParameter(
        'mocked_parameterName',
        'mocked_jsonData',
        properties
      );
      expect(result).toStrictEqual([]);
    });
    it('without validation error', () => {
      const properties = {
        context: {
          idMode: 'mocked_idMode'
        }
      };
      spyOn(ColumnFactory, 'keyColumnHeadersForParameter').and.returnValue([
        'mocked_header'
      ]);
      spyOn(_Input, '_headersFromJsonRow').and.returnValue('mocked_headers');
      spyOn(InputValidator, 'validateHeaders');
      spyOn(DataFactory, 'convertUploadedParameter').and.returnValue(
        'mocked_result'
      );
      const result = _Input._validateAndConvertUploadedParameter(
        'mocked_parameterName',
        'mocked_jsonData',
        properties
      );
      expect(result).toBe('mocked_result');
    });
    it('with validation error', () => {
      const properties = {
        context: {
          idMode: 'mocked_idMode'
        }
      };
      spyOn(ColumnFactory, 'keyColumnHeadersForParameter').and.returnValue([
        'mocked_header'
      ]);
      spyOn(_Input, '_headersFromJsonRow').and.returnValue('mocked_headers');
      spyOn(InputValidator, 'validateHeaders').and.returnValue('mocked_error');
      spyOn(window, 'alert');
      const result = _Input._validateAndConvertUploadedParameter(
        'mocked_parameterName',
        'mocked_jsonData',
        properties
      );
      expect(result).toStrictEqual({});
      expect(window.alert).toHaveBeenCalled();
    });
  });
  it('_headersFromJsonRow', () => {
    const mockedJsonRow = {
      2000: 1,
      2020: 2,
      mocked_key: 'mocked_parameter_data'
    };
    const mockedHeaders = [2000, 2020, 'mocked_key'];
    spyOn(_Input, '_convertNumericHeaderStrings').and.returnValue(
      mockedHeaders
    );
    const mockedKeyColumnHeaders = ['mocked_key'];
    const result = _Input._headersFromJsonRow(
      mockedJsonRow,
      mockedKeyColumnHeaders
    );
    expect(result).toStrictEqual(['mocked_key', 2000, 2020]);
  });
  it('_annualJsonTableToArrayOfArrays', () => {
    const mockedJsonData = [
      { Subsector: 'foo', 2000: 1 },
      { Subsector: 'baa', 2000: 2 }
    ];
    const mockedHeaders = ['Subsector', 2000];
    const result = _Input._annualJsonTableToArrayOfArrays(
      mockedJsonData,
      mockedHeaders
    );
    expect(result).toStrictEqual([
      ['Subsector', 2000],
      ['foo', 1],
      ['baa', 2]
    ]);
  });
  it('_convertNumericHeaderStrings', () => {
    const headerStrings = ['Subsector', '2000'];
    const result = _Input._convertNumericHeaderStrings(headerStrings);
    expect(result).toStrictEqual(['Subsector', 2000]);
  });
  describe('_representsInteger', () => {
    it('with integer', () => {
      const result = _Input._representsInteger('33');
      expect(result).toBe(true);
    });
    it('with float', () => {
      const result = _Input._representsInteger('33.3');
      expect(result).toBe(false);
    });
    it('with infinity', () => {
      const result = _Input._representsInteger('inf');
      expect(result).toBe(false);
    });
    it('with nan', () => {
      const result = _Input._representsInteger('NaN');
      expect(result).toBe(false);
    });
    it('with text', () => {
      const result = _Input._representsInteger('Subector');
      expect(result).toBe(false);
    });
  });
  it('_convertUploadedSavingData', () => {
    const mockedData = [['mocked_header'], ['mocked_entry']];
    spyOn(ColumnFactory, 'numberOfKeyColumns');
    spyOn(Mode, 'filterHeadersForMode').and.returnValue(
      'mocked_headers'
    );
    spyOn(ColumnFactory, 'createColumns').and.returnValue('mocked_columns');
    spyOn(DataFactory, 'createTableData').and.returnValue('mocked_tableData');
    const result = _Input._convertUploadedSavingData(
      'mocked_idMode',
      'mocked_headers',
      mockedData,
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping'
    );
    expect(result.columns).toBe('mocked_columns');
    expect(result.data).toBe('mocked_tableData');
  });
});
/* eslint-enable max-lines */
