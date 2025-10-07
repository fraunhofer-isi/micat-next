// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs';

export default class Logger {
  static info(message){
    const enabled = false;
    const logFilePath = './logger.log';
    Logger._appendToFile(enabled, logFilePath, message);
  }

  static _appendToFile(enabled, logFilePath, message) {
    if(enabled){
      fs.appendFileSync(logFilePath, message + '\n');
    }
  }
}
