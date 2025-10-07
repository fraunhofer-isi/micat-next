// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import xlsx from 'xlsx';
import ExcelUpload, { _ExcelUpload } from '../../../src/components/upload/excel-upload';
describe('main', () => {
  let sut;
  beforeEach(() => {
    const properties = {
      title: 'mocked_title',
      disabled: false,
      hasFile: false
    };
    spyOn(React, 'useRef');
    spyOn(React, 'useState').and.returnValue(['mockedState', 'mockedSetState']);
    spyOn(_ExcelUpload, 'buttonStyle');
    sut = ExcelUpload(properties);
  });

  it('construction', () => {
    expect(sut).toBeDefined();
  });

  it('dragOver', () => {
    const onDragOver = sut.props.onDragOver;
    spyOn(_ExcelUpload, 'fileDropped');
    const mockedEvent = {
      preventDefault: () => {}
    };
    spyOn(mockedEvent, 'preventDefault');
    onDragOver(mockedEvent);
    expect(mockedEvent.preventDefault).toHaveBeenCalled();
  });

  it('fileDropped', () => {
    const fileDropped = sut.props.onDrop;
    spyOn(_ExcelUpload, 'fileDropped');
    fileDropped();
    expect(_ExcelUpload.fileDropped).toHaveBeenCalled();
  });

  it('fileChanged', () => {
    const input = sut.props.children[0];
    const inputChanged = input.props.onChange;
    spyOn(_ExcelUpload, 'fileChanged');
    inputChanged();
    expect(_ExcelUpload.fileChanged).toHaveBeenCalled();
  });

  it('fileChanged', () => {
    const input = sut.props.children[0];
    const inputChanged = input.props.onChange;
    spyOn(_ExcelUpload, 'fileChanged');
    inputChanged();
    expect(_ExcelUpload.fileChanged).toHaveBeenCalled();
  });
});

it('onClick', () => {
  const properties = {
    title: 'mocked_title',
    disabled: false,
    hasFile: false
  };
  const mockedReference = {
    current: {
      click: () => {}
    }
  };
  spyOn(mockedReference.current, 'click');
  spyOn(React, 'useRef').and.returnValue(mockedReference);
  spyOn(React, 'useState').and.returnValue(['mockedState', 'mockedSetState']);
  const sut = ExcelUpload(properties);

  const button = sut.props.children[1];
  const onClick = button.props.onClick;
  onClick();
  expect(mockedReference.current.click).toHaveBeenCalled();
});

describe('_ExcelUpload', () => {
  describe('buttionStyle', () => {
    it('with file', () => {
      const result = _ExcelUpload.buttonStyle(true);
      expect(result).toBe('colored-icon-button');
    });
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('without file', () => {
      const result = _ExcelUpload.buttonStyle(false);
      expect(result).toBe('icon-button');
    });
  });
  describe('fileChanged', () => {
    it('with file', async () => {
      const mockedEvent = {
        target: {
          files: ['mockedFile'],
          value: 'foo'
        }
      };
      spyOn(_ExcelUpload, '_handleFile');

      await _ExcelUpload.fileChanged(mockedEvent, 'mocked_properties');

      expect(_ExcelUpload._handleFile).toHaveBeenCalled();
      expect(mockedEvent.target.value).toBe('');
    });

    it('without file', async () => {
      const mockedEvent = {
        target: {
          files: [undefined]
        }
      };
      spyOn(_ExcelUpload, '_handleFile');

      await _ExcelUpload.fileChanged(mockedEvent, 'mocked_properties');

      expect(_ExcelUpload._handleFile).not.toHaveBeenCalled();
      expect(mockedEvent.target.value).toBe('');
    });
  });

  describe('fileDropped', () => {
    it('with file', async () => {
      const mockedEvent = {
        preventDefault: () => {},
        dataTransfer: {
          files: ['mockedFile']
        }
      };
      spyOn(mockedEvent, 'preventDefault');
      spyOn(_ExcelUpload, '_handleFile');
      await _ExcelUpload.fileDropped(mockedEvent, 'mocked_properties');
      expect(mockedEvent.preventDefault).toHaveBeenCalled();
      expect(_ExcelUpload._handleFile).toHaveBeenCalled();
    });

    it('without file', async () => {
      const mockedEvent = {
        preventDefault: () => {},
        dataTransfer: {
          files: [undefined]
        }
      };
      spyOn(mockedEvent, 'preventDefault');
      spyOn(_ExcelUpload, '_handleFile');
      await _ExcelUpload.fileDropped(mockedEvent, 'mocked_properties');
      expect(mockedEvent.preventDefault).toHaveBeenCalled();
      expect(_ExcelUpload._handleFile).not.toHaveBeenCalled();
    });
  });

  describe('_handleFile', () => {
    describe('allowWithoutContext is truthy', () => {
      describe('without context sheet', () => {
        it('onlyFirstSheet is true', async () => {
          const mockedFile = {
            arrayBuffer: () => {}
          };

          // Mock the required functions
          window.alert = () => {};
          spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
          spyOn(_ExcelUpload, '_sheetExists').and.returnValue(false);
          spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
          spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');

          // Mock properties and setHasFile function
          const properties = {
            allowWithoutContext: true,
            onlyFirstSheet: true,
            change: jasmine.createSpy('change')
          };
          const setHasFile = jasmine.createSpy('setHasFile');

          // Mock window.alert
          const windowAlertSpy = spyOn(window, 'alert');

          // Call the _handleFile function
          await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);

          // Assert the expected function calls and values
          expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
          expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
          expect(_ExcelUpload._sheetToJson).toHaveBeenCalled();
          expect(_ExcelUpload._sheetsToJson).not.toHaveBeenCalledWith('mocked_workbook');
          expect(setHasFile).toHaveBeenCalledWith(true);
          expect(properties.change).toHaveBeenCalledWith('mocked_json_data');
          expect(windowAlertSpy).not.toHaveBeenCalled();
        });

        it('onlyFirstSheet is false', async () => {
          const mockedFile = {
            arrayBuffer: () => {}
          };

          // Mock the required functions
          window.alert = () => {};
          spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
          spyOn(_ExcelUpload, '_sheetExists').and.returnValue(false);
          spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
          spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');

          // Mock properties and setHasFile function
          const properties = {
            allowWithoutContext: true,
            onlyFirstSheet: false,
            change: jasmine.createSpy('change')
          };
          const setHasFile = jasmine.createSpy('setHasFile');

          // Mock window.alert
          const windowAlertSpy = spyOn(window, 'alert');

          // Call the _handleFile function
          await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);

          // Assert the expected function calls and values
          expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
          expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
          expect(_ExcelUpload._sheetToJson).not.toHaveBeenCalled();
          expect(_ExcelUpload._sheetsToJson).toHaveBeenCalledWith('mocked_workbook');
          expect(setHasFile).toHaveBeenCalledWith(true);
          expect(properties.change).toHaveBeenCalledWith('mocked_json_data');
          expect(windowAlertSpy).not.toHaveBeenCalled();
        });
      });

      it('with context sheet', async () => {
        const mockedFile = {
          arrayBuffer: () => {}
        };
          // Mock the required functions
        window.alert = () => {};
        spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
        spyOn(_ExcelUpload, '_sheetExists').and.returnValue(true);
        spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
        spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');
        // Mock properties and setHasFile function
        const properties = {
          allowWithoutContext: true,
          onlyFirstSheet: false,
          change: jasmine.createSpy('change')
        };
        const setHasFile = jasmine.createSpy('setHasFile');

        // Mock window.alert
        const windowAlertSpy = spyOn(window, 'alert');

        // Call the _handleFile function
        await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);
        // Assert the expected function calls and values
        expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
        expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
        expect(_ExcelUpload._sheetToJson).not.toHaveBeenCalledWith('mocked_workbook');
        expect(_ExcelUpload._sheetsToJson).not.toHaveBeenCalled();
        expect(setHasFile).not.toHaveBeenCalled();
        expect(properties.change).not.toHaveBeenCalled();
        expect(windowAlertSpy).toHaveBeenCalledWith('Please check and upload the global parameters file');
      });
    });

    describe('allowWithoutContext is falsy', () => {
      describe('with context sheet', () => {
        it('onlyFirstShieet is true', async () => {
          const mockedFile = {
            arrayBuffer: () => {}
          };

          // Mock the required functions
          window.alert = () => {};
          spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
          spyOn(_ExcelUpload, '_sheetExists').and.returnValue(true);
          spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
          spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');

          // Mock properties and setHasFile function
          const properties = {
            allowWithoutContext: false,
            onlyFirstSheet: true,
            change: jasmine.createSpy('change')
          };
          const setHasFile = jasmine.createSpy('setHasFile');

          // Mock window.alert
          const windowAlertSpy = spyOn(window, 'alert');

          // Call the _handleFile function
          await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);

          // Assert the expected function calls and values
          expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
          expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
          expect(_ExcelUpload._sheetToJson).toHaveBeenCalledWith('mocked_workbook');
          expect(_ExcelUpload._sheetsToJson).not.toHaveBeenCalled();
          expect(setHasFile).toHaveBeenCalledWith(true);
          expect(properties.change).toHaveBeenCalledWith('mocked_json_data');
          expect(windowAlertSpy).not.toHaveBeenCalled();
        });

        it('onlyFirstShieet is false', async () => {
          const mockedFile = {
            arrayBuffer: () => {}
          };

          // Mock the required functions
          window.alert = () => {};
          spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
          spyOn(_ExcelUpload, '_sheetExists').and.returnValue(true);
          spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
          spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');

          // Mock properties and setHasFile function
          const properties = {
            allowWithoutContext: false,
            onlyFirstSheet: false,
            change: jasmine.createSpy('change')
          };
          const setHasFile = jasmine.createSpy('setHasFile');

          // Mock window.alert
          const windowAlertSpy = spyOn(window, 'alert');

          // Call the _handleFile function
          await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);

          // Assert the expected function calls and values
          expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
          expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
          expect(_ExcelUpload._sheetToJson).not.toHaveBeenCalledWith('mocked_workbook');
          expect(_ExcelUpload._sheetsToJson).toHaveBeenCalled();
          expect(setHasFile).toHaveBeenCalledWith(true);
          expect(properties.change).toHaveBeenCalledWith('mocked_json_data');
          expect(windowAlertSpy).not.toHaveBeenCalled();
        });
      });

      it('without context sheet', async () => {
        const mockedFile = {
          arrayBuffer: () => {}
        };
        // Mock the required functions
        window.alert = () => {};
        spyOn(_ExcelUpload, '_readWorkbook').and.returnValue('mocked_workbook');
        spyOn(_ExcelUpload, '_sheetExists').and.returnValue(false);
        spyOn(_ExcelUpload, '_sheetToJson').and.returnValue('mocked_json_data');
        spyOn(_ExcelUpload, '_sheetsToJson').and.returnValue('mocked_json_data');
        // Mock properties and setHasFile function
        const properties = {
          allowWithoutContext: false,
          onlyFirstSheet: true,
          change: jasmine.createSpy('change')
        };
        const setHasFile = jasmine.createSpy('setHasFile');

        // Mock window.alert
        const windowAlertSpy = spyOn(window, 'alert');

        // Call the _handleFile function
        await _ExcelUpload._handleFile(mockedFile, properties, setHasFile);
        // Assert the expected function calls and values
        expect(_ExcelUpload._readWorkbook).toHaveBeenCalledWith(mockedFile);
        expect(_ExcelUpload._sheetExists).toHaveBeenCalledWith('mocked_workbook', 'context');
        expect(_ExcelUpload._sheetToJson).not.toHaveBeenCalled();
        expect(_ExcelUpload._sheetsToJson).not.toHaveBeenCalled();
        expect(setHasFile).not.toHaveBeenCalled();
        expect(properties.change).not.toHaveBeenCalled();
        expect(windowAlertSpy).toHaveBeenCalledWith('Please check and upload the micat_measure file');
      });
    });
  });

  it('_readWorkbook', async () => {
    spyOn(_ExcelUpload, '_sheetsToJson');
    const mockedFile = {
      arrayBuffer: () => {}
    };
    spyOn(mockedFile, 'arrayBuffer');
    spyOn(xlsx, 'read').and.returnValue('mocked_result');
    const result = await _ExcelUpload._readWorkbook(mockedFile);
    expect(result).toBe('mocked_result');
    expect(mockedFile.arrayBuffer).toHaveBeenCalled();
  });

  it('_sheetToJson', async () => {
    const mockedWorkbook = {
      SheetNames: ['mocked_sheetName'],
      Sheets: {
        mocked_sheetName: 'mocked_sheet'
      }
    };
    const mockedUtils = {
      sheet_to_json: () => [{ cellA: 'dataA' }, { cellB: 'dataB' }]
    };
    const utilsBackup = xlsx.utils;
    xlsx.utils = mockedUtils;
    const result = _ExcelUpload._sheetToJson(mockedWorkbook);
    expect(result).toEqual([{ cellA: 'dataA' }, { cellB: 'dataB' }]);
    xlsx.utils = utilsBackup;
  });

  it('_sheetsToJson', async () => {
    const mockedWorkbook = {
      SheetNames: ['firstSheetName', 'secondSheetName'],
      Sheets: {
        firstSheetName: 'mocked_sheet',
        secondSheetName: 'mocked_sheet'
      }
    };
    const mockedUtils = {
      sheet_to_json: () => 'mocked_json'
    };
    const utilsBackup = xlsx.utils;
    xlsx.utils = mockedUtils;
    const result = _ExcelUpload._sheetsToJson(mockedWorkbook);
    expect(result).toStrictEqual({
      firstSheetName: 'mocked_json',
      secondSheetName: 'mocked_json'
    });
    xlsx.utils = utilsBackup;
  });

  it('_sheetExists', async () => {
    const mockedWorkBook = {
      SheetNames: ['mockedSheetName']
    };
    const result = _ExcelUpload._sheetExists(mockedWorkBook, 'mockedSheetName');
    expect(result).toBe(true);
  });
});
/* eslint-enable max-lines */
