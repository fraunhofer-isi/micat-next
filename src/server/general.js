// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Logger from '../utils/logger';

export default class General {
  // This class serves as a parent class and should not be used directly
  constructor(settings){
    this._settings = settings;
  }

  async apiCall(apiUrl, content, contentType, method){
    // If set to true in settings, the remote back_end does not need to be available but a local
    // instance of the back_end is used to respond to api calls from the front_end.
    const isUsingLocalApi = this._settings
      ? this._settings.frontEnd.apiCalls.useLocalApi
      : false;

    const baseUrl = isUsingLocalApi
      ? 'http://127.0.0.1:5000/' // note: https protocol would not work here
      : 'https://micatool-dev.eu/';
    const result = await General._backEndApiCall(baseUrl, apiUrl, content, contentType, method);
    return result;
  }

  static async _backEndApiCall(baseUrl, apiUrl, content, contentType, method = 'GET'){
    const url = baseUrl + apiUrl;
    let response;
    let options = {
      method
    };
    if(content && contentType === 'application/json') {
      options = {
        ...options,
        headers: {
          'Content-Type': contentType
        },
        body: JSON.stringify(content)
      };
    }
    try {
      Logger.info(url);
      response = await fetch(url, options);
    } catch (error){
      Logger.info(error);
      const message = 'API call failed for ' + apiUrl;
      throw new Error(message + '\n' + error.stack);
    }

    const responseContentType = response.headers.get('Content-Type');
    const isSpreadSheet = responseContentType.includes('spreadsheet');
    if(isSpreadSheet){
      const document = await response.blob();
      return document;
    }

    let text;
    try {
      text = await response.text();
    } catch (error){
      const message = 'API call failed while retrieving text for ' + apiUrl;
      throw new Error(message + '\n' + error.stack);
    }

    const isHtml = text.startsWith('<');
    if(isHtml){
      const message = 'API call failed due to error passed via html for ' + apiUrl;
      throw new Error(message + '\n' + text);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (error){
      const message = 'API call failed while retrieving json for ' + apiUrl;
      throw new Error(message + '\n' + error.stack + '\n\n' + text);
    }

    if (json.error){
      let errorText = '';
      for(const [key, value] of Object.entries(json.error)){
        errorText += '# ' + key + ':\n';
        errorText += value + '\n';
      }
      const message = 'API call failed due to error passed via json for ' + apiUrl + '\n' + errorText;
      throw new Error(message);
    }
    return json;
  }
}
