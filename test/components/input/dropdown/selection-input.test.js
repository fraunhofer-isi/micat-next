// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import SelectionInput, {
  _SelectionInput
} from '../../../../src/components/input/dropdown/selection-input';

describe('SelectionInput', () => {
  it('construction', () => {
    const mockedProperties = {
      label: 'mockedLabel',
      options: [],
      defaultValue: 'mockedDefaultValue',
      change: jest.fn()
    };
    spyOn(_SelectionInput, '_getOptions');
    const result = SelectionInput(mockedProperties);
    const mockedEvent = {
      target: {
        value: 'mockedValue'
      }
    };
    result.props.children[1].props.onChange(mockedEvent);
    expect(result).toBeDefined();
  });
});

describe('_SelectionInput', () => {
  it('_getOptions', () => {
    const mockedOptions = ['mockedOptionA', 'mockedOptionB'];
    const result = _SelectionInput._getOptions(mockedOptions);
    expect(result).toBeDefined();
  });
});
