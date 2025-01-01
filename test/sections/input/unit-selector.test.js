// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnitSelector from '../../../src/sections/input/unit-selector';

describe('UnitSelector', () => {
  const units = {
    ktoe: 'ktoe',
    MJ: 'MJ',
    GJ: 'GJ',
    MWh: 'MWh'
  };
  const defaultUnit = { ktoe: 'ktoe' };
  const setUnit = jest.fn();

  it('should render the selection input with correct default value', () => {
    render(<UnitSelector units={units} defaultUnit={defaultUnit} setUnit={setUnit} />);

    const selectionInput = screen.getByLabelText('Final energy savings in');
    expect(selectionInput).toBeInTheDocument();
    expect(selectionInput).toHaveValue('ktoe');

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['ktoe', 'MJ', 'GJ', 'MWh']);
  });
  it('should show the modal when unit is changed', () => {
    render(<UnitSelector units={units} defaultUnit={defaultUnit} setUnit={setUnit} />);

    const selectionInput = screen.getByLabelText('Final energy savings in');
    fireEvent.change(selectionInput, { target: { value: 'MJ' } });

    expect(setUnit).toHaveBeenCalledWith('MJ');

    const modalTitle = screen.getByText('Unit Change');
    expect(modalTitle).toBeInTheDocument();

    const message =
      'If you change the units, the annual values in the table for indicator calculations, ' +
      'will be converted from the selected unit to ktoe as the calculation is always performed in ktoe. ' +
      'The values shown in the table are not converted.';

    const modalMessage = screen.getByText(message);
    expect(modalMessage).toBeInTheDocument();

    const closeButton = screen.getByText('OK');
    fireEvent.click(closeButton);

    expect(modalTitle).not.toBeInTheDocument();
  });
});
