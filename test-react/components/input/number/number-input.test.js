// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import NumberInput from '../../../../src/components/input/number/number-input';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockedComboLabelText = 'mockedLabel';
const mockedDefaultValue = '2020';
const mockedNewValue = 2030;
const mockedChange = jest.fn();

beforeEach(() => {
  render(<NumberInput label={mockedComboLabelText} defaultValue={mockedDefaultValue} change={mockedChange}/>);
});

describe('NumberInput', () => {
  it('renders correctly', () => {
    const spinner = screen.getByRole('spinbutton');
    const label = screen.getByText(mockedComboLabelText);
    expect(spinner).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });
  it('changes value and calls change function', () => {
    const spinner = screen.getByRole('spinbutton');
    fireEvent.change(spinner, { target: { value: mockedNewValue } });
    expect(spinner.valueAsNumber).toBe(mockedNewValue);
    expect(mockedChange).toBeCalledTimes(1);
  });
});
