// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import ColumnFactory from '../../../../src/sections/input/column-factory';
import ColumnManager from '../../../../src/sections/input/table/column-manager';

describe('public API', () => {
  let sut;
  beforeEach(() => {
    sut = new ColumnManager('mockedProperties');
  });

  it('construction', () => {
    expect(sut).toBeDefined();
  });

  it('removeId', () => {
    const data = [
      { id: 1, foo: 10 },
      { id: 2, foo: 20 }
    ];
    window.structuredClone = data => data;
    const result = ColumnManager.removeId(data);
    expect(result).toStrictEqual([
      { foo: 10 },
      { foo: 20 }
    ]);
  });

  it('setTabulator', () => {
    sut.setTabulator('mocked_tabulator');
    expect(sut._tabulator).toBe('mocked_tabulator');
  });

  it('setDataChanged', () => {
    sut.setDataChanged('mocked_dataChanged');
    expect(sut._dataChanged).toBe('mocked_dataChanged');
  });

  describe('addAnnualColumn', () => {
    it('with warning', async () => {
      spyOn(sut, '_validateNewColumnYear').and.returnValue('mocked_warning');
      spyOn(window, 'alert');
      await sut.addAnnualColumn('mocked_newColumnYear', 'mocked_setter');
      expect(window.alert).toHaveBeenCalled();
    });

    it('without warning', async () => {
      spyOn(sut, '_validateNewColumnYear').and.returnValue();
      spyOn(sut, '_previousAnnualColumnValues');
      spyOn(sut, '_insertNewAnnualColumn');
      spyOn(sut, '_fillNewColumnWithPreviousColumnValues');
      spyOn(sut, '_updateNewColumnYear');
      sut._dataChanged = () => {};
      spyOn(sut, '_dataChanged');
      await sut.addAnnualColumn('mocked_newColumnYear', 'mocked_setter');
      expect(sut._dataChanged).toHaveBeenCalled();
    });
  });

  describe('createNewColumnYear', () => {
    it('without annual column', () => {
      jest.spyOn(sut, 'columns', 'get').mockReturnValue(['mocked_detail_column']);
      sut._startYear = 'mocked_start_year';
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      const result = sut.createNewColumnYear();
      expect(result).toBe('mocked_start_year');
    });

    it('with single annual column', () => {
      jest.spyOn(sut, 'columns', 'get').mockReturnValue([
        'mocked_row_number_column',
        'mocked_active_column',
        'mocked_subsector_column',
        'mocked_action_type_column',
        'mocked_annual_column',
        'mocked_detail_column'
      ]);
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      spyOn(sut, '_applyDefaultIncrement').and.returnValue('mocked_year');
      const result = sut.createNewColumnYear();
      expect(result).toBe('mocked_year');
    });

    it('with multiple annual columns', () => {
      jest.spyOn(sut, 'columns', 'get').mockReturnValue([
        'mocked_row_number_column',
        'mocked_active_column',
        'mocked_subsector_column',
        'mocked_action_type_column',
        'mocked_annual_column',
        'mocked_annual_column',
        'mocked_detail_column'
      ]);
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      spyOn(sut, '_increaseByDifference').and.returnValue('mocked_new_year');
      const result = sut.createNewColumnYear();
      expect(result).toBe('mocked_new_year');
    });
  });

  it('filterDataByColumns', () => {
    const mockedColumns = [
      { field: 'baa' }
    ];
    jest.spyOn(sut, 'columns', 'get').mockReturnValue(mockedColumns);
    const mockedData = [
      { foo: 1, baa: 10 },
      { foo: 2, baa: 20 }
    ];
    const result = sut.filterDataByColumns(mockedData);
    expect(result).toStrictEqual([
      { baa: 10 },
      { baa: 20 }
    ]);
  });

  describe('newColumnYearChanged', () => {
    it('without year number', () => {
      const event = {
        target: {
          value: undefined
        }
      };
      sut.newColumnYearChanged(
        event,
        'mocked_previousYearNumber',
        'mocked_setter'
      );
      expect(event.target.value).toBe('mocked_previousYearNumber');
    });

    it('with year number', () => {
      const event = {
        target: {
          value: '2020'
        }
      };
      let passedYear;
      const setNewColumnYear = year => {
        passedYear = year;
      };
      sut.newColumnYearChanged(
        event,
        'mocked_previousYearNumber',
        setNewColumnYear
      );
      expect(passedYear).toBe(2020);
    });
  });

  it('resetColumns', () => {
    spyOn(sut, 'extendAnnualColumns');
    sut.props = { defaultColumns: 'mocked_defaultColumns' };
    const mockedTabulator = {
      setColumns: () => {}
    };
    spyOn(mockedTabulator, 'setColumns');
    sut._tabulator = mockedTabulator;

    sut.resetColumns();

    expect(sut.extendAnnualColumns).toHaveBeenCalled();
    expect(mockedTabulator.setColumns).toHaveBeenCalled();
  });

  it('extendAnnualColumns', () => {
    const columns = ['mocked_columns'];
    spyOn(sut, '_extendColumnWithMenuIfAnnual').and.returnValue('mocked_extended_column');
    const result = sut.extendAnnualColumns(columns);
    expect(result).toStrictEqual(['mocked_extended_column']);
  });

  it('_applyDefaultIncrement', () => {
    const mockedColumn = {
      title: 2020
    };
    const result = sut._applyDefaultIncrement(mockedColumn);
    expect(result).toBe(2020 + 5);
  });

  it('_increaseByDifference', () => {
    const mockedLeftColumn = {
      title: 2020
    };
    const mockedRightColumn = {
      title: 2030
    };
    const mockedColumns = [mockedLeftColumn, mockedRightColumn];
    const result = sut._increaseByDifference(mockedColumns);
    expect(result).toBe(2030 + 10);
  });

  describe('_extendColumnWithMenuIfAnnual', () => {
    it('annual column', () => {
      const column = {
        title: 2020
      };
      spyOn(sut, '_headerMenu').and.returnValue('mocked_header_menu');
      const result = sut._extendColumnWithMenuIfAnnual(column);
      expect(result.headerContextMenu).toBe('mocked_header_menu');
    });

    it('non annual column', () => {
      const column = {
        title: 'subsector'
      };
      const result = sut._extendColumnWithMenuIfAnnual(column);
      expect(result).toStrictEqual(column);
    });
  });

  describe('_fillNewColumnWithPreviousColumnValues', () => {
    it('with previous values', () => {
      const previousColumnValues = [1, 2, 3];
      const mockedData = [
        { mocked_title: undefined },
        { mocked_title: undefined },
        { mocked_title: undefined }
      ];

      const mockedTabulator = {
        getData: () => mockedData,
        setData: () => {}
      };
      spyOn(mockedTabulator, 'setData');
      sut._tabulator = mockedTabulator;
      sut._fillNewColumnWithPreviousColumnValues(
        'mocked_title',
        previousColumnValues
      );
      const expectedData = [
        { mocked_title: 1 },
        { mocked_title: 2 },
        { mocked_title: 3 }
      ];
      expect(mockedTabulator.setData).toHaveBeenCalledWith(expectedData);
    });

    it('without previous values', () => {
      const previousColumnValues = [];
      const mockedData = [
        { mocked_title: undefined },
        { mocked_title: undefined },
        { mocked_title: undefined }
      ];

      const mockedTabulator = {
        getData: () => mockedData,
        setData: () => {}
      };
      spyOn(mockedTabulator, 'setData');
      sut._tabulator = mockedTabulator;
      sut._fillNewColumnWithPreviousColumnValues(
        'mocked_title',
        previousColumnValues
      );
      const expectedData = [
        { mocked_title: 0 },
        { mocked_title: 0 },
        { mocked_title: 0 }
      ];
      expect(mockedTabulator.setData).toHaveBeenCalledWith(expectedData);
    });
  });

  it('_insertNewAnnualColumn', () => {
    const mockedPosition = {
      before: false,
      referenceField: 'foo'
    };
    spyOn(sut, '_newPosition').and.returnValue(mockedPosition);
    spyOn(sut, '_createNewAnnualColumn');
    sut._tabulator = {
      addColumn: () => {}
    };
    spyOn(sut._tabulator, 'addColumn');

    sut._insertNewAnnualColumn('mocked_newColumnYear');
    expect(sut._tabulator.addColumn).toHaveBeenCalled();
  });

  describe('_newPosition', () => {
    it('first annaul column', () => {
      spyOn(sut, '_newAnnualColumnIndex').and.returnValue(0);
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      const mockedColumns = [
        { field: 'row_number' },
        { field: 'active' },
        { field: 'subsector' },
        { field: 'action_type' }
      ];
      jest.spyOn(sut, 'columns', 'get').mockReturnValue(mockedColumns);
      const result = sut._newPosition('mocked_year');
      expect(result).toStrictEqual({
        before: false,
        referenceField: 'action_type'
      });
    });

    it('after last annual column', () => {
      spyOn(sut, '_newAnnualColumnIndex').and.returnValue(1);
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      const mockedColumns = [
        { field: 'row_number' },
        { field: 'active' },
        { field: 'subsector' },
        { field: 'action_type' },
        { field: '2000' }
      ];
      jest.spyOn(sut, 'columns', 'get').mockReturnValue(mockedColumns);
      const result = sut._newPosition('mocked_year');
      expect(result).toStrictEqual({
        before: false,
        referenceField: '2000'
      });
    });

    it('interim column', () => {
      spyOn(sut, '_newAnnualColumnIndex').and.returnValue(1);
      spyOn(ColumnFactory, 'annualOffset').and.returnValue(4);
      const mockedColumns = [
        { field: 'row_number' },
        { field: 'active' },
        { field: 'subsector' },
        { field: 'action_type' },
        { field: '2000' },
        { field: '2020' }
      ];
      jest.spyOn(sut, 'columns', 'get').mockReturnValue(mockedColumns);
      const result = sut._newPosition('mocked_year');
      expect(result).toStrictEqual({
        before: true,
        referenceField: '2020'
      });
    });
  });

  it('_newAnnualColumnIndex', () => {
    const mockedAnnualHeaders = [2000, 2020];
    jest.spyOn(sut, '_annualHeaders', 'get').mockReturnValue(mockedAnnualHeaders);
    const result = sut._newAnnualColumnIndex(2010);
    expect(result).toBe(1);
  });

  describe('_validateNewColumnYear', () => {
    it('without year', () => {
      const result = sut._validateNewColumnYear();
      expect(result).toBe('Please enter a valid year for the new column first.');
    });

    it('year < min', () => {
      sut.props = {
        minYear: 2000,
        maxYear: 2050
      };
      const result = sut._validateNewColumnYear(1900);
      expect(result).toBe('Please enter a year within 2000 <= year <= 2050.');
    });

    it('year > max', () => {
      sut.props = {
        minYear: 2000,
        maxYear: 2050
      };
      const result = sut._validateNewColumnYear(3000);
      expect(result).toBe('Please enter a year within 2000 <= year <= 2050.');
    });

    it('column already exists', () => {
      sut.props = {
        minYear: 2000,
        maxYear: 2050
      };
      spyOn(sut, '_containsColumn').and.returnValue(true);
      const result = sut._validateNewColumnYear(2020);
      expect(result).toBe('Column already exists. Please choose a unique column name.');
    });

    it('normal usage', () => {
      sut.props = {
        minYear: 2000,
        maxYear: 2050
      };
      spyOn(sut, '_containsColumn').and.returnValue(false);
      const result = sut._validateNewColumnYear(2020);
      expect(result).toBeUndefined();
    });
  });

  it('_updateNewColumnYear', () => {
    spyOn(sut, 'createNewColumnYear');
    sut._updateNewColumnYear(() => {});
    expect(sut.createNewColumnYear).toHaveBeenCalled();
  });

  it('_containsColumn', () => {
    const mockedColumn = { definition: { title: 'mocked_title' } };
    const mockedColumns = [
      { _column: mockedColumn }
    ];
    const mockedTabulator = {
      getColumns: () => mockedColumns
    };
    sut._tabulator = mockedTabulator;
    expect(sut._containsColumn('mocked_title')).toBe(true);
    expect(sut._containsColumn('foo')).toBe(false);
  });

  it('_createNewAnnualColumn', () => {
    sut.props = {
      createAnnualColumn: () => 'mocked_column'
    };
    spyOn(sut, '_extendColumnWithMenuIfAnnual').and.returnValue('mocked_result');
    const result = sut._createNewAnnualColumn('mocked_year');
    expect(result).toBe('mocked_result');
  });

  describe('_previousAnnualColumnValues', () => {
    it('with previous column', () => {
      const mockedColumn = {
        cells: [{ value: 'mocked_value' }]
      };
      spyOn(sut, '_previousAnnualColumn').and.returnValue(mockedColumn);
      const result = sut._previousAnnualColumnValues('mocked_year');
      expect(result).toStrictEqual(['mocked_value']);
    });

    it('without previous column', () => {
      spyOn(sut, '_previousAnnualColumn');
      const result = sut._previousAnnualColumnValues('mocked_year');
      expect(result).toStrictEqual([]);
    });
  });

  describe('_previousAnnualColumn', () => {
    it('with previous year', () => {
      spyOn(sut, '_previousYear').and.returnValue('mocked_year');
      spyOn(sut, '_fullColumnByTitle').and.returnValue('mocked_result');
      const result = sut._previousAnnualColumn('mocked_year');
      expect(result).toBe('mocked_result');
    });

    it('without previous year', () => {
      spyOn(sut, '_previousYear');
      const result = sut._previousAnnualColumn('mocked_year');
      expect(result).toBeUndefined();
    });
  });

  it('_fullColumnByTitle', () => {
    const mockedColumns = [
      { definition: { title: 'mocked_year' } },
      { definition: { title: 2020 } }
    ];

    sut._tabulator = {
      columnManager: {
        columns: mockedColumns
      }
    };
    const result = sut._fullColumnByTitle('mocked_year');
    expect(result).toStrictEqual({ definition: { title: 'mocked_year' } });
  });

  it('_previousYear', () => {
    jest.spyOn(sut, '_annualHeaders', 'get').mockReturnValue([2000, 2010, 2020, 2030]);
    const result = sut._previousYear(2020);
    expect(result).toBe(2010);
  });

  it('_headerMenu', async () => {
    sut._dataChanged = () => {};

    const result = sut._headerMenu();

    expect(result).toBeDefined();

    const action = result[0].action;
    spyOn(sut, '_dataChanged');
    const mockedColumn = {
      delete: () => {}
    };
    spyOn(mockedColumn, 'delete');

    await action('mocked_event', mockedColumn);

    expect(mockedColumn.delete).toHaveBeenCalled();
    expect(sut._dataChanged).toHaveBeenCalled();
  });

  it('_annualHeaders', () => {
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    const mockedHeaders = ['foo', 'baa', 'qux', 'Details'];
    jest.spyOn(sut, 'dataHeaders', 'get').mockReturnValue(mockedHeaders);
    const result = sut._annualHeaders;
    expect(result).toStrictEqual(['qux']);
  });

  it('_headers', () => {
    const mockedColumns = [
      { definition: { title: 'mocked_header' } }
    ];
    sut._tabulator = {
      columnManager: {
        columns: mockedColumns
      }
    };
    const result = sut._headers;
    expect(result).toStrictEqual(['mocked_header']);
  });

  describe('columns', () => {
    it('initialized', () => {
      const mockedColumns = [
        { definition: { title: 'mocked_header' } }
      ];
      sut._tabulator = {
        initialized: true,
        columnManager: {
          columns: mockedColumns
        }
      };
      const result = sut.columns;
      expect(result).toStrictEqual([{ title: 'mocked_header' }]);
    });

    it('not initialized', () => {
      sut._tabulator = {
        initialized: false
      };
      sut.props = {
        defaultColumns: 'mocked_defaultColumns'
      };
      const result = sut.columns;
      expect(result).toBe('mocked_defaultColumns');
    });
  });

  it('dataHeaders', () => {
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    const mockedHeaders = ['foo', 'baa', 'qux'];
    jest.spyOn(sut, '_headers', 'get').mockReturnValue(mockedHeaders);
    const result = sut.dataHeaders;
    expect(result).toStrictEqual(['qux']);
  });
});
/* eslint-enable max-lines */
