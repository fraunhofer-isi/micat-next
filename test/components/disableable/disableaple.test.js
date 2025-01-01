// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Disableable from '../../../src/components/disableable/disableable';

describe('main', () => {
  it('disabled', () => {
    const properties = {
      disabled: true
    };
    const result = new Disableable(properties);
    const type = result.type.toString();
    expect(type).toBe('div');
    expect(result.props.children).toBe(undefined);
  });

  it('not disabled', () => {
    const properties = {
      disabled: false,
      children: 'mocked_children'
    };
    const result = new Disableable(properties);
    const type = result.type.toString();
    expect(type).toBe('Symbol(react.fragment)');
    expect(result.props.children).toBe('mocked_children');
  });
});
