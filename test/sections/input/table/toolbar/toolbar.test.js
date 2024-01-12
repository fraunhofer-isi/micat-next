// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Toolbar, { _Toolbar } from './../../../../../src/sections/input/table/toolbar/toolbar';

it('construction', () => {
  const properties = {
    defaultNewColumnYear: '2000',
    addRow: () => {}
  };

  spyOn(React, 'useState').and.returnValue(['mocked_attribtue', () => {}]);
  spyOn(React, 'useEffect').and.callFake(delegate => delegate());
  spyOn(React, 'useRef').and.returnValue('mocked_reference');
  spyOn(_Toolbar, 'newColumnYearInput').and.returnValue('mocked_input');
  spyOn(_Toolbar, 'updateNewColumnYear').and.returnValue('mocked_result');
  spyOn(_Toolbar, 'render').and.returnValue('mocked_result');
  const result = Toolbar(properties);
  expect(result).toBe('mocked_result');
});

describe('_Toolbar', () => {
  it('render ', async () => {
    const properties = {
      reset: () => {},
      clear: () => {},
      apply: () => {},
      downloadBlob: () => {},
      disabled: false,
      downloadFileName: 'mocked_downloadFileName',
      applyDisabled: false
    };
    const result = _Toolbar.render(properties, 'mocked_newColumnYearInput');
    expect(result).toBeDefined();

    const leftToolbar = result.props.children[0];
    const rightToolbar = result.props.children[1];

    const children = leftToolbar.props.children;

    let button = children[0];
    let onClick = button.props.onClick;
    spyOn(properties, 'reset');
    await onClick();
    expect(properties.reset).toHaveBeenCalled();

    button = children[1];
    onClick = button.props.onClick;
    spyOn(properties, 'clear');
    await onClick();
    expect(properties.clear).toHaveBeenCalled();

    /*
    const upload = children[2];
    const change = upload.props.change;
    spyOn(_Toolbar, '_fileChanged');
    change();
    expect(_Toolbar._fileChanged).toHaveBeenCalled();

    const download = children[3];
    const blob = download.props.blob;
    spyOn(properties, 'downloadBlob');
    await blob();
    expect(properties.downloadBlob).toHaveBeenCalled();
    */

    button = children[2];
    onClick = button.props.onClick;
    spyOn(properties, 'apply');
    await onClick();
    expect(properties.apply).toHaveBeenCalled();

    const rightChildren = rightToolbar.props.children;

    button = rightChildren[1];
    onClick = button.props.onClick;
    spyOn(_Toolbar, '_addAnnualColumn');
    await onClick();
    expect(_Toolbar._addAnnualColumn).toHaveBeenCalled();
  });

  describe('newColumnYearInput', () => {
    it('with column manager', () => {
      const properties = {
        columnManager: {
          newColumnYearChanged: () => {}
        },
        minYear: 'mocked_minYear',
        maxYear: 'mocked_maxYear',
        newColumnYear: 'mocked_newColumnYear',
        newColumnPlaceholder: 'mocked_newColumnPlaceholder',
        setNewColumnYear: () => {},
        disabled: false
      };
      const result = _Toolbar.newColumnYearInput(properties);
      expect(result).toBeDefined();

      const onChange = result.props.onChange;
      spyOn(properties.columnManager, 'newColumnYearChanged');
      onChange('mocked_event');
      expect(properties.columnManager.newColumnYearChanged).toHaveBeenCalled();
    });

    it('without column manager', () => {
      const properties = {
        columnManager: undefined
      };
      const result = _Toolbar.newColumnYearInput(properties);
      expect(result).toBeDefined();
    });
  });

  describe('updateNewColumnYear', () => {
    it('with current reference', () => {
      const mockedReference = {
        current: {
          value: undefined
        }
      };
      _Toolbar.updateNewColumnYear(mockedReference, 'mocked_newColumnYear');
      expect(mockedReference.current.value).toBe('mocked_newColumnYear');
    });

    it('without current reference', () => {
      const mockedReference = {
        current: undefined
      };
      _Toolbar.updateNewColumnYear(mockedReference, 'mocked_newColumnYear');
    });
  });

  describe('_addAnnualColumn ', () => {
    it('with new column year ', async () => {
      const properties = {
        columnManager: {
          addAnnualColumn: () => {}
        },
        newColumnYear: 2000,
        setNewColumnYear: () => {}
      };
      spyOn(properties.columnManager, 'addAnnualColumn');
      await _Toolbar._addAnnualColumn(properties);
      expect(properties.columnManager.addAnnualColumn).toHaveBeenCalled();
    });

    it('with default new column year ', async () => {
      const properties = {
        columnManager: {
          addAnnualColumn: () => {}
        },
        newColumnYear: undefined,
        defaultNewColumnYear: undefined,
        setNewColumnYear: () => {}
      };
      spyOn(properties.columnManager, 'addAnnualColumn');
      await _Toolbar._addAnnualColumn(properties);
      expect(properties.columnManager.addAnnualColumn).toHaveBeenCalled();
    });
  });

  describe('_fileChanged', () => {
    it('without confirm', async () => {
      spyOn(window, 'confirm').and.returnValue(false);
      await _Toolbar._fileChanged('mocked_jsonData', 'mocked_properties');
    });

    describe('with confirm', () => {
      beforeEach(() => {
        spyOn(window, 'confirm').and.returnValue(true);
      });
      it('without data', async () => {
        const properties = {
          validateAndConvertUploadedData: () => {}
        };
        await _Toolbar._fileChanged('mocked_jsonData', properties);
      });

      it('with data', async () => {
        const properties = {
          validateAndConvertUploadedData: () => 'mocked_data',
          updateTable: () => {},
          apply: async () => {}
        };
        spyOn(properties, 'apply');
        await _Toolbar._fileChanged('mocked_jsonData', properties);
        expect(properties.apply).toHaveBeenCalled();
      });
    });
  });
});
