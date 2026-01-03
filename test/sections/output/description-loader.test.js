// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Runtime from '../../../src/server/runtime';
import DescriptionLoader from '../../../src/sections/output/description-loader';

describe('main', () => {
  describe('useIfEnabled ', () => {
    it('loading enabled ', () => {
      const settings = {
        loadChartDescriptionsFromWeblication: true
      };
      spyOn(React, 'useEffect').and.callFake(delegate => delegate());
      spyOn(DescriptionLoader, '_loadDescriptions');
      DescriptionLoader.useIfEnabled(settings, 'mocked_setDescriptions');
      expect(DescriptionLoader._loadDescriptions).toHaveBeenCalled();
    });

    it('loading disabled ', () => {
      const settings = {
        loadChartDescriptionsFromWeblication: false
      };
      spyOn(React, 'useEffect').and.callFake(delegate => delegate());
      spyOn(DescriptionLoader, '_loadDescriptions');
      DescriptionLoader.useIfEnabled(settings, 'mocked_setDescriptions');
      expect(DescriptionLoader._loadDescriptions).not.toHaveBeenCalled();
    });
  });

  it('_loadDescriptions ', async () => {
    let passedDescriptions;
    const setDescriptions = descriptions => { passedDescriptions = descriptions; };
    spyOn(Runtime.prototype, 'loadChartDescriptions').and.returnValue('mocked_descriptions');
    await DescriptionLoader._loadDescriptions('mocked_settings', setDescriptions);
    expect(passedDescriptions).toBe('mocked_descriptions');
  });

  describe('getDescription ', () => {
    it('empty', () => {
      const result = DescriptionLoader.getDescription('mocked_key', []);
      expect(result).toBeUndefined();
    });

    it('missing', () => {
      const descriptions = [
        { titleText: 'foo' }
      ];
      spyOn(console, 'error');
      const result = DescriptionLoader.getDescription('mocked_key', descriptions);
      expect(result).toBe('The description for key "mocked_key" is missing!');
    });

    it('normal usage', () => {
      const descriptions = [
        { titleText: 'foo', descriptionText: 'mocked_description' }
      ];
      const result = DescriptionLoader.getDescription('foo', descriptions);
      expect(result).toBe('mocked_description');
    });
  });
});
