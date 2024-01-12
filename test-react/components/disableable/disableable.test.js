// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Disableable from '../../../src/components/disableable/disableable';
import styles from '../../../src/components/disableable/disableable.module.scss';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

describe('Disableable', () => {
  it('renders a disabled component', () => {
    render(<Disableable disabled={true}>
      <div data-testid='dummy-div'></div>
    </Disableable>);
    const disableable = screen.getByTestId('disableable');
    expect(disableable).toHaveAttribute('disabled');
    expect(disableable).toHaveClass(styles.disabled);
  });
  it('renders an enabled component', () => {
    render(<Disableable disabled={false}>
      <div data-testid='dummy-div'></div>
    </Disableable>);
    const disableable = screen.queryByTestId('disableable');
    expect(disableable).toBeNull();
  });
});
