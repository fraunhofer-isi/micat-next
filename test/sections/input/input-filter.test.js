// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import InputFilter from './../../../src/sections/input/input-filter';
describe('main', () => {
  describe('filterActionTypesBySubsector', () => {
    const mockedSubsectorItem = {
      id: 'mockedSubsectorId',
      label: 'mockedSubsectorLabel'
    };

    it('without subsectorItem', () => {
      const result = InputFilter.filterActionTypesBySubsector(
        undefined,
        'mocked_actionTypeItems',
        'mocked_actionTypeMapping'
      );
      expect(result).toStrictEqual([]);
    });

    it('with action type', () => {
      const mockedActionTypeMapping = {
        mockedSubsectorId: 'mocked_actionTypeIds'
      };

      spyOn(InputFilter, '_actionTypeItemsById').and.returnValue('mocked_result');
      const result = InputFilter.filterActionTypesBySubsector(
        mockedSubsectorItem,
        'mocked_actionTypeItems',
        mockedActionTypeMapping
      );
      expect(result).toBe('mocked_result');
    });

    it('without action type entry', () => {
      const mockedActionTypeMapping = {
        mockedDifferentSubsectorId: 'foo'
      };

      const expectedError = new Error('Could not find action types for subsector mockedSubsectorLabel');
      expect(() => InputFilter.filterActionTypesBySubsector(
        mockedSubsectorItem,
        'mocked_actionTypeItems',
        mockedActionTypeMapping
      )).toThrowError(expectedError);
    });

    it('with empty action type array', () => {
      const mockedActionTypeMapping = {
        mockedSubsectorId: []
      };

      const expectedError = new Error('Could not find action types for subsector mockedSubsectorLabel');
      expect(() => InputFilter.filterActionTypesBySubsector(
        mockedSubsectorItem,
        'mocked_actionTypeItems',
        mockedActionTypeMapping
      )).toThrowError(expectedError);
    });
  });

  describe('itemByLabelOrFirstItem', () => {
    it('with matching item', () => {
      const mockedItems = [{
        label: 'mocked_label'
      }];

      const result = InputFilter.itemByLabelOrFirstItem(
        mockedItems,
        'mocked_label'
      );
      expect(result.label).toBe('mocked_label');
    });

    it('without matching item', () => {
      const mockedItems = [
        { label: 'mocked_first_label' },
        { label: 'mocked_second_label' }
      ];

      const result = InputFilter.itemByLabelOrFirstItem(
        mockedItems,
        'mocked_label'
      );
      expect(result.label).toBe('mocked_first_label');
    });
  });

  it('filterDisplayData', () => {
    spyOn(InputFilter, '_filterForActiveRows');
    spyOn(InputFilter, '_removeColumnsIfExist');
    spyOn(InputFilter, '_renameColumn').and.returnValue('mocked_result');
    const result = InputFilter.filterDisplayData('mocked_data');
    expect(result).toBe('mocked_result');
  });

  it('_actionTypeItemsById', () => {
    const mockedActionTypeItems = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    const ids = [1, 3];
    const result = InputFilter._actionTypeItemsById(mockedActionTypeItems, ids);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });

  it('_filterForActiveRows', () => {
    const mockedDisplayData = [
      { active: true },
      { active: false }
    ];

    const result = InputFilter._filterForActiveRows(mockedDisplayData);

    expect(result.length).toBe(1);
    expect(result[0].active).toBe(true);
  });

  it('_removeColumnsIfExist', () => {
    const mockedOriginalData = [
      { id: 1, mockedColumnName: 10 },
      { id: 2, mockedColumnName: 20 },
      { id: 3 }
    ];

    const columnsToRemove = ['mockedColumnName'];

    window.structuredClone = data => data;

    const result = InputFilter._removeColumnsIfExist(
      mockedOriginalData,
      columnsToRemove
    );

    expect(result.length).toBe(3);
    const firstRow = result[0];
    expect(firstRow.id).toBe(1);
    expect(firstRow.mockedColumnName).toBe(undefined);
  });

  it('_renameColumn', () => {
    const originalData = [
      { foo: 1, value: 1 },
      { foo: 2, value: 2 }
    ];
    const sourceColumnName = 'foo';
    const targetColumnName = 'baa';

    window.structuredClone = data => data;

    const result = InputFilter._renameColumn(originalData, sourceColumnName, targetColumnName);
    expect(result[0].baa).toBe(1);
    expect(result[1].baa).toBe(2);
  });
});
