// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import SelectableItem from './../../../../src/sections/input/table/selectable-item';

describe('main', () => {
  let sut;
  beforeEach(() => {
    sut = new SelectableItem('id_mock', 'label_mock', 'description_mock');
  });

  it('toString', () => {
    const result = sut.toString();
    expect(result).toBe('<span title="description_mock">label_mock</span>');
  });

  it('match', () => {
    const result = sut.match('foo');
    expect(result).toBe(true);
  });
});
