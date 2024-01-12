// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import MonetizationSummary from './../monetization/monetization-summary';
import styles from '../charts.module.scss';
import Disableable from '../../../components/disableable/disableable';
import Accordion from '../../../components/input/accordion/accordion';
import ChartUtils from '../chart-utils';

export default function AggregationCharts(properties) {
  if (!properties.initialized) {
    return <></>;
  }
  const data = ChartUtils.prepareData(properties.data);

  const summaryData = [
    data.reductionOfEnergyCost,
    data.reductionOfGreenHouseGasEmissionMonetization,
    data.impactOnResTargetsMonetization,
    data.impactOnGrossDomesticProduct,
    data.reductionOfMortalityMorbidityMonetization,
    data.reductionOfLostWorkDaysMonetization
  ];

  const exampleRowForLastYear =
    data.reductionOfLostWorkDaysMonetization.rows.at(-1);
  const year = exampleRowForLastYear[0];
  return (
    <div className={styles['chart-container']}>
      <Disableable disabled={properties.outdated}>
        <div className={styles.chart}>
          <Accordion
            title={'Overview of monetised impacts'}
            initiallyUnfolded={false}
            unfolded={properties.chartsUnfolded}
          >
            <MonetizationSummary
              summaryData={summaryData}
              year={year}
              width={'100%'}
              height={450}
            />
          </Accordion>
        </div>
      </Disableable>
    </div>
  );
}
