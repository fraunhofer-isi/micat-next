// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import App from 'next/app';
import './stylesheet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tabulator_modern.css';
import BuildTime from '../server/build-time';

export default function MyApp({ Component, pageProps }) {
  const parameters = { ...pageProps };
  return <Component {...parameters} />;
}

MyApp.getInitialProps = async (appContext) => {
  const initialProperties = await createPropertiesThatWillBeInjectedToMyApp(appContext);
  return initialProperties;
};
async function createPropertiesThatWillBeInjectedToMyApp(appContext) {
  const appProperties = await App.getInitialProps(appContext);
  const buildTime = BuildTime.instance();
  const pageProperties = await buildTime.getPageProps();
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const pageProps = {
    ...appProperties.pageProps,
    ...pageProperties
  };
  return { ...appProperties, pageProps };
}
