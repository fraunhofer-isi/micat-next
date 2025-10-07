// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import CheckboxInput, {
  _CheckboxInput
} from '../../../../src/components/input/checkbox/checkbox-input';

describe('CheckboxInput', () => {
  beforeEach(() => {
    spyOn(React, 'useState').and.returnValue([false, jest.fn()]);
  });
  it('construction with empty properties', () => {
    const mockedProperties = {};
    const result = CheckboxInput(mockedProperties);
    spyOn(_CheckboxInput, 'checkboxInputChanged');
    result.props.children[1].props.onChange(
      'mockedEvent',
      jest.fn(),
      jest.fn()
    );
    expect(result).toBeDefined();
  });
  it('construction with label', () => {
    const mockedProperties = {
      label: 'mockedLabel'
    };
    const result = CheckboxInput(mockedProperties);
    expect(result).toBeDefined();
  });
  it('construction with end label', () => {
    const mockedProperties = {
      endLabel: 'mockedLabel'
    };
    const result = CheckboxInput(mockedProperties);
    expect(result).toBeDefined();
  });
});

describe('_CheckboxInput', () => {
  describe('checkboxInputChanged', () => {
    it('with change defined', () => {
      const mockedEvent = {
        target: {
          value: 'mockedValue'
        }
      };
      _CheckboxInput.checkboxInputChanged(mockedEvent, jest.fn(), jest.fn());
    });
    it('with change undefined', () => {
      const mockedEvent = {
        target: {
          value: 'mockedValue'
        }
      };
      _CheckboxInput.checkboxInputChanged(mockedEvent, jest.fn());
    });
  });
});
