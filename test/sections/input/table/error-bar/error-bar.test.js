// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import ErrorBar from './../../../../../src/sections/input/table/error-bar/error-bar';

describe('construction', () => {
  beforeEach(() => {
    spyOn(React, 'useCallback').and.callFake(delegate => delegate);
    spyOn(React, 'useState').and.returnValue(['mocked_attribtue', () => {}]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
  });

  it('without value', () => {
    const properties = {
      value: undefined,
      reset: () => {}
    };

    spyOn(document, 'removeEventListener');
    const result = ErrorBar(properties);
    expect(result).toBeDefined();
    expect(document.removeEventListener).toHaveBeenCalled();
  });

  it('with value', () => {
    const properties = {
      value: 'mocked_value',
      reset: () => {}
    };

    let passedListener;
    const mockedAddEventListener = (_name, listener) => {
      passedListener = listener;
    };
    spyOn(document, 'addEventListener').and.callFake(mockedAddEventListener);
    spyOn(properties, 'reset');
    const result = ErrorBar(properties);
    expect(result).toBeDefined();

    spyOn(console, 'log');
    const mockedEvent = {
      key: 'Enter'
    };
    passedListener(mockedEvent);
    expect(properties.reset).not.toHaveBeenCalled();

    mockedEvent.key = 'Escape';
    passedListener(mockedEvent);
    expect(properties.reset).toHaveBeenCalled();
  });
});
