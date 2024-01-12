// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from 'node:fs';
import BuildTime from '../../src/server/build-time';

describe('Public API', () => {
  let sut;
  beforeAll(() => {
    spyOn(BuildTime, '_loadSettingsIfExist').and.returnValue('mocked_settings');
    sut = BuildTime.instance();
  });

  it('construction', () => {
    expect(sut).toBeDefined();
  });

  describe('instance', () => {
    it('with cached instance', () => {
      BuildTime._singletonInstance = 'mocked_instance';
      const result = BuildTime.instance();
      expect(result).toBe('mocked_instance');
    });

    it('without cached instance', () => {
      BuildTime._singletonInstance = undefined;
      const result = BuildTime.instance();
      expect(result).toBeDefined();
    });
  });

  describe('readPropertiesFromDatabase', () => {
    it('without cache', async () => {
      sut._cachedProperties = undefined;
      spyOn(sut, 'apiCall').and.returnValue('mocked_api_result');
      spyOn(sut, '_actionTypeMapping').and.returnValue('mocked_actionTypeMapping');
      const result = await sut.readPropertiesFromDatabase();
      expect(result.modes).toBe('mocked_api_result');
    });

    it('with cache', async () => {
      sut._cachedProperties = 'mocked_cache';
      const result = await sut.readPropertiesFromDatabase();
      expect(result).toBe('mocked_cache');
    });
  });

  describe('getPageProps', () => {
    it('without error', async () => {
      const mockedProperties = {
        modes: 'mocked_modes',
        regions: 'mocked_regions'
      };
      spyOn(sut, 'readPropertiesFromDatabase').and.returnValue(mockedProperties);
      spyOn(sut, '_defaultMode').and.returnValue('mocked_mode');
      spyOn(sut, '_defaultRegion').and.returnValue('mocked_region');
      const result = await sut.getPageProps();
      expect(result.defaultMode).toBe('mocked_mode');
      expect(result.defaultRegion).toBe('mocked_region');
    });

    it('with error', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const mockedReadProperties = () => { throw new Error('mocked_error'); };
      spyOn(sut, 'readPropertiesFromDatabase').and.callFake(mockedReadProperties);
      spyOn(console, 'error');
      await expect(sut.getPageProps()).rejects.toThrowError();
    });
  });
});

describe('Private API', () => {
  describe('_defaultMode', () => {
    let sut;
    let mockedModes;
    beforeEach(() => {
      sut = BuildTime.instance();

      mockedModes = {
        rows: [
          [1, 'ex-ante measure', ''],
          [2, 'ex-ante scenario', '']
        ]
      };
    });

    describe('useDefaultMode enabled', () => {
      it('label is found', () => {
        const mockedSettings = {
          frontEnd: {
            useDefaultMode: true,
            defaultMode: 'ex-ante measure'
          }
        };
        sut._settings = mockedSettings;
        spyOn(sut, '_defaultFromSettings').and.returnValue('mocked_row');
        spyOn(BuildTime, '_rowToIdObject').and.returnValue('mocked_result');
        const result = sut._defaultMode(mockedModes);
        expect(result).toEqual('mocked_result');
      });

      it('label is not found', () => {
        const mockedSettings = {
          frontEnd: {
            useDefaultMode: true,
            defaultMode: 'foo'
          }
        };
        sut._settings = mockedSettings;
        spyOn(sut, '_defaultFromSettings').and.returnValue();
        spyOn(BuildTime, '_rowToIdObject').and.returnValue('mocked_result');
        const result = sut._defaultMode(mockedModes);
        expect(result).toEqual('mocked_result');
      });
    });

    it('useDefaultMode disabled', () => {
      const mockedSettings = {
        frontEnd: {
          useDefaultMode: false
        }
      };
      sut._settings = mockedSettings;
      const result = sut._defaultMode(mockedModes);
      const expectedResult = {
        id: mockedModes.rows[0][0],
        label: mockedModes.rows[0][1]
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('_defaultRegion', () => {
    let sut;
    let mockedRegions;
    beforeEach(() => {
      sut = BuildTime.instance();

      mockedRegions = {
        rows: [
          [0, 'European Union', 'EU'],
          [5, 'Germany', 'DE']
        ]
      };
    });

    describe('useDefaultRegion enabled', () => {
      it('label is found', () => {
        const mockedSettings = {
          frontEnd: {
            useDefaultRegion: true,
            defaultRegion: 'Germany'
          }
        };
        sut._settings = mockedSettings;
        spyOn(sut, '_defaultFromSettings').and.returnValue('mocked_row');
        spyOn(BuildTime, '_rowToIdObject').and.returnValue('mocked_result');
        const result = sut._defaultRegion(mockedRegions);
        expect(result).toEqual('mocked_result');
      });

      it('label is not found', () => {
        const mockedSettings = {
          frontEnd: {
            useDefaultRegion: true,
            defaultRegion: 'foo'
          }
        };
        sut._settings = mockedSettings;
        spyOn(sut, '_defaultFromSettings').and.returnValue();
        spyOn(BuildTime, '_rowToIdObject').and.returnValue('mocked_result');
        const result = sut._defaultRegion(mockedRegions);
        expect(result).toEqual('mocked_result');
      });
    });

    it('useDefaultRegion disabled', () => {
      const mockedSettings = {
        frontEnd: {
          useDefaultRegion: false
        }
      };
      sut._settings = mockedSettings;
      const result = sut._defaultRegion(mockedRegions);
      const expectedResult = {
        id: mockedRegions.rows[0][0],
        label: mockedRegions.rows[0][1]
      };
      expect(result).toEqual(expectedResult);
    });
  });

  it('_rowToIdObject', () => {
    const row = ['id_mock', 'label_mock'];
    const result = BuildTime._rowToIdObject(row);
    expect(result.id).toBe('id_mock');
    expect(result.label).toBe('label_mock');
  });

  it('_defaultFromSettings', () => {
    const sut = BuildTime.instance();

    const mockedRegions = {
      rows: [
        [5, 'Germany', 'DE'],
        [10, 'France', 'FR']
      ]
    };
    const result = sut._defaultFromSettings(mockedRegions, 'Germany');
    expect(result).toBe(mockedRegions.rows[0]);
  });

  it('_actionTypeMapping', () => {
    const mockedMappingTable = {
      rows: [
        [1, 2, 3],
        [2, 2, 5]
      ]
    };
    const buildTime = BuildTime.instance();
    const mapping = buildTime._actionTypeMapping(mockedMappingTable);
    const mockedResult = { 2: [3, 5] };
    expect(mapping).toEqual(mockedResult);
  });

  describe('_loadSettingsIfExist', () => {
    it('with settings', () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(BuildTime, '_readJson').and.returnValue('my_mocked_settings');
      const settings = BuildTime._loadSettingsIfExist();
      expect(settings).toBe('my_mocked_settings');
    });

    it('with default settings', () => {
      spyOn(fs, 'existsSync').and.returnValue(false);
      spyOn(BuildTime, '_loadDefaultSettings').and.returnValue('my_mocked_default_settings');
      const defaultSettings = BuildTime._loadSettingsIfExist();
      expect(defaultSettings).toBe('my_mocked_default_settings');
    });

    it('with unknown error', () => {
      spyOn(fs, 'existsSync').and.returnValue(false);
      spyOn(BuildTime, '_loadDefaultSettings').and.throwError('mocked_error');
      expect(BuildTime._loadSettingsIfExist).toThrow('mocked_error');
    });
  });

  describe('_loadDefaultSettings', () => {
    it('without error', () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(BuildTime, '_readJson').and.returnValue('mocked_json');
      expect(BuildTime._loadDefaultSettings('mocked_path')).toBe('mocked_json');
    });

    it('with error', () => {
      spyOn(fs, 'existsSync').and.returnValue(false);
      expect(BuildTime._loadDefaultSettings).toThrow();
    });
  });

  describe('fileExists', () => {
    it('with existsSync', () => {
      spyOn(fs, 'existsSync').and.returnValue('mocked_result');
      const result = BuildTime._fileExists('mocked_filePath');
      expect(result).toBe('mocked_result');
    });

    it('without existsSync', () => {
      const backup = fs.existsSync;
      fs.existsSync = undefined;
      spyOn(console, 'warn');
      const result = BuildTime._fileExists('mocked_filePath');
      expect(result).toBe(true);
      expect(console.warn).toHaveBeenCalled();
      fs.existsSync = backup;
    });
  });

  it('_readJson', () => {
    spyOn(fs, 'readFileSync').and.returnValue('mocked_file');
    spyOn(JSON, 'parse').and.returnValue('mocked_json');
    expect(BuildTime._readJson()).toBe('mocked_json');
  });
});
