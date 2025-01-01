// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Router from 'next/router';
import Index from '../../src/pages/index';

describe('main', () => {
  let result;
  beforeEach(() => {
    const properties = {
      defaultMode: {
        id: 'mocked_modeId',
        label: 'mocked_mode_name'
      },
      defaultRegion: {
        id: 'mocked_regionId',
        label: 'mocked_region_name'
      }
    };
    spyOn(React, 'useEffect').and.callFake(lambda => lambda());
    spyOn(Router, 'push');
    result = new Index(properties);
  });

  it('construction', () => {
    expect(Router.push).toHaveBeenCalled();
  });

  it('result', () => {
    expect(result.props.children).toBeDefined();
  });
});
