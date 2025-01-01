// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import LineBarEChart from '../../../components/charts/line-bar-echart';
import styles from './../charts.module.scss';
import Accordion from '../../../components/input/accordion/accordion';

export default function Economic(properties) {
  const data = properties.data;
  const description = properties.description;

  const energyIntensity = data.energyIntensity;
  energyIntensity.title = 'Impact on energy intensity';

  const reductionOfImportDependency = data.reductionOfImportDependency;
  reductionOfImportDependency.title = 'Impact on import dependency';

  const impactOnGrossDomesticProduct = data.impactOnGrossDomesticProduct;
  impactOnGrossDomesticProduct.title = 'Impact on gross domestic product';

  const additionalEmployment = data.additionalEmployment;
  additionalEmployment.title = 'Additional employments';

  const addedAssetValueOfBuildings = data.addedAssetValueOfBuildings;
  addedAssetValueOfBuildings.title = 'Added asset value of buildings';

  const changeInUnitCostsOfProduction = data.changeInUnitCostsOfProduction;
  changeInUnitCostsOfProduction.title = 'Change in unit costs of production';

  const turnoverOfEnergyEfficiencyGoods = data.turnoverOfEnergyEfficiencyGoods;
  turnoverOfEnergyEfficiencyGoods.title = 'Turnover of energy efficiency goods';

  const changeInSupplierDiversityByEnergyEfficiencyImpact = data.changeInSupplierDiversityByEnergyEfficiencyImpact;
  changeInSupplierDiversityByEnergyEfficiencyImpact.title = 'Change in supplier diversity by energy efficiency impact';

  return (
    <div className={styles['chart-container']}>
      <div className={styles.chart}>
      <Accordion
        title={energyIntensity.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Energy intensity in ktoe / &euro;"
          unit-factor={1}
          legend={energyIntensity.legend}
          data={energyIntensity.rows}
          description={description(energyIntensity.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={reductionOfImportDependency.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Reduction in %-points"
          unit-factor={100}
          legend={reductionOfImportDependency.legend}
          data={reductionOfImportDependency.rows}
          description={description(reductionOfImportDependency.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={impactOnGrossDomesticProduct.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Added value in M&euro;"
          unit-factor={1e-6}
          legend={impactOnGrossDomesticProduct.legend}
          data={impactOnGrossDomesticProduct.rows}
          description={description(impactOnGrossDomesticProduct.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={additionalEmployment.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Additional full-time employment years"
          unit-factor={1}
          legend={additionalEmployment.legend}
          data={additionalEmployment.rows}
          description={description(additionalEmployment.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={addedAssetValueOfBuildings.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Value in M&euro;"
          unit-factor={1e-6}
          legend={addedAssetValueOfBuildings.legend}
          data={addedAssetValueOfBuildings.rows}
          description={description(addedAssetValueOfBuildings.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={changeInUnitCostsOfProduction.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Value in &euro;/&euro;"
          unit-factor={1}
          legend={changeInUnitCostsOfProduction.legend}
          data={changeInUnitCostsOfProduction.rows}
          description={description(changeInUnitCostsOfProduction.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={turnoverOfEnergyEfficiencyGoods.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Value in &euro;"
          unit-factor={1}
          legend={turnoverOfEnergyEfficiencyGoods.legend}
          data={turnoverOfEnergyEfficiencyGoods.rows}
          description={description(turnoverOfEnergyEfficiencyGoods.title)}
        />
      </Accordion>
      </div>

      <div className={styles.chart}>
      <Accordion
        title={changeInSupplierDiversityByEnergyEfficiencyImpact.title}
        initiallyUnfolded={false}
        unfolded={properties.chartsUnfolded}
      >
        <LineBarEChart
          y-label="Value"
          unit-factor={1}
          legend={changeInSupplierDiversityByEnergyEfficiencyImpact.legend}
          data={changeInSupplierDiversityByEnergyEfficiencyImpact.rows}
          description={description(changeInSupplierDiversityByEnergyEfficiencyImpact.title)}
        />
      </Accordion>
      </div>
    </div>
  );
}
