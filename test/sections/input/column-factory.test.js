// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import InputFilter from '../../../src/sections/input/input-filter';
import InputValidator from '../../../src/sections/input/input-validator';
import ColumnFactory from '../../../src/sections/input/column-factory';
import DataFactory from '../../../src/sections/input/data-factory';
import ReactDom from 'react-dom/client';
describe('main', () => {
  it('actionTypeItems', () => {
    const mockedContext = {
      actionTypes: {
        rows: 'mocked_actionTypeRows'
      }
    };

    spyOn(ColumnFactory, '_selectableItems').and.returnValue('mocked_items');
    const items = ColumnFactory.actionTypeItems(mockedContext);
    expect(items).toBe('mocked_items');
  });

  it('annualOffset', () => {
    spyOn(ColumnFactory, 'numberOfPrefixColumns').and.returnValue(5);
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    expect(ColumnFactory.annualOffset()).toBe(7);
  });

  it('createAnnualColumn', () => {
    const result = ColumnFactory.createAnnualColumn(2000);
    expect(result.title).toBe(2000);
    expect(result.field).toBe('2000');

    const formatter = result.formatter;
    spyOn(ColumnFactory, '_formatAnnualCell');
    formatter();
    expect(ColumnFactory._formatAnnualCell).toHaveBeenCalled();

    // const cellClick = result.cellClick;
    // spyOn(ColumnFactory, '_handleCellClick');
    // cellClick();
    // expect(ColumnFactory._handleCellClick).toHaveBeenCalled();
  });

  it('createColumns', () => {
    const mockedHeaders = ['Subsector', 'ActionType', '2000'];
    spyOn(ColumnFactory, '_createBasicColumns').and.returnValue([
      'mocked_basic_column'
    ]);
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    spyOn(ColumnFactory, 'createAnnualColumn').and.returnValue(
      'mocked_year_column'
    );
    spyOn(ColumnFactory, '_createDetailsColumn').and.returnValue(
      'mocked_details_column'
    );
    const result = ColumnFactory.createColumns(
      mockedHeaders,
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping',
      'mocked_context',
      'mocked_runtime',
      'mocked_unit',
      'mocked_getPopulation'
    );
    expect(result).toStrictEqual([
      'mocked_basic_column',
      'mocked_year_column',
      'mocked_details_column'
    ]);
  });

  describe('createDefaultColumns', () => {
    it('with default savings', () => {
      spyOn(ColumnFactory, '_createDefaultColumnsFromSavings').and.returnValue(
        'mocked_result'
      );
      const result = ColumnFactory.createDefaultColumns(
        'mocked_idMode',
        'mocked_defaultSavings',
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        'mocked_resetActionTypeById'
      );
      expect(result).toBe('mocked_result');
    });

    it('without default savings', () => {
      spyOn(ColumnFactory, '_createDefaultColumnsFromScratch').and.returnValue(
        'mocked_result'
      );
      const result = ColumnFactory.createDefaultColumns(
        'mocked_idMode',
        undefined,
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        'mocked_resetActionTypeById'
      );
      expect(result).toBe('mocked_result');
    });
  });

  it('createDetailsColumn', () => {
    const mockedFormatDetailsCell = jest.fn();
    spyOn(ColumnFactory, '_formatDetailsCell').and.callFake(
      mockedFormatDetailsCell
    );
    const result = ColumnFactory._createDetailsColumn();
    result.formatter();
    expect(result.toBeDefined);
    expect(mockedFormatDetailsCell).toBeCalled();
  });

  it('dataHeaders', () => {
    const mockedColumn = { title: 'mocked_column_title' };
    const columns = [mockedColumn, mockedColumn, mockedColumn];
    spyOn(ColumnFactory, 'numberOfPrefixColumns').and.returnValue(2);
    const result = ColumnFactory.dataHeaders(columns);
    expect(result).toStrictEqual(['mocked_column_title']);
  });

  it('itemMap', () => {
    const properties = {
      context: 'mocked_context'
    };
    spyOn(ColumnFactory, 'subsectorItems').and.returnValue('mocked_items');
    spyOn(ColumnFactory, 'actionTypeItems');
    spyOn(ColumnFactory, '_finalEnergyCarrierItems');
    const result = ColumnFactory.itemMap(properties);
    expect(result).toBeDefined();
    expect(result.Subsector.key).toBe('id_subsector');
    expect(result.Subsector.items).toBe('mocked_items');
  });

  it('keyColumnHeadersForParameter', () => {
    const result = ColumnFactory.keyColumnHeadersForParameter(
      'FuelSplitCoefficient'
    );
    expect(result).toBeDefined();
  });

  it('keyColumnHeadersForSavings', () => {
    expect(1).toBe(1);
  });

  it('numberOfKeyColumns', () => {
    expect(ColumnFactory.numberOfKeyColumns()).toBe(2);
  });

  it('numberOfPrefixColumns', () => {
    expect(ColumnFactory.numberOfPrefixColumns()).toBe(2);
  });

  it('subsectorItems', () => {
    const mockedContext = {
      subsectors: {
        rows: 'mocked_subsectorRows'
      }
    };
    spyOn(ColumnFactory, '_selectableItems').and.returnValue('mocked_items');
    const items = ColumnFactory.subsectorItems(mockedContext);
    expect(items).toBe('mocked_items');
  });

  describe('_actionTypeEditorParameters', () => {
    it('with cell proxy', () => {
      const mockedCellProxy = {
        _cell: {
          row: {
            data: {
              subsector: 'mocked_subsector'
            }
          }
        }
      };
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const mockedFilterDelegate = () => {};
      spyOn(ColumnFactory, '_toEditorValues').and.returnValue('mocked_values');

      const result = ColumnFactory._actionTypeEditorParameters(
        mockedCellProxy,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        mockedFilterDelegate
      );

      expect(result.values).toBe('mocked_values');
      expect(result.itemFormatter).toBe(ColumnFactory._optionFormatter);
      expect(result.valueConverter).toBe(ColumnFactory._valueConverter);
    });

    it('without cell proxy', () => {
      const result = ColumnFactory._actionTypeEditorParameters(
        undefined,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        'mocked_filterDelegate'
      );

      expect(result.values).toStrictEqual([]);
      expect(result.itemFormatter).toBe(ColumnFactory._optionFormatter);
      expect(result.valueConverter).toBe(ColumnFactory._valueConverter);
    });
  });

  describe('_actionTypeIsValidForSubsector', () => {
    it('with actionTypeItem', () => {
      const mockedItems = ['mocked_actionTypeItem'];
      spyOn(InputFilter, 'filterActionTypesBySubsector').and.returnValue(
        mockedItems
      );
      const result = ColumnFactory._actionTypeIsValidForSubsector(
        'mocked_subsectorItem',
        'mocked_actionTypeItem',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toBe(true);
    });

    it('without actionTypeItem', () => {
      const result = ColumnFactory._actionTypeIsValidForSubsector(
        'mocked_subsectorItem',
        undefined,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toBe(true);
    });
  });

  it('_createActionTypeColumn', () => {
    const result = ColumnFactory._createActionTypeColumn(
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping',
      'mocked_filterDelegate'
    );
    expect(result.field).toBe('action_type');
    const editorParameters = result.editorParams;
    spyOn(ColumnFactory, '_actionTypeEditorParameters');
    editorParameters();
    expect(ColumnFactory._actionTypeEditorParameters).toHaveBeenCalled();
  });

  it('_createBasicColumns', () => {
    spyOn(ColumnFactory, '_createRowNumberColumn').and.returnValue(
      'mocked_rowNumberColumn'
    );
    spyOn(ColumnFactory, '_createSelectionColumn').and.returnValue(
      'mocked_selectionColumn'
    );
    spyOn(ColumnFactory, '_createSubsectorColumn').and.returnValue(
      'mocked_subsectorColumn'
    );

    let passedFilterDelegate;
    const mockedCreateActionTypeColumn = (
      actionTypeItems,
      actionTypeMapping,
      filterDelegate
    ) => {
      passedFilterDelegate = filterDelegate;
      return 'mocked_actionTypeColumn';
    };
    spyOn(ColumnFactory, '_createActionTypeColumn').and.callFake(
      mockedCreateActionTypeColumn
    );
    const result = ColumnFactory._createBasicColumns(
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping',
      'mocked_resetActionTypeById'
    );
    const expectedColumns = [
      'mocked_rowNumberColumn',
      'mocked_selectionColumn',
      'mocked_subsectorColumn',
      'mocked_actionTypeColumn'
    ];
    expect(result).toStrictEqual(expectedColumns);

    spyOn(InputFilter, 'filterActionTypesBySubsector');
    passedFilterDelegate();
    expect(InputFilter.filterActionTypesBySubsector).toHaveBeenCalled();
  });

  describe('_createDefaultColumnsFromSavings', () => {
    it('without validation error', () => {
      const mockedSavings = ['mocked_headers', 'mocked_row'];

      spyOn(InputValidator, 'validateHeaders').and.returnValue();
      spyOn(ColumnFactory, '_filterDefaultHeadersForMode').and.returnValue(
        'mocked_headers'
      );
      spyOn(ColumnFactory, 'createColumns').and.returnValue('mocked_result');

      const result = ColumnFactory._createDefaultColumnsFromSavings(
        'mocked_idMode',
        mockedSavings,
        'mocked_subsectorItems',
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        'mocked_resetActionTypeById'
      );
      expect(result).toBe('mocked_result');
    });

    it('_filterDefaultHeadersForMode', () => {
      const dataHeaders = ['Subsector', 'Importance', 2000, 2020, 2030];
      spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
      spyOn(ColumnFactory, '_defaultYears').and.returnValue([2000]);
      const result = ColumnFactory._filterDefaultHeadersForMode(
        dataHeaders,
        'mocked_idMode'
      );
      expect(result).toStrictEqual(['Subsector', 'Importance', 2000]);
    });

    it('with validation error', () => {
      const mockedHeaders = ['mocked_header', 'mocked_header'];
      const mockedSavings = [mockedHeaders, 'mocked_row'];

      spyOn(InputValidator, 'validateHeaders').and.returnValue(
        'mocked_valiation_error'
      );

      expect(() =>
        ColumnFactory._createDefaultColumnsFromSavings(
          'mocked_idMode',
          mockedSavings,
          'mocked_subsectorItems',
          'mocked_actionTypeItems',
          'mocked_actionTypeMapping',
          'mocked_resetActionTypeById'
        )
      ).toThrowError();
    });
  });

  it('_createDefaultColumnsFromScratch', () => {
    spyOn(ColumnFactory, '_createBasicColumns').and.returnValue([
      'mocked_basic_column'
    ]);
    spyOn(ColumnFactory, '_defaultYears').and.returnValue(['mocked_year']);
    spyOn(ColumnFactory, 'createAnnualColumn').and.returnValue(
      'mocked_annual_column'
    );
    const result = ColumnFactory._createDefaultColumnsFromScratch(
      'mocked_idMode',
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping',
      'mocked_context',
      'mocked_runtime'
    );
    const expectedColumns = [
      'mocked_basic_column',
      'mocked_annual_column'
    ];
    expect(result).toContain(expectedColumns[0]);
    expect(result).toContain(expectedColumns[1]);
  });

  it('_createRowNumberColumn', () => {
    const result = ColumnFactory._createRowNumberColumn();
    expect(result.field).toBe('row_number');
  });

  it('_createSelectionColumn', () => {
    const result = ColumnFactory._createSelectionColumn();
    expect(result.field).toBe('active');

    const cellClick = result.cellClick;
    spyOn(ColumnFactory, '_toggleBooleanCellValue');
    cellClick();
    expect(ColumnFactory._toggleBooleanCellValue).toHaveBeenCalled();

    const formatter = result.formatter;
    spyOn(ColumnFactory, '_selectionColumnFormatter');
    formatter();
    expect(ColumnFactory._selectionColumnFormatter).toHaveBeenCalled();
  });

  it('_createSubsectorColumn', () => {
    spyOn(ColumnFactory, '_toEditorValues').and.returnValue('mocked_values');
    const result = ColumnFactory._createSubsectorColumn(
      'mocked_subsectorItems',
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping',
      'mocked_resetActionTypeById'
    );
    expect(result.field).toBe('subsector');
    const cellEdited = result.cellEdited;
    spyOn(ColumnFactory, '_subsectorColumnChanged');
    cellEdited();
    expect(ColumnFactory._subsectorColumnChanged).toHaveBeenCalled();
  });

  describe('_detailsValueConverter', () => {
    it('empty', () => {
      const rawDetails = {};
      const result = ColumnFactory._detailsValueConverter(rawDetails);
      expect(result.parameters).toStrictEqual([]);
      expect(result.finalParameters).toStrictEqual([]);
    });

    it('not empty', () => {
      const rawDetails = {
        foo: 'baa'
      };
      spyOn(DataFactory, 'convertMainParameters');
      spyOn(DataFactory, 'convertFuelSwitch');
      spyOn(DataFactory, 'convertResidential').and.returnValue('mockedResult');
      const result = ColumnFactory._detailsValueConverter(rawDetails);
      expect(result).toBe('mockedResult');
    });
  });

  it('_defaultYears', () => {
    expect(ColumnFactory._defaultYears(1)).toStrictEqual([2020, 2025, 2030]);
    expect(ColumnFactory._defaultYears(2)).toStrictEqual([2020, 2025, 2030]);
    expect(ColumnFactory._defaultYears(3)).toStrictEqual([2010, 2015, 2020]);
    expect(ColumnFactory._defaultYears(4)).toStrictEqual([2000, 2010, 2020]);
    expect(() => ColumnFactory._defaultYears(5)).toThrowError();
  });

  it('_downloadMeasure', async () => {
    const mockedCell = {
      _cell: {
        row: {
          data: {
            unit: 'mocked_unit'
          }
        }
      }
    };

    const mockedContext = {
      idMode: 1,
      idRegion: 1
    };

    const mockedRuntime = {
      apiCall: () => {}
    };
    spyOn(mockedRuntime, 'apiCall').and.returnValue(Promise.resolve('mockedResult'));

    const mockedGetPopulation = () => 'mocked_population';

    const result = await ColumnFactory._downloadMeasure(
      'mocked_fileName',
      mockedCell,
      mockedContext,
      mockedRuntime,
      'mockedUnit',
      mockedGetPopulation
    );
    expect(result).toBe('mockedResult');
  });

  it('_finalEnergyCarrierItems', () => {
    const mockedContext = {
      finalEnergyCarriers: {
        rows: 'mocked_actionTypeRows'
      }
    };

    spyOn(ColumnFactory, '_selectableItems').and.returnValue('mocked_items');
    const items = ColumnFactory._finalEnergyCarrierItems(mockedContext);
    expect(items).toBe('mocked_items');
  });

  describe('_formatAnnualCell', () => {
    it('zero value', () => {
      const mockedElement = {
        style: {}
      };
      const mockedCell = {
        getValue: () => 0,
        getElement: () => mockedElement
      };
      ColumnFactory._formatAnnualCell(mockedCell);
      expect(mockedElement.style.backgroundColor).toBeDefined();
    });

    it('non zero value', () => {
      const mockedElement = {
        style: {}
      };
      const mockedCell = {
        getValue: () => 10,
        getElement: () => mockedElement
      };
      ColumnFactory._formatAnnualCell(mockedCell);
      expect(mockedElement.style.backgroundColor).toBe('');
    });
  });

  it('_formatDetailsCell', async () => {
    spyOn(document, 'createElement').and.returnValue('mocked_div');

    let passedCellContent;
    spyOn(ReactDom, 'createRoot').and.returnValue({ render: cellContent => { passedCellContent = cellContent; } });

    const result = ColumnFactory._formatDetailsCell(
      'mockedCell',
      'mockedContext',
      'mockedRuntime',
      'mockedUnit',
      'mockedGedPopulation'
    );
    expect(result).toBe('mocked_div');

    const children = passedCellContent.props.children;

    const download = children[0];
    const blob = download.props.blob;
    spyOn(ColumnFactory, '_downloadMeasure');
    await blob();
    expect(ColumnFactory._downloadMeasure).toBeCalled();

    const upload = children[1];
    const change = upload.props.change;
    spyOn(ColumnFactory, '_uploadMeasure');
    change();
    expect(ColumnFactory._uploadMeasure).toBeCalled();
  });

  describe('_listEditorFormatter', () => {
    it('is empty', () => {
      const mockedElement = {
        style: {}
      };

      const mockedCell = {
        getValue: () => {},
        getElement: () => mockedElement
      };

      const result = ColumnFactory._listEditorFormatter(mockedCell);
      expect(result).toBe('Please select...');
      expect(mockedElement.style.backgroundColor).toBeDefined();
    });

    it('is not empty', () => {
      const mockedElement = {
        style: {}
      };

      const mockedSelctableItem = {
        toString: () => 'mocked_label'
      };

      const mockedCell = {
        getValue: () => mockedSelctableItem,
        getElement: () => mockedElement
      };

      const result = ColumnFactory._listEditorFormatter(mockedCell);
      expect(result).toBe('mocked_label');
      expect(mockedElement.style.backgroundColor).toBe('');
    });
  });

  it('_resetActionTypeById', async () => {
    const tabulator = {
      updateData: () => {}
    };
    spyOn(tabulator, 'updateData');
    await ColumnFactory._resetActionTypeById(tabulator, 'mocked_id');
    expect(tabulator.updateData).toHaveBeenCalled();
  });

  describe('_selectionColumnFormatter', () => {
    it('selected', () => {
      const mockedCell = {
        getValue: () => true
      };
      const result = ColumnFactory._selectionColumnFormatter(mockedCell);
      expect(result).toBeDefined();
    });

    it('not selected', () => {
      const mockedCell = {
        getValue: () => false
      };
      const result = ColumnFactory._selectionColumnFormatter(mockedCell);
      expect(result).toBeDefined();
    });
  });

  describe('_subsectorColumnChanged', () => {
    const mockedEvent = {
      _cell: {
        row: {
          data: {
            id: 'mocked_id',
            subsector: 'mocked_subsector',
            action_type: 'mocked_action_type'
          },
          table: 'mocked_tabulator'
        }
      }
    };

    it('is valid', async () => {
      spyOn(ColumnFactory, '_actionTypeIsValidForSubsector').and.returnValue(
        true
      );
      await ColumnFactory._subsectorColumnChanged(
        mockedEvent,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping',
        'mocked_ResetActionTypeByI'
      );
      expect(ColumnFactory._actionTypeIsValidForSubsector).toHaveBeenCalled();
    });

    it('is not valid', async () => {
      spyOn(ColumnFactory, '_actionTypeIsValidForSubsector').and.returnValue(
        false
      );
      spyOn(ColumnFactory, '_resetActionTypeById');
      await ColumnFactory._subsectorColumnChanged(
        mockedEvent,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(ColumnFactory._actionTypeIsValidForSubsector).toHaveBeenCalled();
    });
  });

  it('_toEditorValues', () => {
    const mockedItem = {
      label: 'mocked_label',
      value: 'mocked_value'
    };
    const mockedItems = [mockedItem];
    const result = ColumnFactory._toEditorValues(mockedItems);
    expect(result.length).toBe(1);
    const firstEditorValue = result[0];
    expect(firstEditorValue.label).toBe('mocked_label');
    expect(firstEditorValue.value).toStrictEqual(mockedItem);
  });

  it('_toggleBooleanCellValue', () => {
    const mockedCell = {
      getValue: () => true,
      setValue: () => {}
    };
    spyOn(mockedCell, 'setValue');
    ColumnFactory._toggleBooleanCellValue(mockedCell);
    expect(mockedCell.setValue).toHaveBeenCalledWith(false);
  });

  it('_optionFormatter', () => {
    const mockedValue = {
      toString: () => 'mocked_display_string'
    };

    const result = ColumnFactory._optionFormatter('mocked_label', mockedValue);

    expect(result).toBe('mocked_display_string');
  });

  it('_rowToSelectableItem', () => {
    const mockedRow = ['mocked_id', 'mocked_label', 'mocked_description'];
    const item = ColumnFactory._rowToSelectableItem(mockedRow);
    expect(item.id).toBe('mocked_id');
    expect(item.label).toBe('mocked_label');
  });

  it('_selectableItems', () => {
    spyOn(ColumnFactory, '_rowToSelectableItem').and.returnValue('mocked_item');
    const items = ColumnFactory._selectableItems(['mocked_idTableRow']);
    expect(items).toStrictEqual(['mocked_item']);
  });

  it('_uploadMeasure', () => {
    const mockedRow = {
      update: () => {}
    };
    spyOn(mockedRow, 'update');

    const mockedCell = {
      getRow: () => mockedRow
    };

    spyOn(DataFactory, 'extractSavings').and.returnValue(['mockedSavings', 'mockedJson']);
    spyOn(DataFactory, 'synchronizeEntries').and.returnValue({});

    ColumnFactory._uploadMeasure(
      'mocked_jsonData',
      mockedCell
    );

    expect(mockedRow.update).toBeCalled();
  });

  describe('_valueConverter', () => {
    it('without item', () => {
      const result = ColumnFactory._valueConverter();
      expect(result).toBe(undefined);
    });

    it('with item', () => {
      const mockedItem = { id: 'mocked_id' };
      const result = ColumnFactory._valueConverter(mockedItem);
      expect(result).toBe('mocked_id');
    });
  });
});
