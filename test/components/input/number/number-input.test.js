// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import NumberInput, {
  _NumberInput
} from '../../../../src/components/input/number/number-input';

describe('NumberInput', () => {
  let mockedNumberInputChanged;
  let mockedProperties;
  beforeEach(() => {
    mockedNumberInputChanged = spyOn(_NumberInput, 'numberInputChanged');
    spyOn(React, 'useState').and.returnValues([0, jest.fn()], [0, jest.fn()]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    mockedProperties = mockedProperties = {
      change: jest.fn(),
      initialValue: 0,
      minimumValue: 0,
      maximumValue: 100,
      step: 1,
      label: 'mockedLabel',
      endLabel: 'mockedEndLabel'
    };
  });
  describe('construction', () => {
    it('with all properties set', () => {
      const result = NumberInput(mockedProperties);
      result.props.children[1].props.onChange();
      expect(result).toBeDefined();
      expect(mockedNumberInputChanged).toBeCalled();
    });
    it('without labels and step', () => {
      delete mockedProperties.label;
      delete mockedProperties.endLabel;
      delete mockedProperties.step;
      const result = NumberInput(mockedProperties);
      expect(result).toBeDefined();
    });
  });
});

describe('_NumberInput', () => {
  const mockedEvent = {
    target: {
      value: '90',
      validity: {
        valid: true
      }
    }
  };
  let mockedSetValue = jest.fn();
  let mockedChange = jest.fn();
  beforeEach(() => {
    mockedSetValue = jest.fn();
    mockedChange = jest.fn();
  });
  describe('numberInputChanged', () => {
    it('number valid and in range', () => {
      _NumberInput.numberInputChanged(
        mockedEvent,
        mockedSetValue,
        mockedChange
      );
      expect(mockedSetValue).toBeCalled();
      expect(mockedChange).toBeCalled();
    });
    it('number invalid', () => {
      mockedEvent.target.validity.valid = false;
      _NumberInput.numberInputChanged(mockedEvent, mockedSetValue, mockedChange);
      expect(mockedSetValue).toBeCalled();
      expect(mockedChange).not.toBeCalled();
    });
  });
});
