// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import RowManager from '../../../../src/sections/input/table/row-manager';
import ColumnFactory from '../../../../src/sections/input/column-factory';
describe('public API', () => {
  let sut;
  beforeEach(() => {
    const mockedProperties = {};
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const mockedTabulatorProxy = () => 'mocked_tabulator';
    sut = new RowManager(
      mockedProperties,
      mockedTabulatorProxy
    );
  });

  it('construction', () => {
    expect(sut).toBeDefined();
  });

  it('setTabulator', () => {
    sut.setTabulator('mocked_tabulator');
    expect(sut._tabulator).toBe('mocked_tabulator');
  });

  it('addRow', () => {
    spyOn(sut, '_createNewRow');
    sut._tabulator = {
      addRow: () => {}
    };
    spyOn(sut._tabulator, 'addRow');

    sut.addRow();

    expect(sut._createNewRow).toHaveBeenCalled();
    expect(sut._tabulator.addRow).toHaveBeenCalled();
  });

  it('deleteRows', () => {
    sut._tabulator = {
      deleteRow: () => {}
    };
    spyOn(sut._tabulator, 'deleteRow');

    const mockedRow = {
      getData: () => { return { id: 'mocked_id' }; }
    };
    const mockedRows = [mockedRow, mockedRow];

    sut.deleteRows(mockedRows);

    expect(sut._tabulator.deleteRow).toHaveBeenCalled();
  });

  it('rowContextMenu', () => {
    spyOn(sut, '_deleteRow');

    const result = sut.rowContextMenu();
    const action = result[0].action;
    action('mocked_event', 'mocked_row');
    expect(sut._deleteRow).toHaveBeenCalled();
  });

  it('_createNewRow', () => {
    const mockedTabulator = {
      getColumnLayout: () => [
        'mocked_column',
        'mocked_column',
        'mocked_column'
      ]
    };
    sut._tabulator = mockedTabulator;

    const mockedProperties = {
      createNewRowData: () => {}
    };
    sut.props = mockedProperties;
    spyOn(sut, '_createNewId').and.returnValue('mocked_id');
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    const result = sut._createNewRow();
    expect(result.id).toBe('mocked_id');
  });

  it('_rowToRowData', () => {
    const mockedRow = {
      cells: ['mocked_cell', 'mocked_cell', 'mocked_cell']
    };
    spyOn(ColumnFactory, 'numberOfKeyColumns').and.returnValue(2);
    spyOn(sut, '_getCellLabel').and.returnValue('mocked_label');
    const result = sut._rowToRowData(mockedRow);
    expect(result).toStrictEqual(['mocked_label']);
  });

  it('_createNewId', () => {
    jest.spyOn(sut, 'numberOfRows', 'get').mockReturnValue(10);
    const result = sut._createNewId();
    expect(result).toBe(11);
  });

  describe('_getCellLabel', () => {
    it('no object', () => {
      const mockedCell = {
        value: 4
      };
      const result = sut._getCellLabel(mockedCell);
      expect(result).toBe(4);
    });

    it('without label', () => {
      const mockedObject = { foo: 3 };
      const mockedCell = {
        value: mockedObject
      };
      const result = sut._getCellLabel(mockedCell);
      expect(result).toBe(mockedObject);
    });

    it('labeled object', () => {
      const mockedObject = { label: 'mocked_label' };
      const mockedCell = {
        value: mockedObject
      };
      const result = sut._getCellLabel(mockedCell);
      expect(result).toBe('mocked_label');
    });
  });

  it('_deleteRow', () => {
    const mockedRow = {
      delete: () => {}
    };
    spyOn(mockedRow, 'delete');
    spyOn(sut, '_updateRowNumbers');
    sut._deleteRow(mockedRow);
    expect(mockedRow.delete).toHaveBeenCalled();
    expect(sut._updateRowNumbers).toHaveBeenCalled();
  });

  it('_updateRowNumbers', () => {
    let data;
    const mockedTabulator = {
      rowManager: {
        rows: [
          { data: { row_number: 0 } },
          { data: { row_number: 0 } }
        ]
      },
      setData: newData => { data = newData; }
    };
    mockedTabulator.getData = () => mockedTabulator.rowManager.rows;
    sut._tabulator = mockedTabulator;

    sut._updateRowNumbers();

    expect(data.length).toBe(2);
    expect(data[0].data.row_number).toBe(1);
    expect(data[1].data.row_number).toBe(2);
  });

  it('numberOfRows', () => {
    sut._tabulator = {
      getRows: () => ['mocked_row', 'mocked_row']
    };
    const result = sut.numberOfRows;
    expect(result).toBe(2);
  });

  it('rowData', () => {
    sut._tabulator = {
      rowManager: {
        rows: ['mocked_row', 'mocked_row']
      }
    };
    spyOn(sut, '_rowToRowData').and.returnValue('mocked_row_data');
    const result = sut.rowData;
    expect(result).toStrictEqual(['mocked_row_data', 'mocked_row_data']);
  });

  it('selectedRows', () => {
    sut._tabulator = {
      getSelectedRows: () => 'mocked_selected_rows'
    };
    const result = sut.selectedRows;
    expect(result).toBe('mocked_selected_rows');
  });
});
