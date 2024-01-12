// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Footer from '../../../../src/components/input/table/footer';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockedAddRow = jest.fn();

describe('Footer', () => {
  it('can add rows', () => {
    render(<Footer addRow={mockedAddRow} disabled={false} />);
    const addRow = screen.getByRole('button');
    fireEvent.click(addRow);
    expect(mockedAddRow).toBeCalledTimes(1);
  });
  it('can be disabled', () => {
    render(<Footer addRow={mockedAddRow} disabled={true} />);
    const addRow = screen.getByRole('button');
    expect(addRow.disabled).toBeTruthy();
  });
});
