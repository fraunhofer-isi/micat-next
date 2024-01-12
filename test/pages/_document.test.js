// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Document from '../../src/pages/_document';

describe('main', () => {
  let sut;
  beforeEach(() => {
    sut = new Document();
  });

  it('construction', () => {
    const children = sut.props.children;
    const head = children[0];
    const link = head.props.children;
    const href = link.props.href;
    expect(href).toBe('/favicon.ico');
  });
});
