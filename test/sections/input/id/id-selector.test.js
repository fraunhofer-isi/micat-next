// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { jest } from '@jest/globals';
import IdSelector from './../../../../src/sections/input/id/id-selector';

function _mockedSelectReference(idTable){
  const mockedSelect = document.createElement('select');
  for (const row of idTable.rows){
    const mockedOption = document.createElement('option');
    mockedOption.dataset.idValue = row[0];
    mockedOption.value = row[1];
    mockedOption.title = row[2];
    mockedSelect.append(mockedOption);
  }
  mockedSelect.selectedIndex = 1;
  return { current: mockedSelect };
}

describe('main', () => {
  let sut;
  let mockedSelectReference;
  beforeEach(() => {
    const mockedIdTable = {
      rows: [
        [10, 'foo', 'foo description'],
        [20, 'baa', 'baa description']
      ]
    };

    const mockedProperties = {
      label: 'mocked_label',
      'default-id-value': 20,
      'id-table': mockedIdTable,
      change: () => {}
    };

    sut = new IdSelector(mockedProperties);
    mockedSelectReference = _mockedSelectReference(mockedIdTable);
  });

  describe('public API', () => {
    it('construction', () => {
      expect(sut.props.label).toBe('mocked_label');
    });

    it('componentDidMount', () => {
      spyOn(sut, '_optionIndexForIdValue').and.returnValue('mocked_index');
      sut._selectReference = { current: {} };
      sut.componentDidMount();
      expect(sut._select.selectedIndex).toBe('mocked_index');
    });

    describe('render', () => {
      it('with idTable', () => {
        spyOn(sut.props, 'change');
        jest.spyOn(sut, 'idValue', 'get').mockReturnValue('mocked_idValue');
        jest.spyOn(sut, 'value', 'get').mockReturnValue('mocked_value');

        const selector = sut.render();

        const children = selector.props.children;
        const select = children[1];

        select.props.onChange();
        expect(sut.props.change).toHaveBeenCalled();
      });

      it('without idTable', () => {
        sut.props['id-table'] = undefined;
        const result = sut.render();
        expect(result).toBe('!! Id table is empty !! mocked_label');
      });

      it('with empty lable', () => {
        sut.props['id-table'] = undefined;
        sut.props.label = undefined;
        const result = sut.render();
        expect(result).toBe('!! Id table is empty !! ');
      });

      it('with missing rows of idTable', () => {
        sut.props['id-table'].rows = undefined;
        const result = sut.render();
        expect(result).toBe('!! Id table is empty !! mocked_label');
      });

      it('with empty rows of idTable', () => {
        sut.props['id-table'].rows = [];
        const result = sut.render();
        expect(result).toBe('!! Id table is empty !! mocked_label');
      });
    });

    it('value', () => {
      sut._selectReference = mockedSelectReference;
      const value = sut.value;
      expect(value).toBe('baa');
    });

    it('idValue', () => {
      sut._selectReference = mockedSelectReference;
      const idValue = sut.idValue;
      expect(idValue).toBe(20);
    });

    it('description', () => {
      sut._selectReference = mockedSelectReference;
      const description = sut.description;
      expect(description).toBe('baa description');
    });
  });

  describe('private API', () => {
    it('_optionIndexForIdValue', () => {
      sut._selectReference = mockedSelectReference;
      expect(sut._optionIndexForIdValue(10)).toBe(0);
      expect(sut._optionIndexForIdValue(20)).toBe(1);
    });

    it('_createOption', () => {
      const row = [10, 'foo', 'foo_description'];
      const option = sut._createOption(row);
      expect(option.key).toBe('10');
    });
  });
});
