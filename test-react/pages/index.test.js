// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Index from '../../src/pages';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Router from 'next/router';

jest.mock('next/router', () => ({ push: jest.fn() }));

describe('Index', () => {
  it('redirects', () => {
    const mockedDefaultMode = { id: 1, label: 'ex-ante-measures' };
    const mockedDefaultRegion = { id: 5, label: 'Germany' };
    const route = `/${mockedDefaultMode.id.toString()}/${mockedDefaultRegion.id.toString()}`;
    render(<Index defaultMode={mockedDefaultMode} defaultRegion={mockedDefaultRegion}/>);
    expect(Router.push).toHaveBeenCalledWith(route);
    expect(screen.getByText(new RegExp(mockedDefaultMode.label, 'i'), { exact: false })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockedDefaultRegion.label, 'i'), { exact: false })).toBeInTheDocument();
  });
});
