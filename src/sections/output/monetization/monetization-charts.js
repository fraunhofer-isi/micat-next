// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import LineBarEChart from '../../../components/charts/line-bar-echart';
import styles from '../charts.module.scss';
import Disableable from '../../../components/disableable/disableable';
import Accordion from '../../../components/input/accordion/accordion';
import ChartUtils from '../chart-utils';

export default function MonetizationCharts(properties) {
  if (!properties.initialized) {
    return <></>;
  }
  const data = ChartUtils.prepareData(properties.data);
  const description = properties.description;

  return (
    <div className={styles['chart-container']}>
      <Disableable disabled={properties.outdated}>
        <div className={styles.chart}>
        <Accordion
          title={data.reductionOfEnergyCost.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label={data.reductionOfEnergyCost.yLabel}
            unit-factor={data.reductionOfEnergyCost.unitFactor}
            legend={data.reductionOfEnergyCost.legend}
            data={data.reductionOfEnergyCost.rows}
            description={description(data.reductionOfEnergyCost.title)}
          />
        </Accordion>
        </div>

        <div className={styles.chart}>
        <Accordion
          title={data.reductionOfMortalityMorbidityMonetization.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
          className={styles.chart}
        >
          <LineBarEChart
            y-label={data.reductionOfMortalityMorbidityMonetization.yLabel}
            unit-factor={data.reductionOfMortalityMorbidityMonetization.unitFactor}
            legend={data.reductionOfMortalityMorbidityMonetization.legend}
            data={data.reductionOfMortalityMorbidityMonetization.rows}
            description={description(data.reductionOfMortalityMorbidityMonetization.title)}
          />
        </Accordion>
        </div>

        <div className={styles.chart}>
        <Accordion
          title={data.reductionOfLostWorkDaysMonetization.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label={data.reductionOfLostWorkDaysMonetization.yLabel}
            unit-factor={data.reductionOfLostWorkDaysMonetization.unitFactor}
            legend={data.reductionOfLostWorkDaysMonetization.legend}
            data={data.reductionOfLostWorkDaysMonetization.rows}
            description={description(data.reductionOfLostWorkDaysMonetization.title)}
          />
        </Accordion>
        </div>

        <div className={styles.chart}>
        <Accordion
          title={data.reductionOfGreenHouseGasEmissionMonetization.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label={data.reductionOfGreenHouseGasEmissionMonetization.yLabel}
            unit-factor={
              data.reductionOfGreenHouseGasEmissionMonetization.unitFactor
            }
            legend={data.reductionOfGreenHouseGasEmissionMonetization.legend}
            data={data.reductionOfGreenHouseGasEmissionMonetization.rows}
            description={description(data.reductionOfGreenHouseGasEmissionMonetization.title)}
          />
        </Accordion>
        </div>

        <div className={styles.chart}>
        <Accordion
          title={data.impactOnResTargetsMonetization.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label={data.impactOnResTargetsMonetization.yLabel}
            unit-factor={data.impactOnResTargetsMonetization.unitFactor}
            legend={data.impactOnResTargetsMonetization.legend}
            data={data.impactOnResTargetsMonetization.rows}
            description={description(data.impactOnResTargetsMonetization.title)}
          />
        </Accordion>
        </div>

        <div className={styles.chart}>
        <Accordion
          title={data.reductionOfAdditionalCapacitiesInGridMonetization.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label={data.reductionOfAdditionalCapacitiesInGridMonetization.yLabel}
            unit-factor={data.reductionOfAdditionalCapacitiesInGridMonetization.unitFactor}
            legend={data.reductionOfAdditionalCapacitiesInGridMonetization.legend}
            data={data.reductionOfAdditionalCapacitiesInGridMonetization.rows}
            description={description(data.reductionOfAdditionalCapacitiesInGridMonetization.title)}
          />
        </Accordion>
        </div>

      </Disableable>
    </div>
  );
}
