// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import ReactDomClient from 'react-dom/client';
import StringUtils from '../../../../src/utils/string-utils';
import ColumnManager from '../../../../src/sections/input/table/column-manager';
import * as RowManagerModule from '../../../../src/sections/input/table/row-manager';
import AnnualTable, { _AnnualTable } from '../../../../src/sections/input/table/annual-table';

jest.mock('tabulator-tables', () => {
  class MockedTabulatorFull {
    on(_key, delegate){
      delegate();
    }
  }

  return {
    TabulatorFull: MockedTabulatorFull
  };
});

describe('construction', () => {
  it('without tabulator and without footer', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const mockedUseState = defaultValue => {
      return defaultValue === undefined
        ? [undefined, () => {}]
        : [defaultValue, () => {}];
    };

    spyOn(React, 'useState').and.callFake(mockedUseState);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(_AnnualTable, 'toolbar');
    spyOn(_AnnualTable, 'footer');
    spyOn(_AnnualTable, 'errorBar');
    spyOn(_AnnualTable, 'initializeTabulator');

    const result = AnnualTable('mocked_properties');

    expect(result).toBeDefined();
  });

  it('with tabulator & footer', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const mockedStateVariable = {
      render: () => {}
    };
    const mockedUseState = () => [mockedStateVariable, () => {}];

    spyOn(React, 'useState').and.callFake(mockedUseState);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    spyOn(_AnnualTable, 'toolbar');
    spyOn(_AnnualTable, 'footer');
    spyOn(_AnnualTable, 'errorBar');

    const result = AnnualTable('mocked_properties');

    expect(result).toBeDefined();
  });
});

describe('_AnnualTable', () => {
  it('initializeTabulator', () => {
    const mockedColumnManager = {
      setTabulator: () => {},
      setDataChanged: () => {}
    };
    spyOn(_AnnualTable, '_createColumnManager').and.returnValue(mockedColumnManager);

    const mockedRowManager = {
      setTabulator: () => {}
    };
    spyOn(_AnnualTable, '_createRowManager').and.returnValue(mockedRowManager);
    spyOn(_AnnualTable, '_tabulatorOptions');

    spyOn(_AnnualTable, '_dataChanged');
    spyOn(_AnnualTable, '_tabulatorValidationFailed');
    spyOn(_AnnualTable, '_tabulatorBuilt');

    const mockedProperties = {
      savingsDataChanged: jest.fn()
    };
    _AnnualTable.initializeTabulator(
      mockedProperties,
      () => {},
      () => {},
      () => {},
      'mocked_setFooterRoot'
    );
  });

  describe('toolbar', () => {
    it('without columnManager', () => {
      const properties = {
        validateAndConvertUploadedData: () => {}
      };

      const result = _AnnualTable.toolbar(
        properties,
        'mocked_tabulator',
        undefined,
        'mocked_rowManager'
      );
      expect(result).toBeDefined();

      const reset = result.props.reset;
      spyOn(_AnnualTable, '_reset');
      reset();
      expect(_AnnualTable._reset).toHaveBeenCalled();

      const clear = result.props.clear;
      spyOn(_AnnualTable, '_clear');
      clear();
      expect(_AnnualTable._clear).toHaveBeenCalled();

      const updateTable = result.props.updateTable;
      spyOn(_AnnualTable, '_updateTable');
      updateTable();
      expect(_AnnualTable._updateTable).toHaveBeenCalled();

      const apply = result.props.apply;
      spyOn(_AnnualTable, '_data');
      spyOn(_AnnualTable, '_apply');
      apply();
      expect(_AnnualTable._data).toHaveBeenCalled();
      expect(_AnnualTable._apply).toHaveBeenCalled();

      const downloadBlob = result.props.downloadBlob;
      spyOn(_AnnualTable, '_downloadBlob');
      downloadBlob();
      expect(_AnnualTable._downloadBlob).toHaveBeenCalled();

      const validateAndConvertUploadedData = result.props.validateAndConvertUploadedData;
      spyOn(properties, 'validateAndConvertUploadedData');
      validateAndConvertUploadedData();
      expect(properties.validateAndConvertUploadedData).toHaveBeenCalled();
    });

    describe('with columnManager', () => {
      it('is stale and valid', () => {
        const mockedColumnManager = {
          createNewColumnYear: () => 'mocked_year'
        };
        const properties = {
          dataIsStale: true,
          dataIsValid: true
        };
        const result = _AnnualTable.toolbar(
          properties,
          'mocked_tabulator',
          mockedColumnManager,
          'mocked_rowManager'
        );
        expect(result).toBeDefined();
      });

      it('is not stale and not valid', () => {
        const mockedColumnManager = {
          createNewColumnYear: () => 'mocked_year'
        };
        const properties = {
          dataIsStale: false,
          dataIsValid: false
        };
        const result = _AnnualTable.toolbar(
          properties,
          'mocked_tabulator',
          mockedColumnManager,
          'mocked_rowManager'
        );
        expect(result).toBeDefined();
      });
    });
  });

  it('footer', () => {
    const properties = {
      tabulatorValidationFailed: false
    };
    const rowManager = {
      addRow: () => {}
    };
    spyOn(rowManager, 'addRow');
    const result = _AnnualTable.footer(properties, rowManager);
    expect(result).toBeDefined();

    const addRow = result.props.addRow;
    addRow();
    expect(rowManager.addRow).toHaveBeenCalled();
  });

  it('errorBar', () => {
    const properties = {
      tabulatorValidationFailed: false
    };
    const result = _AnnualTable.errorBar(properties);
    expect(result).toBeDefined();

    const reset = result.props.reset;
    spyOn(_AnnualTable, '_resetErrorBar');
    reset();
    expect(_AnnualTable._resetErrorBar).toHaveBeenCalled();
  });

  it('_createColumnManager', () => {
    const result = _AnnualTable._createColumnManager('mocked_properties');
    expect(result).toBeDefined();
  });

  it('_createRowManager', () => {
    spyOn(RowManagerModule, 'default');
    const result = _AnnualTable._createRowManager('mocked_properties');
    expect(result).toBeDefined();
  });

  it('_data', () => {
    const mockedProperties = {
      filterData: () => {}
    };
    const mockedColumnManager = {
      columns: 'mocked_columns'
    };
    spyOn(_AnnualTable, '_displayData');
    spyOn(ColumnManager, 'removeId');
    spyOn(_AnnualTable, '_convertValues').and.returnValue('mocked_result');

    const result = _AnnualTable._data(
      mockedProperties,
      'mocked_tabulator',
      mockedColumnManager
    );
    expect(result).toBe('mocked_result');
  });

  describe('_displayData', () => {
    it('initialized', () => {
      const mockedTabulator = {
        initialized: true,
        getData: () => 'mocked_data'
      };
      const mockedColumnManager = {
        filterDataByColumns: () => 'mocked_result'
      };
      const result = _AnnualTable._displayData(
        'mocked_properties',
        mockedTabulator,
        mockedColumnManager
      );
      expect(result).toBe('mocked_result');
    });

    it('not initialized', () => {
      const mockedProperties = {
        defaultData: 'mocked_defaultData'
      };
      const mockedTabulator = {
        initialized: false
      };
      const mockedColumnManager = {
        filterDataByColumns: () => 'mocked_result'
      };
      const result = _AnnualTable._displayData(
        mockedProperties,
        mockedTabulator,
        mockedColumnManager
      );
      expect(result).toBe('mocked_result');
    });
  });

  it('_resetErrorBar', () => {
    const mockedProperties = {
      setTabulatorValidationValue: () => {},
      setTabulatorValidationFailed: () => {}
    };
    _AnnualTable._resetErrorBar(mockedProperties);
  });

  describe('_tabulatorBuilt', () => {
    it('valid', () => {
      const properties = {
        setDataIsValid: () => {}
      };
      spyOn(ReactDomClient, 'createRoot');
      spyOn(_AnnualTable, '_data');
      spyOn(_AnnualTable, '_validate').and.returnValue(true);
      spyOn(_AnnualTable, '_apply');

      _AnnualTable._tabulatorBuilt(
        properties,
        () => {},
        'mocked_tabulator',
        'mocked_columnManager'
      );
      expect(_AnnualTable._apply).toHaveBeenCalled();
    });

    it('not valid', () => {
      const properties = {
        setDataIsValid: () => {}
      };
      spyOn(ReactDomClient, 'createRoot');
      spyOn(_AnnualTable, '_data');
      spyOn(_AnnualTable, '_validate').and.returnValue(false);
      spyOn(_AnnualTable, '_apply');

      _AnnualTable._tabulatorBuilt(
        properties,
        () => {},
        'mocked_tabulator',
        'mocked_columnManager'
      );
      expect(_AnnualTable._apply).not.toHaveBeenCalled();
    });
  });

  it('_updateTable', () => {
    const mockedTabulator = {
      clearData: () => {},
      setColumns: () => {},
      replaceData: () => {}
    };
    _AnnualTable._updateTable('mocked_columnsAndData', mockedTabulator);
  });

  it('_tabulatorOptions', () => {
    const properties = {
      defaultColumns: 'mocked_defaultColumns',
      defaultData: 'mocked_defaultData'
    };
    const columnManager = {
      extendAnnualColumns: () => {}
    };
    const rowManager = {
      rowContextMenu: () => {}
    };
    const result = _AnnualTable._tabulatorOptions(
      properties,
      columnManager,
      rowManager);
    expect(result).toBeDefined();
  });

  describe('_validate', () => {
    it('with validate property', () => {
      const properties = {
        validate: () => false
      };
      const result = _AnnualTable._validate('mocked_data', properties);
      expect(result).toBe(false);
    });

    it('without validate property', () => {
      const properties = {
        validate: undefined
      };
      const result = _AnnualTable._validate('mocked_data', properties);
      expect(result).toBe(true);
    });
  });

  it('_tabulatorValidationFailed', () => {
    const properties = {
      setTabulatorValidationFailed: () => {},
      setTabulatorValidationValue: () => {}
    };
    _AnnualTable._tabulatorValidationFailed('mocked_value', properties);
  });

  describe('_dataChanged', () => {
    it('is previously applied', () => {
      const properties = {
        setDataIsValid: () => {}
      };
      spyOn(_AnnualTable, '_isPreviouslyApplied').and.returnValue(true);
      spyOn(_AnnualTable, '_updateIsStale');
      _AnnualTable._dataChanged(
        'mocked_displayData',
        properties,
        'mocked_tabulator',
        'mocked_columnManager');

      expect(_AnnualTable._updateIsStale).toHaveBeenCalled();
    });

    it('is not previously applied', () => {
      const properties = {
        setDataIsValid: () => {},
        savingsDataChanged: () => {}
      };
      spyOn(properties, 'setDataIsValid');
      spyOn(_AnnualTable, '_isPreviouslyApplied').and.returnValue(false);
      spyOn(_AnnualTable, '_updateIsStale');
      spyOn(_AnnualTable, '_data');
      spyOn(_AnnualTable, '_validate');

      _AnnualTable._dataChanged(
        'mocked_displayData',
        properties,
        'mocked_tabulator',
        'mocked_columnManager'
      );

      expect(_AnnualTable._updateIsStale).toHaveBeenCalled();
      expect(properties.setDataIsValid).toHaveBeenCalled();
    });
  });

  it('_isPreviouslyApplied', () => {
    const properties = {
      previouslyAppliedDisplayDataString: 'mocked_dataString'
    };
    spyOn(StringUtils, 'stringify').and.returnValue('mocked_dataString');
    const result = _AnnualTable._isPreviouslyApplied(
      'mocked_currentData',
      properties
    );
    expect(result).toBe(true);
  });

  it('_apply', () => {
    const properties = {
      setPreviouslyAppliedDisplayDataString: () => {},
      change: () => {}
    };
    spyOn(_AnnualTable, '_updateIsStale');
    spyOn(_AnnualTable, '_displayData');
    spyOn(StringUtils, 'stringify');

    _AnnualTable._apply(
      'mocked_data',
      properties,
      'mocked_tabulator',
      'mocked_columnManager'
    );

    expect(StringUtils.stringify).toHaveBeenCalled();
  });

  describe('_updateIsStale', () => {
    it('with stale handler', () => {
      const properties = {
        setDataIsStale: () => {},
        staleHandler: () => {}
      };
      spyOn(properties, 'staleHandler');
      _AnnualTable._updateIsStale('mocked_isStale', properties);
      expect(properties.staleHandler).toHaveBeenCalled();
    });
    it('without stale handler', () => {
      const properties = {
        setDataIsStale: () => {}
      };
      _AnnualTable._updateIsStale('mocked_isStale', properties);
    });
  });

  it('_reset', () => {
    const properties = {
      setDataIsStale: () => {}
    };
    const mockedTabulator = {
      setData: () => {}
    };
    const mockedColumnManager = {
      resetColumns: () => {}
    };
    spyOn(_AnnualTable, '_displayData');
    spyOn(_AnnualTable, '_dataChanged');

    _AnnualTable._reset(
      properties,
      mockedTabulator,
      mockedColumnManager
    );

    expect(_AnnualTable._dataChanged).toHaveBeenCalled();
  });

  describe('_clear', () => {
    it('with selection', () => {
      const mockedTabulator = {
        setData: () => {}
      };
      const mockedRowManager = {
        deleteRows: () => {},
        selectedRows: ['mocked_row']
      };
      spyOn(mockedRowManager, 'deleteRows');
      spyOn(_AnnualTable, '_displayData');
      spyOn(_AnnualTable, '_dataChanged');

      _AnnualTable._clear(
        'mocked_properties',
        mockedTabulator,
        'mocked_columnManager',
        mockedRowManager
      );

      expect(mockedRowManager.deleteRows).toHaveBeenCalled();
    });

    describe('without selection', () => {
      it('with confirmation', () => {
        const mockedTabulator = {
          setData: () => {}
        };
        const mockedRowManager = {
          deleteRows: () => {},
          selectedRows: [],
          addRow: () => {}
        };
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(_AnnualTable, '_displayData');
        spyOn(_AnnualTable, '_dataChanged');

        _AnnualTable._clear(
          'mocked_properties',
          mockedTabulator,
          'mocked_columnManager',
          mockedRowManager
        );

        expect(_AnnualTable._dataChanged).toHaveBeenCalled();
      });

      it('without confirmation', () => {
        const mockedTabulator = {
          setData: () => {}
        };
        const mockedRowManager = {
          deleteRows: () => {},
          selectedRows: []
        };
        spyOn(window, 'confirm').and.returnValue(false);

        _AnnualTable._clear(
          'mocked_properties',
          mockedTabulator,
          'mocked_columnManager',
          mockedRowManager
        );

        expect(window.confirm).toHaveBeenCalled();
      });
    });
  });

  it('_downloadBlob', async () => {
    const properties = {
      downloadBlob: () => 'mocked_blob'
    };
    spyOn(_AnnualTable, '_dataForDownload');
    const result = await _AnnualTable._downloadBlob(
      'mocked_fileName',
      properties,
      'mocked_tabulator',
      'mocked_columnManager',
      'mocked_rowManager'
    );
    expect(result).toBe('mocked_blob');
  });

  describe('_dataForDownload', () => {
    it('with tabulator', () => {
      const columnManager = {
        dataHeaders: 'mocked_headers'
      };
      const rowManager = {
        rowData: ['mocked_row']
      };
      const result = _AnnualTable._dataForDownload(
        'mocked_tabulator',
        columnManager,
        rowManager
      );
      expect(result).toStrictEqual(['mocked_headers', 'mocked_row']);
    });

    it('without tabulator', () => {
      const columnManager = {
        dataHeaders: 'mocked_headers'
      };
      const rowManager = {
        rowData: 'mocked_rowData'
      };
      const result = _AnnualTable._dataForDownload(
        undefined,
        columnManager,
        rowManager
      );
      expect(result).toStrictEqual([]);
    });
  });

  describe('_convertValues', () => {
    it('with converter', () => {
      const displayData = [
        { foo: 1, baa: 10, details: {} },
        { foo: 2, baa: 20, details: {} }
      ];
      const columns = [
        { field: 'foo' },
        { field: 'baa' },
        { field: 'details' }
      ];
      window.structuredClone = data => data;
      spyOn(_AnnualTable, '_valueConverter').and.returnValue(() => 'mocked_id');
      const result = _AnnualTable._convertValues(
        displayData,
        columns
      );
      expect(result).toStrictEqual([
        { id_foo: 'mocked_id', id_baa: 'mocked_id', details: 'mocked_id' },
        { id_foo: 'mocked_id', id_baa: 'mocked_id', details: 'mocked_id' }
      ]);
    });

    it('without converter', () => {
      const displayData = [
        { foo: 1, baa: 10 },
        { foo: 2, baa: 20 }
      ];
      const columns = [
        { field: 'foo' },
        { field: 'baa' }
      ];
      window.structuredClone = data => data;
      // eslint-disable-next-line unicorn/no-useless-undefined
      spyOn(_AnnualTable, '_valueConverter').and.returnValue(undefined);
      const result = _AnnualTable._convertValues(
        displayData,
        columns
      );
      expect(result).toStrictEqual([
        { foo: 1, baa: 10 },
        { foo: 2, baa: 20 }
      ]);
    });
  });

  describe('_valueConverter', () => {
    describe('with editorParams', () => {
      describe('with direct editorParams', () => {
        it('with value converter', () => {
          const column = {
            editorParams: {
              valueConverter: 'mocked_converter'
            }
          };
          const result = _AnnualTable._valueConverter(column);
          expect(result).toBe('mocked_converter');
        });

        it('without value converter', () => {
          const column = {
            editorParams: {
              foo: 'baa'
            }
          };
          const result = _AnnualTable._valueConverter(column);
          expect(result).toBeUndefined();
        });
      });

      describe('with functional editorParams', () => {
        it('with converter', () => {
          const column = {
            editorParams: () => {
              return {
                valueConverter: 'mocked_converter'
              };
            }
          };
          const result = _AnnualTable._valueConverter(column);
          expect(result).toBe('mocked_converter');
        });

        it('without converter', () => {
          const column = {
            editorParams: () => {
              return {
                foo: 'baa'
              };
            }
          };
          const result = _AnnualTable._valueConverter(column);
          expect(result).toBeUndefined();
        });
      });
    });

    it('without editorParams', () => {
      const column = {};
      const result = _AnnualTable._valueConverter(column);
      expect(result).toBeUndefined();
    });
  });
});
/* eslint-enable max-lines */
