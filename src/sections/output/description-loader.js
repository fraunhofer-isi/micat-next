// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Runtime from '../../server/runtime';

export default class DescriptionLoader {
  static useIfEnabled(settings, setDescriptions) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const isLoadingDescriptions = settings.loadChartDescriptionsFromWeblication;
      if(isLoadingDescriptions) {
        DescriptionLoader._loadDescriptions(settings, setDescriptions);
      }
    }, []);
  }

  static async _loadDescriptions(settings, setDescriptions){
    /* To avoid CORS errors during development, use the CORS Everywhere Firefox extension:
    https://github.com/spenibus/cors-everywhere-firefox-addon
    OR disable web security in Chrome:
    https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome */
    const runtime = new Runtime(settings);
    const descriptions = await runtime.loadChartDescriptions();
    setDescriptions(descriptions);
  }

  static getDescription(key, descriptions) {
    const descriptionsAreEmpty = (descriptions === undefined || descriptions.length === 0);
    if(descriptionsAreEmpty){
      return;
    }
    const description = descriptions.find(d => d.titleText === key);
    if(!description){
      const message = 'The description for key "' + key + '" is missing!';
      console.error(message);
      return message;
    }
    const text = description.descriptionText;
    return text;
  }
}
