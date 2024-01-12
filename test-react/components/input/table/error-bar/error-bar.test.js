// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ErrorBar from '../../../../../src/components/input/table/error-bar/error-bar';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockedValue = 'mockedValue';
const mockedReset = jest.fn();

beforeEach(() => {
  render(<ErrorBar value={mockedValue} reset={mockedReset}/>);
});

describe('ErrorBar', () => {
  it('renders error message', () => {
    // eslint-disable-next-line unicorn/better-regex
    const text = screen.getByText(/mockedValue/i);
    expect(text).toBeInTheDocument();
  });
  it('hides error message', () => {
    const text = screen.getByText(/mockedvalue/i);
    fireEvent.keyUp(text, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    });
    expect(mockedReset).toBeCalled();
  });
});
