// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';

import Calculation from '../../calculation/calculation';
import Input from '../input/input';
import ChartSummary from '../output/chart-summary';

import styles from './indicators.module.scss';

export default function Indicators(properties) {
  const [indicatorData, setIndicatorData] = React.useState();
  const [savingsData, setSavingsData] = React.useState();
  const [inputIsInitialized, setInputIsInitialized] = React.useState(false);
  const [inputIsStale, setInputIsStale] = React.useState(false);

  const input = _Indicators.input(
    properties,
    indicatorData,
    setIndicatorData,
    inputIsInitialized,
    setInputIsInitialized,
    inputIsStale,
    setInputIsStale,
    setSavingsData
  );

  const chartSummary = _Indicators.chartSummary(
    properties,
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    savingsData
  );

  return (
    <div className={styles['indicators-container']}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            {input}
            {chartSummary}
          </div>
        </div>
      </div>
    </div>
  );
}

export class _Indicators {
  static input(
    properties,
    indicatorData,
    setIndicatorData,
    inputIsInitialized,
    setInputIsInitialized,
    inputIsStale,
    setInputIsStale,
    setSavingsData
  ) {
    return (
      <Input
        context={properties}
        router={properties.router}
        change={async (idRegion, savingsPayload) =>
          await _Indicators._inputChanged(
            idRegion,
            savingsPayload,
            properties,
            setIndicatorData,
            setInputIsInitialized,
            setSavingsData
          )
        }
        staleHandler={inputIsStale => setInputIsStale(inputIsStale)}
        indicatorData={indicatorData}
        inputIsInitialized={inputIsInitialized}
        inputIsStale={inputIsStale}
        settings={properties.settings}
      ></Input>
    );
  }

  static async _inputChanged(
    idRegion,
    savingsPayload,
    properties,
    setIndicatorData,
    setInputIsInitialized,
    setSavingsData
  ) {
    const indicatorData = await Calculation.calculateIndicatorData(
      properties.settings,
      properties.idMode,
      idRegion,
      savingsPayload
    );
    setIndicatorData(indicatorData);
    setInputIsInitialized(true);
    setSavingsData(savingsPayload);
  }

  static chartSummary(
    properties,
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    savingsData
  ) {
    const chartSummary = ChartSummary(
      properties,
      indicatorData,
      inputIsInitialized,
      inputIsStale,
      savingsData
    );
    return chartSummary;
  }
}
