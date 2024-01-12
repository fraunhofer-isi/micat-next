// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import IdSelector from '../../../../src/components/input/id/id-selector';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockedComboLabelText = 'mockedLabel';
const mockedIdTable = {
  headers: ['id', 'label', 'description'],
  rows: [[0, 'mockedLabel1', 'mockedDescription1'], [1, 'mockedLabel2', 'mockedDescription2']]
};
const mockedChange = jest.fn();

beforeEach(() => {
  render(<IdSelector label={mockedComboLabelText} id-table={mockedIdTable} change={mockedChange} />);
});

describe('IdSelector', () => {
  it('renders correctly', () => {
    const selector = screen.getByRole('combobox');
    const label = screen.getByText(`${mockedComboLabelText}:`);
    expect(selector).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });
  it('changes value and calls change function', () => {
    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: mockedIdTable.rows[1][1] } });
    const options = screen.getAllByRole('option');
    expect(options[1].selected).toBeTruthy();
    expect(mockedChange).toBeCalledTimes(1);
  });
});
