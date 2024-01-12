// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ExcelUpload, { _ExcelUpload } from '../../../src/components/upload/excel-upload';
import { fireEvent, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';

describe('ExcelUpload', () => {
  it('can upload file', async () => {
    const mockedTitle = 'mockedLabel';

    user.setup();
    const file = new File(
      ['mockedFile'],
      'mockedFile.xlsx',
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        arrayBuffer: () => {}
      }
    );
    render(<ExcelUpload title={mockedTitle}/>);
    const uploadButton = screen.getByRole('button');
    const input = screen.getByTestId('file-input');
    spyOn(_ExcelUpload, 'fileChanged');
    await user.click(uploadButton);
    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });
    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
    expect(uploadButton.title).toBe(mockedTitle);
  });
});
