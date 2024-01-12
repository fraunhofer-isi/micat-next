// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import LineBarEChart from '../../../components/charts/line-bar-echart';
import styles from '../charts.module.scss';
import Accordion from '../../../components/input/accordion/accordion';

export default function Social(properties) {
  const data = properties.data;
  const description = properties.description;

  const reductionOfMortalityMorbidity = data.reductionOfMortalityMorbidity;
  reductionOfMortalityMorbidity.title = 'Avoided premature mortality due to air pollution';

  // const formattedRows = reductionOfMortalityMorbidity.rows.map(([year, value]) => [year, Number(value).toFixed(3)]);
  // reductionOfMortalityMorbidity.rows = formattedRows;

  const reductionOfLostWorkDays = data.reductionOfLostWorkDays;
  reductionOfLostWorkDays.title = 'Avoided lost working days due to air pollution';
  const reductionOfEnergyPoverty = data.alleviationOfEnergyPovertyM2;
  reductionOfEnergyPoverty.title = 'Energy poverty';

  return (
    <div className={styles['chart-container']}>
      <div className={styles.chart}>
        <Accordion
          title={reductionOfMortalityMorbidity.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label="Reduction in casualties"
            unit-factor={1}
            legend={reductionOfMortalityMorbidity.legend}
            data={reductionOfMortalityMorbidity.rows}
            description={description(reductionOfMortalityMorbidity.title)}
          />
        </Accordion>
      </div>

      <div className={styles.chart}>
        <Accordion
          title={reductionOfLostWorkDays.title}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            y-label="Avoided absences in days"
            unit-factor={1}
            legend={reductionOfLostWorkDays.legend}
            data={reductionOfLostWorkDays.rows}
            description={description(reductionOfMortalityMorbidity.title)}
          />
        </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={reductionOfEnergyPoverty.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="People lifted out of energy poverty"
          unit-factor={1}
          legend={reductionOfEnergyPoverty.legend}
          data={reductionOfEnergyPoverty.rows}
          description={description(reductionOfEnergyPoverty.title)}
        />
      </Accordion>
      </div>

    </div>

  );
}
