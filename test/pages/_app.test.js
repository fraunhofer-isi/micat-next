// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import App from 'next/app';
import BuildTime from '../../src/server/build-time';
import MyApp from '../../src/pages/_app';

const mockedComponent = () => {
  return (<> </>);
};

describe('main', () => {
  let sut;
  beforeEach(() => {
    const mockedPageProperties = {
      foo_property: 'foo_value'
    };
    const properties = {
      Component: mockedComponent,
      pageProps: mockedPageProperties
    };
    sut = new MyApp(properties);
  });

  it('construction', () => {
    const properties = sut.props;
    expect(properties.foo_property).toBe('foo_value');
  });

  it('getInitialProps', async () => {
    const mockedAppProperties = {
      pageProps: { foo: 'mocked_app_page_property' },
      extraAppProperty: 'mocked_app_property'
    };
    spyOn(App, 'getInitialProps').and.returnValue(mockedAppProperties);

    const mockedBuildTime = {
      getPageProps: async () => {}
    };
    const mockedPageProperties = { baa: 'baa_value' };
    spyOn(mockedBuildTime, 'getPageProps').and.returnValue(mockedPageProperties);
    spyOn(BuildTime, 'instance').and.returnValue(mockedBuildTime);

    const properties = await MyApp.getInitialProps('mocked_appContext');
    expect(properties.extraAppProperty).toBe('mocked_app_property');

    const { pageProps } = properties;
    expect(pageProps.foo).toBe('mocked_app_page_property');
    expect(pageProps.baa).toBe('baa_value');
  });
});
