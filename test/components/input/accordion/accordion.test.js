// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import Accordion from '../../../../src/components/input/accordion/accordion';

describe('Accordion', () => {
  it('no title', () => {
    const mockedProperties = {
      unfolded: true
    };
    spyOn(React, 'useState').and.returnValue([false, jest.fn()]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    const result = Accordion(mockedProperties);
    expect(result).toBeDefined();
  });
  it('folded and toggle state', () => {
    const mockedProperties = {
      title: 'mockedTitle',
      initiallyUnfolded: false,
      unfolded: false,
      children: (<></>)
    };
    spyOn(React, 'useState').and.returnValue([false, jest.fn()]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    const result = Accordion(mockedProperties);
    result.props.children[0].props.onClick();
    expect(result).toBeDefined();
  });
  it('unfolded and toggle state', () => {
    const mockedProperties = {
      title: 'mockedTitle',
      initiallyUnfolded: true,
      unfolded: true,
      children: (<></>)
    };
    spyOn(React, 'useState').and.returnValue([true, jest.fn()]);
    spyOn(React, 'useEffect').and.callFake(delegate => delegate());
    const result = Accordion(mockedProperties);
    result.props.children[0].props.onClick();
    expect(result).toBeDefined();
  });
});
