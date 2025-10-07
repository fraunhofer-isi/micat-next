// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import DescriptionLoader from '../../../../src/sections/output/description-loader';
import QuantificationCharts, {
  _QuantificationCharts
} from '../../../../src/sections/output/quantification/quantification-charts';
import React from 'react';

describe('construction', () => {
  it('initialized', () => {
    const properties = {
      settings: 'mocked_settings',
      initialized: true
    };

    spyOn(React, 'useState').and.returnValue([
      'mocked_description',
      'mocked_set_descriptions'
    ]);
    spyOn(DescriptionLoader, 'useIfEnabled');
    spyOn(_QuantificationCharts, 'initializedRender').and.returnValue(
      'mocked_result'
    );
    const result = QuantificationCharts(properties);
    expect(result).toBe('mocked_result');
  });

  it('not initialized', () => {
    const properties = {
      settings: 'mocked_settings',
      initialized: false
    };

    spyOn(React, 'useState').and.returnValue([
      'mocked_description',
      'mocked_set_descriptions'
    ]);
    spyOn(DescriptionLoader, 'useIfEnabled');
    spyOn(_QuantificationCharts, 'defaultRender').and.returnValue(
      'mocked_default_result'
    );
    const result = QuantificationCharts(properties);
    expect(result).toBe('mocked_default_result');
  });
});

describe('_IndicatorCharts', () => {
  describe('initializedRender', () => {
    it('with data', () => {
      const properties = { data: undefined };
      const result = _QuantificationCharts.initializedRender(properties);
      expect(result.props.children).toBe('Loading...');
    });

    it('without data', () => {
      const properties = { data: 'mocked_data' };
      spyOn(_QuantificationCharts, '_dataRender').and.returnValue(
        'mocked_result'
      );
      const result = _QuantificationCharts.initializedRender(properties);
      expect(result).toBe('mocked_result');
    });
  });

  describe('defaultRender', () => {
    it('with data', () => {
      const properties = {
        data: undefined,
        defaultText: 'mocked_defaultText'
      };
      const result = _QuantificationCharts.defaultRender(properties);
      expect(result.props.children).toBe('mocked_defaultText');
    });

    it('without data', () => {
      const properties = { data: 'mocked_data' };
      spyOn(_QuantificationCharts, '_dataRender').and.returnValue('mocked_result');
      const result = _QuantificationCharts.defaultRender(properties);
      expect(result).toBe('mocked_result');
    });
  });

  it('_dataRender', () => {
    const properties = {
      className: 'mocked_className',
      outdated: false,
      data: 'mocked_data',
      description: jest.fn()
    };
    const result = _QuantificationCharts._dataRender(properties);
    expect(result).toBeDefined();
  });
});
