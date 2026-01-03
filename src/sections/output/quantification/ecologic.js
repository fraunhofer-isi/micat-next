// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import LineBarEChart from '../../../components/charts/line-bar-echart';
import styles from '../charts.module.scss';
import Accordion from '../../../components/input/accordion/accordion';

export default function Ecologic(properties) {
  const data = properties.data;
  const description = properties.description;
  const reductionOfAirPollution = data.reductionOfAirPollution;
  reductionOfAirPollution.title = 'Reduction in air pollution';
  const reductionOfGreenHouseGasEmission = data.reductionOfGreenHouseGasEmission;
  reductionOfGreenHouseGasEmission.title = 'Reduction in greenhouse gas emissions';
  const energySaving = data.energySaving;
  energySaving.title = 'Primary savings by fuel';
  const renewableEnergyDirectiveTargets = data.renewableEnergyDirectiveTargets;
  renewableEnergyDirectiveTargets.title = 'Impact on RES targets';
  const reductionOfAdditionalCapacitiesInGrid = data.reductionOfAdditionalCapacitiesInGrid;
  reductionOfAdditionalCapacitiesInGrid.title = 'Reduction of additional capacities in grid';

  return (
    <div className={styles['chart-container']}>
      <div className={styles.chart}>
      <Accordion
        title={energySaving.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Primary savings in ktoe"
          unit-factor={1}
          legend={energySaving.legend}
          data={energySaving.rows}
          description={description(energySaving.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={reductionOfAirPollution.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Reduction in kt"
          unit-factor={1}
          legend={reductionOfAirPollution.legend}
          data={reductionOfAirPollution.rows}
          description={description(reductionOfAirPollution.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={reductionOfGreenHouseGasEmission.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Reduction in ktCO2"
          unit-factor={1}
          legend={reductionOfGreenHouseGasEmission.legend}
          data={reductionOfGreenHouseGasEmission.rows}
          description={description(reductionOfGreenHouseGasEmission.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={renewableEnergyDirectiveTargets.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Change in share in %-points"
          unit-factor={100}
          legend={renewableEnergyDirectiveTargets.legend}
          data={renewableEnergyDirectiveTargets.rows}
          description={description(renewableEnergyDirectiveTargets.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={reductionOfAdditionalCapacitiesInGrid.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Reduction in ktoe"
          unit-factor={1}
          legend={reductionOfAdditionalCapacitiesInGrid.legend}
          data={reductionOfAdditionalCapacitiesInGrid.rows}
          description={description(reductionOfAdditionalCapacitiesInGrid.title)}
        />
      </Accordion>
      </div>

    </div>
  );
}
