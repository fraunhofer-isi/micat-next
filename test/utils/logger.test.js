// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Logger from '../../src/utils/logger';
import fs from 'node:fs';

describe('Logger', () => {
  it('info', () => {
    spyOn(Logger, '_appendToFile');
    Logger.info('mockedMessage');
  });
  describe('_appendToFile', () => {
    it('enabled', () => {
      const mockedAppendFileSync = spyOn(fs, 'appendFileSync');
      Logger._appendToFile(true, 'mockedFilePath', 'mockedMessage');
      expect(mockedAppendFileSync).toBeCalled();
    });
    it('disabled', () => {
      const mockedAppendFileSync = spyOn(fs, 'appendFileSync');
      Logger._appendToFile(false, 'mockedFilePath', 'mockedMessage');
      expect(mockedAppendFileSync).not.toBeCalled();
    });
  });
});
