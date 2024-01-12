// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import tabStyles from './../../input/tab-styles.module.scss';
import Disableable from '../../../components/disableable/disableable';
import Social from './social';
import Economic from './economic';
import Ecologic from './ecologic';

export default function QuantificationCharts(properties){
  return properties.initialized
    ? _QuantificationCharts.initializedRender(properties)
    : _QuantificationCharts.defaultRender(properties);
}

export class _QuantificationCharts {
  static initializedRender(properties){
    const data = properties.data;
    return data
      ? _QuantificationCharts._dataRender(properties)
      : <div>Loading...</div>;
  }

  static defaultRender(properties){
    const data = properties.data;
    return data
      ? _QuantificationCharts._dataRender(properties)
      : <div>{properties.defaultText}</div>;
  }

  static _dataRender(properties){
    const className = properties.className;
    const outdated = properties.outdated;
    const data = properties.data;
    const description = properties.description;

    return (
      <Disableable disabled={outdated}>
        <Tabs className={className}>
          <TabList className={tabStyles['tab-list']}>
            <Tab className={tabStyles.tab}>Social</Tab>
            <Tab className={tabStyles.tab}>Economic</Tab>
            <Tab className={tabStyles.tab}>Ecologic</Tab>
          </TabList>

          <TabPanel>
            <Social
              data={data}
              description={description}
              chartsUnfolded={properties.chartsUnfolded}
            />
          </TabPanel>

          <TabPanel>
            <Economic
              data={data}
              description={description}
              chartsUnfolded={properties.chartsUnfolded}
            />
          </TabPanel>

          <TabPanel>
            <Ecologic
              data={data}
              description={description}
              chartsUnfolded={properties.chartsUnfolded}
            />
          </TabPanel>
        </Tabs>
      </Disableable>
    );
  }
}
