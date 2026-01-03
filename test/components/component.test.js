// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Component from '../../src/components/component';

describe('public API', () => {
  let sut;
  beforeEach(() => {
    sut = new Component();
  });

  describe('id', () => {
    it('with derived id', () => {
      expect(sut.id).toBe('component');
    });

    it('with explicit id', () => {
      const component = new Component({ id: 'mocked_id' });
      expect(component.id).toBe('mocked_id');
    });

    it('with explicit but empty id', () => {
      const component = new Component({ id: '' });
      expect(component.id).toBe('component');
    });
  });

  it('render', () => {
    const result = sut.render();
    expect(result.props.id).toBe('component');
  });
});
