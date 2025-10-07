// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ColumnFactory from '../../../src/sections/input/column-factory';
import Mode from '../../../src/calculation/mode';
import InputFilter from '../../../src/sections/input/input-filter';
import InputValidator from '../../../src/sections/input/input-validator';
describe('main', () => {
  it('validateDefaultSavings', () => {
    const mockedSubsectorItems = [
      { label: 'mocked_subsectorLabel' },
      { label: 'foo' }
    ];
    const mockedSavingsData = [
      ['mocked_subsectorLabel', 'mocked_actionTypeLabel']
    ];
    spyOn(InputValidator, '_removeHeader').and.returnValue(mockedSavingsData);
    spyOn(InputValidator, '_validateSubsector');
    spyOn(InputValidator, '_validateActionType');

    spyOn(InputFilter, 'filterActionTypesBySubsector');

    InputValidator.validateDefaultSavings(
      'mocked_defaultSavings',
      mockedSubsectorItems,
      'mocked_actionTypeItems',
      'mocked_actionTypeMapping'
    );

    expect(InputValidator._validateSubsector).toHaveBeenCalled();
    expect(InputValidator._validateActionType).toHaveBeenCalled();
  });

  describe('validateHeaders', () => {
    it('with valid headers', () => {
      const headers = ['Subsector', 'Improvement', '2000'];
      const keyColumnHeaders = ['Subsector', 'Improvement'];
      spyOn(InputValidator, '_validateYears').and.returnValue();
      const error = InputValidator.validateHeaders(headers, 'mocked_idMode', keyColumnHeaders);
      expect(error).toBe(undefined);
    });

    it('without subsector', () => {
      const headers = ['Improvement', '2000'];
      const keyColumnHeaders = ['Subsector', 'Improvement'];
      spyOn(InputValidator, '_validateYears').and.returnValue();
      const error = InputValidator.validateHeaders(headers, 'mocked_idMode', keyColumnHeaders);
      expect(error).toBe('Headers need to include "Subsector"');
    });

    it('with invalid years', () => {
      const headers = ['Subsector', 'Improvement'];
      const keyColumnHeaders = ['Subsector', 'Improvement'];
      spyOn(InputValidator, '_validateYears').and.returnValue('mocked_error');
      const error = InputValidator.validateHeaders(headers, 'mocked_idMode', keyColumnHeaders);
      expect(error).toBe('mocked_error');
    });
  });

  describe('validateSavings', () => {
    it('with empty savings', () => {
      const savings = [];
      const isValid = InputValidator.validateSavings(savings);
      expect(isValid).toBe(false);
    });

    it('for invalid rows', () => {
      const savings = ['mocked_saving'];
      spyOn(InputValidator, '_rowIsNotValid').and.returnValue(true);
      const isValid = InputValidator.validateSavings(savings);
      expect(isValid).toBe(false);
    });

    it('for valid rows', () => {
      const savings = ['mocked_saving'];
      spyOn(InputValidator, '_rowIsNotValid').and.returnValue(false);
      const isValid = InputValidator.validateSavings(savings);
      expect(isValid).toBe(true);
    });
  });

  it('_removeHeader', () => {
    const savings = [
      'mocked_header',
      'mocked_row'
    ];

    const result = InputValidator._removeHeader(savings);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('mocked_row');
  });

  describe('_validateYears', () => {
    it('does not include year', () => {
      const headers = ['Subsector', 'Improvement'];
      const result = InputValidator._validateYears('mocked_idMode', headers);
      expect(result).toBe('No year column found.');
    });

    it('does not include year in valid range', () => {
      const headers = ['Subsector', 'Improvement', 2000];
      spyOn(Mode, 'minYear').and.returnValue(2020);
      spyOn(Mode, 'maxYear').and.returnValue(2030);
      const result = InputValidator._validateYears('mocked_idMode', headers);
      expect(result).toBe('No year column found that is in the allowed range 2020 <= year <= 2030');
    });

    it('includes valid year', () => {
      const headers = ['Subsector', 'Improvement', 2025];
      spyOn(Mode, 'minYear').and.returnValue(2020);
      spyOn(Mode, 'maxYear').and.returnValue(2030);
      const result = InputValidator._validateYears('mocked_idMode', headers);
      expect(result).toBeUndefined();
    });
  });

  describe('_validateSubsector', () => {
    it('is valid', () => {
      spyOn(InputValidator, '_subsectorValid').and.returnValue(true);
      InputValidator._validateSubsector(
        'mocked_subsectorLabel',
        'mocked_subsectorItems'
      );
      expect(InputValidator._subsectorValid).toHaveBeenCalled();
    });

    it('is not valid', () => {
      const mockedSubsectorItems = [
        { label: 'foo' },
        { label: 'baa' }
      ];

      spyOn(InputValidator, '_subsectorValid').and.returnValue(false);

      expect(
        () => InputValidator._validateSubsector(
          'mocked_subsectorLabel',
          mockedSubsectorItems
        )
      ).toThrowError();
    });
  });

  describe('_validateActionType', () => {
    it('is valid', () => {
      spyOn(InputValidator, '_actionTypeValid').and.returnValue(true);
      InputValidator._validateActionType(
        'mocked_subsectorLabel',
        'mocked_actionTypeLabel',
        'mocked_actionTypeItems'
      );
      expect(InputValidator._actionTypeValid).toHaveBeenCalled();
    });

    it('is not valid', () => {
      const mockedActionTypeItems = [
        { label: 'foo' },
        { label: 'baa' }
      ];

      spyOn(InputValidator, '_actionTypeValid').and.returnValue(false);

      expect(
        () => InputValidator._validateActionType(
          'mocked_subsectorLabel',
          'mocked_endUSeLabel',
          mockedActionTypeItems
        )
      ).toThrowError();
    });
  });

  describe('_subsectorValid', () => {
    it('is valid', () => {
      const mockedSubsectorItems = [
        { label: 'mocked_subsectorLabel' }
      ];

      const isValid = InputValidator._subsectorValid(
        'mocked_subsectorLabel',
        mockedSubsectorItems
      );
      expect(isValid).toBe(true);
    });

    it('is not valid', () => {
      const mockedSubsectorItems = [
        { label: 'mocked_differentSubsectorLabel' }
      ];

      const isValid = InputValidator._subsectorValid(
        'mocked_subsectorLabel',
        mockedSubsectorItems
      );
      expect(isValid).toBe(false);
    });
  });

  describe('_actionTypeValid', () => {
    it('is valid', () => {
      const mockedActionTypeItems = [
        { label: 'mocked_actionTypeLabel' }
      ];

      const isValid = InputValidator._actionTypeValid(
        'mocked_actionTypeLabel',
        mockedActionTypeItems
      );
      expect(isValid).toBe(true);
    });

    it('is not valid', () => {
      const mockedActionTypeItems = [
        { label: 'mocked_differentActionTypeLabel' }
      ];

      const isValid = InputValidator._actionTypeValid(
        'mocked_actionTypeLabel',
        mockedActionTypeItems
      );
      expect(isValid).toBe(false);
    });
  });

  describe('_rowIsNotValid', () => {
    it('id_subsector is undefined', () => {
      const mockedRow = {
        id_subsector: undefined,
        id_action_type: 'mocked_id_action_type'
      };

      const isNotValid = InputValidator._rowIsNotValid(mockedRow);
      expect(isNotValid).toBe(true);
    });

    it('id_action_type is undefined', () => {
      const mockedRow = {
        id_subsector: 'mocked_id_subsector',
        id_action_type: undefined
      };

      const isNotValid = InputValidator._rowIsNotValid(mockedRow);
      expect(isNotValid).toBe(true);
    });

    it('with valid row', () => {
      const mockedRow = {
        id_subsector: 'mocked_id_subsector',
        id_action_type: 'mocked_id_action_type'
      };

      const isNotValid = InputValidator._rowIsNotValid(mockedRow);
      expect(isNotValid).toBe(false);
    });
  });

  describe('_includesInteger', () => {
    it('with integer', () => {
      const values = ['foo', 2000];
      const result = InputValidator._includesInteger(values);
      expect(result).toBe(true);
    });

    it('without integer', () => {
      const values = ['foo', 'baa'];
      const result = InputValidator._includesInteger(values);
      expect(result).toBe(false);
    });
  });
});
