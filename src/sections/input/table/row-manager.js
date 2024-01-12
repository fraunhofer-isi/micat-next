// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ColumnFactory from '../column-factory';

export default class RowManger {
  constructor(properties){
    this.props = properties;
    this._tabulator = undefined;
  }

  setTabulator(tabulator){
    this._tabulator = tabulator;
  }

  addRow(){
    this._tabulator.addRow(this._createNewRow());
  }

  deleteRows(rows){
    for(const row of rows){
      const id = row.getData().id;
      this._tabulator.deleteRow(id);
    }
  }

  rowContextMenu(){
    const contextMenu = [
      {
        label: 'Delete row',
        action: (_event, row) => this._deleteRow(row)
      }
    ];
    return contextMenu;
  }

  _createNewRow(){
    const newId = this._createNewId();
    const columns = this._tabulator.getColumnLayout();
    const dataColumns = columns.slice(ColumnFactory.numberOfKeyColumns());
    const newRowData = this.props.createNewRowData(newId, dataColumns);
    const newRow = Object.assign({}, newRowData);
    newRow.id = newId;
    return newRow;
  }

  _rowToRowData(row){
    const firstIndex = ColumnFactory.numberOfKeyColumns();
    const cells = row.cells.slice(firstIndex);
    const rowData = cells.map(cell => this._getCellLabel(cell));
    return rowData;
  }

  _createNewId(){
    return this.numberOfRows + 1;
  }

  _getCellLabel(cell) {
    const value = cell.value;
    if(typeof value === 'object' && 'label' in value) {
      return value.label;
    }
    return value;
  }

  _deleteRow(row){
    row.delete();
    this._updateRowNumbers();
  }

  _updateRowNumbers(){
    let rowNumber = 1;
    for (const row of this._tabulator.rowManager.rows) {
      row.data.row_number = rowNumber;
      rowNumber += 1;
    }
    const newData = this._tabulator.getData();
    this._tabulator.setData(newData);
  }

  get numberOfRows(){
    return this._tabulator.getRows().length;
  }

  get rowData(){
    const rows = this._tabulator.rowManager.rows;
    const rowDataList = rows.map(row => this._rowToRowData(row));
    return rowDataList;
  }

  get selectedRows(){
    return this._tabulator.getSelectedRows();
  }
}
