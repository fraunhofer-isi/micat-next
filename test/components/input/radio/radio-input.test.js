// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import RadioInput from '../../../../src/components/input/radio/radio-input';
import React from 'react';

describe('main', () => {
  let sut;
  beforeEach(() => {
    spyOn(React, 'createRef').and.returnValue({
      current: {
        childMethod: jest.fn()
      }
    });
    const properties = {
      value: false,
      label: 'mocked_label',
      change: jest.fn()
    };
    sut = new RadioInput(properties);
  });
  it('render', () => {
    const result = sut.render();
    const children = result.props.children;
    const input = children.props.children[0];
    const onChange = input.props.onChange;
    spyOn(sut.props, 'change');
    onChange();
    expect(sut.props.change).toHaveBeenCalled();
  });
  it('set value', () => {
    const mockedInput = { value: '' };
    jest.spyOn(sut, '_input', 'get').mockReturnValue(mockedInput);
    sut.value = 'mocked_value';
    expect(mockedInput.value).toBe('mocked_value');
  });
  it('get value', () => {
    const mockedInput = { value: 'mocked_value' };
    jest.spyOn(sut, '_input', 'get').mockReturnValue(mockedInput);
    const result = sut.value;
    expect(result).toBe('mocked_value');
  });
  it('_input', () => {
    const mockedInputReference = {
      current: 'mocked_reference'
    };
    sut._inputReference = mockedInputReference;
    expect(sut._input).toBe('mocked_reference');
  });
});
