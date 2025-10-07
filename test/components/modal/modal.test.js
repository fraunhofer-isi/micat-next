// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Modal from '../../../src/components/modal/modal';
import React from 'react';
describe('Modal', () => {
  it('not showing', () => {
    const mockedProperties = {
      showModal: false
    };
    const result = Modal(mockedProperties);
    expect(result).toEqual(<></>);
  });
  it('showing', () => {
    const mockedProperties = {
      showModal: true,
      title: 'mockedTitle',
      closeButtonTitle: 'mockedCloseButtonTitle',
      onClose: jest.fn(),
      text: 'mockedText'
    };
    const result = Modal(mockedProperties);
    const mockedEvent = {
      stopPropagation: jest.fn()
    };
    result.props.children.props.onClick(mockedEvent);
    expect(result).toBeDefined();
  });
});
