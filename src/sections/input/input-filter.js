// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class InputFilter {
  static filterActionTypesBySubsector(
    subsectorItem,
    actionTypeItems,
    actionTypeMapping
  ) {
    if(!subsectorItem){
      return [];
    }
    const actionTypeIdsForSubsector = actionTypeMapping[subsectorItem.id];
    const noActionTypesFound = !actionTypeIdsForSubsector || actionTypeIdsForSubsector.length === 0;
    if (noActionTypesFound) {
      const message = 'Could not find action types for subsector ' + subsectorItem.label;
      throw new Error(message);
    }
    const actionTypeItemsForActionTypeIds = InputFilter._actionTypeItemsById(
      actionTypeItems,
      actionTypeIdsForSubsector
    );
    return actionTypeItemsForActionTypeIds;
  }

  static itemByLabelOrFirstItem(items, label) {
    const foundItems = items.filter(item => item.label === label);
    const item = foundItems.length > 0
      ? foundItems[0]
      : items[0];
    return item;
  }

  static filterDisplayData(data){
    const activeRows = InputFilter._filterForActiveRows(data);
    const filteredData = InputFilter._removeColumnsIfExist(activeRows, ['active']);
    const renamedData = InputFilter._renameColumn(filteredData, 'row_number', 'id_measure');
    return renamedData;
  }

  static _actionTypeItemsById(actionTypeItems, ids){
    const wantedActionTypes = actionTypeItems.filter(actionTypeItem => ids.includes(actionTypeItem.id));
    return wantedActionTypes;
  }

  static _filterForActiveRows(displayData){
    const activeRows = [];
    for(const row of displayData){
      if (row.active){
        activeRows.push(row);
      }
    }
    return activeRows;
  }

  static _removeColumnsIfExist(originalData, columnsToRemove){
    const data = structuredClone(originalData);
    for(const row of data){
      for(const column of columnsToRemove){
        if (column in row){
          delete row[column];
        }
      }
    }
    return data;
  }

  static _renameColumn(originalData, sourceColumnName, targetColumnName){
    const data = structuredClone(originalData);
    for(const row of data){
      row[targetColumnName] = row[sourceColumnName];
      delete row[sourceColumnName];
    }
    return data;
  }
}
