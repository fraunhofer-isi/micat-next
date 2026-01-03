// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import InputFilter from '../../../src/sections/input/input-filter';
import InputValidator from '../../../src/sections/input/input-validator';
import ColumnFactory from '../../../src/sections/input/column-factory';
import DataFactory from '../../../src/sections/input/data-factory';
import Mode from '../../../src/calculation/mode';
describe('main', () => {
  describe('createDefaultData', () => {
    it('with default savings', () => {
      spyOn(InputValidator, 'validateDefaultSavings');
      spyOn(DataFactory, 'createTableData').and.returnValue('mocked_result');
      const result = DataFactory.createDefaultData(
        'mocked_headers',
        'mocked_defaultSaving',
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toBe('mocked_result');
    });

    it('without default savings', () => {
      spyOn(DataFactory, '_rowTemplate').and.returnValue('mocked_rowTemplate');
      const result = DataFactory.createDefaultData(
        'mocked_headers',
        undefined,
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toStrictEqual(['mocked_rowTemplate']);
    });
  });

  it('createTableData', () => {
    const mockedData = [
      'mocked_header',
      'mocked_data_row'
    ];
    spyOn(DataFactory, '_filterRow').and.returnValue('mocked_filtered_row_data');
    spyOn(DataFactory, '_convertTableRow').and.returnValue('mocked_row');
    const result = DataFactory.createTableData(
      'mocked_headers',
      mockedData,
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping'
    );
    expect(result).toStrictEqual(['mocked_row']);
  });

  it('convertUploadedParameter', () => {
    const mockedJsonData = ['mocked_json_row'];
    spyOn(Mode, 'filterHeadersForMode');
    spyOn(ColumnFactory, 'itemMap');
    spyOn(ColumnFactory, 'numberOfKeyColumns');
    spyOn(DataFactory, '_convertParameterRow').and.returnValue('mocked_row');
    const result = DataFactory.convertUploadedParameter(
      'mocked_idMode',
      'mocked_headers',
      mockedJsonData,
      'mocked_properties'
    );
    expect(result).toStrictEqual(['mocked_row']);
  });

  describe('convertMainParameters', () => {
    it('without year column', () => {
      const details = {
        parameters: [],
        finalParameters: []
      };

      const parameterRow = {
        id_parameter: 1,
        id_foo: 2,
        value: 33
      };

      const rawDetails = {
        main: [parameterRow]
      };
      const result = DataFactory.convertMainParameters(details, rawDetails);
      expect(result).toBe(details);
    });
    it('with constants', () => {
      const details = {
        parameters: [],
        finalParameters: [],
        constants: []
      };

      const parameterRow = {
        id_parameter: 1,
        id_foo: 2,
        value: 33,
        constants: []
      };

      const rawDetails = {
        main: [parameterRow]
      };
      const result = DataFactory.convertMainParameters(details, rawDetails);
      expect(result).toBe(details);
    });

    describe('with year column', () => {
      it('with final energy carrier', () => {
        const details = {
          parameters: [],
          finalParameters: []
        };

        const parameterRow = {
          id_parameter: 1,
          id_final_energy_carrier: 2,
          2000: 33
        };

        const rawDetails = {
          main: [parameterRow]
        };

        const result = DataFactory.convertMainParameters(details, rawDetails);
        expect(result.finalParameters.length).toBe(1);
        expect(result.parameters.length).toBe(0);
      });

      it('without final energy carrier', () => {
        const details = {
          parameters: [],
          finalParameters: []
        };

        const parameterRow = {
          id_parameter: 1,
          id_foo: 2,
          2000: 33
        };

        const rawDetails = {
          main: [parameterRow]
        };

        const result = DataFactory.convertMainParameters(details, rawDetails);
        expect(result.finalParameters.length).toBe(0);
        expect(result.parameters.length).toBe(1);
      });
    });
  });

  describe('convertFuelSwitch', () => {
    it('without year column', () => {
      const details = {
        parameters: [],
        finalParameters: []
      };

      const parameterRow = {
        id_parameter: 1,
        id_foo: 2,
        value: 33
      };

      const rawDetails = {
        fuelSwitch: [parameterRow]
      };
      const result = DataFactory.convertFuelSwitch(details, rawDetails);
      expect(result).toBe(details);
    });

    it('with year column', () => {
      const details = {
        parameters: [],
        finalParameters: []
      };

      const parameterRow = {
        id_parameter: 1,
        id_final_energy_carrier: 2,
        2000: 33
      };

      const rawDetails = {
        fuelSwitch: [parameterRow]
      };

      const result = DataFactory.convertFuelSwitch(details, rawDetails);
      expect(result.finalParameters.length).toBe(1);
      expect(result.parameters.length).toBe(0);
    });
  });

  describe('convertResidential', () => {
    it('without year column', () => {
      const details = {
        parameters: [],
        finalParameters: []
      };

      const parameterRow = {
        id_parameter: 1,
        id_foo: 2,
        value: 33
      };

      const rawDetails = {
        residential: [parameterRow]
      };
      const result = DataFactory.convertResidential(details, rawDetails);
      expect(result).toBe(details);
    });

    it('with year column', () => {
      const details = {
        parameters: [],
        finalParameters: []
      };

      const parameterRow = {
        id_parameter: 1,
        2000: 33
      };

      const rawDetails = {
        residential: [parameterRow]
      };

      const result = DataFactory.convertResidential(details, rawDetails);
      expect(result.finalParameters.length).toBe(0);
      expect(result.parameters.length).toBe(1);
    });
  });

  it('createNewRowData', () => {
    const mockedColumns = [
      { field: 'subsector' },
      { field: 'action_type' },
      { field: '2000' }
    ];
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    const result = DataFactory.createNewRowData(
      'mocked_id',
      mockedColumns
    );
    expect(result).toStrictEqual({
      id: 'mocked_id',
      row_number: 'mocked_id',
      active: true,
      subsector: undefined,
      action_type: undefined,
      2000: 0
    });
  });

  it('extractSavings', () => {
    const jsonData = {
      main: [
        'mocked_rawSavings',
        'mocked_other_row'
      ]
    };
    spyOn(DataFactory, '_extractAnnualData').and.returnValue('mockedSavings');
    const [savingsResult, jsonDataResult] = DataFactory.extractSavings(jsonData);
    expect(savingsResult).toBe('mockedSavings');
    expect(jsonDataResult).toBeDefined();
  });

  it('synchronizeEntries', () => {
    const mockedData = {
      foo: 1,
      baa: 2
    };

    const mockedRow = {
      getData: () => mockedData
    };

    const mockedEntries = {
      foo: 10,
      baa: 20,
      qux: 30
    };

    const result = DataFactory.synchronizeEntries(mockedRow, mockedEntries);
    expect(result.foo).toBe(10);
    expect(result.baa).toBe(20);
    expect(result.qux).toBe(undefined);
  });

  it('_filterRow', () => {
    const dataHeaders = ['foo', 'baa', 'qux'];
    const rowData = [1, 2, 3];
    const headers = ['foo', 'qux'];
    const result = DataFactory._filterRow(rowData, dataHeaders, headers);
    expect(result).toStrictEqual([1, 3]);
  });

  it('_convertTableRow', () => {
    const mockedRowData = [
      'mocked_subsectorLabel',
      'mocked_actionTypeLabel'
    ];
    spyOn(InputFilter, 'itemByLabelOrFirstItem').and.returnValue('mocked_item');
    spyOn(InputFilter, 'filterActionTypesBySubsector').and.returnValue('mocked_items');
    spyOn(DataFactory, '_includeAnnualEntries').and.returnValue({});
    const result = DataFactory._convertTableRow(
      'mocked_index',
      mockedRowData,
      'mocked_header',
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping'
    );
    expect(result).toBeDefined();
    expect(result.details).toStrictEqual({});
  });

  it('_convertParameterRow', () => {
    const mockedRowData = { 2000: 1, foo: 'foo_value' };
    const mockedHeaders = [
      'foo',
      2000
    ];
    const mockedItemMap = {
      foo: { key: 'id_foo', items: 'mocked_items' }
    };
    spyOn(DataFactory, '_convertToId').and.returnValue('mocked_id');
    const result = DataFactory._convertParameterRow(
      mockedRowData,
      mockedHeaders,
      mockedItemMap
    );
    expect(result).toStrictEqual({ id_foo: 'mocked_id', 2000: 1 });
  });

  it('_convertToId', () => {
    const mockedItem = { id: 'mocked_id' };
    spyOn(InputFilter, 'itemByLabelOrFirstItem').and.returnValue(mockedItem);
    const result = DataFactory._convertToId('mocked_value', 'mocked_item');
    expect(result).toBe('mocked_id');
  });

  it('_extractAnnualData', () => {
    const rawSavings = {
      id_foo: 1,
      2000: 2,
      2020: 3
    };

    const result = DataFactory._extractAnnualData(rawSavings);
    expect(result).toStrictEqual({ 2000: 2, 2020: 3 });
  });

  it('_includeAnnualEntries', () => {
    const mockedRow = {};
    const mockedHeaders = ['Subsector', 'ActionType', '2000'];
    const mockedRowData = [
      'mocked_subsectorLabel',
      'mocked_actionTypeLabel',
      'mocked_annualEntry'
    ];
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    const result = DataFactory._includeAnnualEntries(
      mockedRow,
      mockedHeaders,
      mockedRowData
    );
    expect(result['2000']).toBe('mocked_annualEntry');
  });

  it('_rowTemplate', () => {
    const result = DataFactory._rowTemplate();
    expect(result).toBeDefined();
  });
});
