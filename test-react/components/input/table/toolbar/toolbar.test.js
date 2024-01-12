// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Toolbar from '../../../../../src/components/input/table/toolbar/toolbar';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const mockedDefaultColumnYear = 2030;
const mockedColumnManager = {
  addAnnualColumn: jest.fn()
};
const mockedMinYear = 2020;
const mockedMaxYear = 2050;
const mockedReset = jest.fn();
const mockedClear = jest.fn();
const mockedUpdateTable = jest.fn();
const mockedApply = jest.fn();
const mockedApplyDisabled = false;
const mockedDisabled = false;
const mockedDownloadBlob = jest.fn();
const mockedValidateAndConvertUploadedData = jest.fn();
let rerender;

beforeEach(() => {
  rerender = render(<Toolbar
    defaultNewColumnYear={ mockedDefaultColumnYear }
    columnManager={ mockedColumnManager }
    minYear={ mockedMinYear }
    maxYear={ mockedMaxYear }
    reset={ mockedReset }
    clear={ mockedClear }
    updateTable={ mockedUpdateTable }
    apply={ mockedApply }
    applyDisabled ={ mockedApplyDisabled }
    disabled={ mockedDisabled }
    downloadBlob={ mockedDownloadBlob }
    validateAndConvertUploadedData={ mockedValidateAndConvertUploadedData }
  />).rerender;
});

describe('Toolbar', () => {
  it('renders toolbar', () => {
    const toolbarButtons = screen.getAllByRole('button');
    const yearSpinner = screen.getByRole('spinbutton');
    expect(toolbarButtons).toHaveLength(4); // 6
    for(const toolbarButton of toolbarButtons) {
      expect(toolbarButton.disabled).toBeFalsy();
    }
    expect(yearSpinner.value).toBe(mockedDefaultColumnYear.toString());
  });
  it('button callbacks are called', () => {
    const toolbarButtons = screen.getAllByRole('button');
    for(const toolbarButton of toolbarButtons) {
      fireEvent.click(toolbarButton);
    }
    expect(mockedReset).toBeCalledTimes(1);
    expect(mockedClear).toBeCalledTimes(1);
    // expect(mockedDownloadBlob).toBeCalledTimes(1);
    expect(mockedApply).toBeCalledTimes(1);
  });
  it('toolbar is disabled', () => {
    rerender(<Toolbar
      applyDisabled ={ true }
      disabled={ true }
    />);
    const toolbarButtons = screen.getAllByRole('button');
    for(const toolbarButton of toolbarButtons) {
      expect(toolbarButton.disabled).toBeTruthy();
    }
  });
});
