// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import Disableable from '../../../components/disableable/disableable';
import Accordion from '../../../components/input/accordion/accordion';
import BarMekkoEChart from '../../../components/charts/bar-mekko-echart';
import LineBarEChart from '../../../components/charts/line-bar-echart';
import ObjectTools from '../../../calculation/object-tools';
import styles from './../charts.module.scss';

export default function CostBenefitAnalysisCharts(properties) {
  const costBenefitAnalysisData = properties.costBenefitAnalysisData;
  if (!costBenefitAnalysisData) {
    return <div></div>;
  }
  for (const key of Object.keys(costBenefitAnalysisData)) {
    if (!costBenefitAnalysisData[key]) {
      return <div></div>;
    }
  }
  const costBenefitAnalysisFacility =
    _CostBenefitAnalysisCharts.costBenefitAnalysisFacility(
      properties,
      costBenefitAnalysisData
    );
  const netPresentValue = _CostBenefitAnalysisCharts.netPresentValue(
    properties,
    costBenefitAnalysisData
  );
  const costBenefitRatio = _CostBenefitAnalysisCharts.costBenefitRatio(
    properties,
    costBenefitAnalysisData
  );
  const levelisedCosts = _CostBenefitAnalysisCharts.levelisedCosts(
    properties,
    costBenefitAnalysisData
  );
  const fundingEfficiency = _CostBenefitAnalysisCharts.fundingEfficiency(
    properties,
    costBenefitAnalysisData
  );
  const marginalCostCurves = _CostBenefitAnalysisCharts.marginalCostCurves(
    properties,
    costBenefitAnalysisData
  );
  return (
    <div className={styles['chart-container']}>
      <Disableable disabled={properties.outdated}>
        {costBenefitAnalysisFacility}
        {netPresentValue}
        {costBenefitRatio}
        {levelisedCosts}
        {fundingEfficiency}
        {marginalCostCurves}
      </Disableable>
    </div>
  );
}

export class _CostBenefitAnalysisCharts {
  static marginalCostCurves(properties, costBenefitAnalysisData) {
    const year = properties.userOptions.parameters.year;
    const marginalEnergySavingsCostCurve = this.convertDataForBarMekkoChart(
      costBenefitAnalysisData.marginalCostCurves
        .marginalEnergySavingsCostCurves,
      year
    );
    marginalEnergySavingsCostCurve.title = 'Marginal energy savings cost curve';
    const marginalCo2SavingsCostCurve = this.convertDataForBarMekkoChart(
      costBenefitAnalysisData.marginalCostCurves.marginalCo2SavingsCostCurves,
      year
    );
    marginalCo2SavingsCostCurve.title = 'Marginal CO2 savings cost curve';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Marginal cost curves'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <p>
            <b>{marginalEnergySavingsCostCurve.title + ' for ' + year}</b>
          </p>
          {
            <BarMekkoEChart
              data={marginalEnergySavingsCostCurve}
              x-label={'Totally generated energy savings'}
              // eslint-disable-next-line sonarjs/no-duplicate-string
              y-label={'Levelised costs of saved CO2'}
              dataDimensionNames={[
                'from',
                'to',
                'Levelised costs of saved CO2',
                'Totally generated energy savings'
              ]}
              description={description(marginalEnergySavingsCostCurve.title)}
            />
          }
          <p>
            <b>{marginalCo2SavingsCostCurve.title + ' for ' + year}</b>
          </p>
          {
            <BarMekkoEChart
              data={marginalCo2SavingsCostCurve}
              x-label={'Totally generated CO2 savings'}
              // eslint-disable-next-line sonarjs/no-duplicate-string
              y-label={'Levelised costs of saved CO2'}
              dataDimensionNames={[
                'from',
                'to',
                'Levelised costs of saved CO2',
                'Totally generated CO2 savings'
              ]}
              description={description(marginalCo2SavingsCostCurve.title)}
            />
          }
        </Accordion>
      </div>
    );
  }

  static fundingEfficiency(properties, costBenefitAnalysisData) {
    const fundingEfficiencyOfEnergySavings = this.convertDataForLineChart(
      costBenefitAnalysisData.fundingEfficiency.fundingEfficiencyOfEnergySavings,
      costBenefitAnalysisData.supportingYears
    );
    fundingEfficiencyOfEnergySavings.title =
      'Funding efficiency of energy savings';
    const fundingEfficiencyOfCo2Reductions = this.convertDataForLineChart(
      costBenefitAnalysisData.fundingEfficiency.fundingEfficiencyOfCo2Reductions,
      costBenefitAnalysisData.supportingYears
    );
    fundingEfficiencyOfCo2Reductions.title =
      'Funding efficiency of CO2 reductions';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Funding efficiency'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            title={fundingEfficiencyOfEnergySavings.title}
            data={fundingEfficiencyOfEnergySavings}
            description={description(fundingEfficiencyOfEnergySavings.title)}
          />
          <LineBarEChart
            title={fundingEfficiencyOfCo2Reductions.title}
            data={fundingEfficiencyOfCo2Reductions}
            description={description(fundingEfficiencyOfCo2Reductions.title)}
          />
        </Accordion>
      </div>
    );
  }

  static levelisedCosts(properties, costBenefitAnalysisData) {
    const levelisedCostsOfSavedEnergies = this.convertDataForLineChart(
      costBenefitAnalysisData.levelisedCosts.levelisedCostsOfSavedEnergies,
      costBenefitAnalysisData.supportingYears
    );
    levelisedCostsOfSavedEnergies.title = 'Levelised costs of saved energy';
    const levelisedCostsOfSavedCo2 = this.convertDataForLineChart(
      costBenefitAnalysisData.levelisedCosts.levelisedCostsOfSavedCo2,
      costBenefitAnalysisData.supportingYears
    );
    levelisedCostsOfSavedCo2.title = 'Levelised costs of saved CO2';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Levelised costs'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            title={levelisedCostsOfSavedEnergies.title}
            data={levelisedCostsOfSavedEnergies}
            description={description(levelisedCostsOfSavedEnergies.title)}
          />
          <LineBarEChart
            title={levelisedCostsOfSavedCo2.title}
            data={levelisedCostsOfSavedCo2}
            description={description(levelisedCostsOfSavedCo2.title)}
          />
        </Accordion>
      </div>
    );
  }

  static costBenefitRatio(properties, costBenefitAnalysisData) {
    const costBenefitRatios = this.convertDataForLineChart(
      costBenefitAnalysisData.costBenefitRatio.costBenefitRatios,
      costBenefitAnalysisData.supportingYears
    );
    costBenefitRatios.title = 'Cost-benefit ratio';
    const benefitCostRatios = this.convertDataForLineChart(
      costBenefitAnalysisData.costBenefitRatio.benefitCostRatios,
      costBenefitAnalysisData.supportingYears
    );
    benefitCostRatios.title = 'Benefit-cost ratio';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Cost-benefit ratio'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            title={costBenefitRatios.title}
            data={costBenefitRatios}
            description={description(costBenefitRatios.title)}
          />
          <LineBarEChart
            title={benefitCostRatios.title}
            data={benefitCostRatios}
            description={description(benefitCostRatios.title)}
          />
        </Accordion>
      </div>
    );
  }

  static netPresentValue(properties, costBenefitAnalysisData) {
    const netPresentValues = this.convertDataForLineChart(
      costBenefitAnalysisData.netPresentValue.netPresentValues,
      costBenefitAnalysisData.supportingYears
    );
    netPresentValues.title = 'Net present value';
    const annuatisedEnergyCosts = this.convertDataForLineChart(
      costBenefitAnalysisData.netPresentValue.annuatisedEnergyCosts,
      costBenefitAnalysisData.supportingYears
    );
    annuatisedEnergyCosts.title = 'Annuatised energy costs';
    const annuatisedMultipleImpacts = this.convertDataForLineChart(
      costBenefitAnalysisData.netPresentValue.annuatisedMultipleImpacts,
      costBenefitAnalysisData.supportingYears
    );
    annuatisedMultipleImpacts.title = 'Annuatised multiple impacts';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Net present value'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            title={netPresentValues.title}
            data={netPresentValues}
            description={description(netPresentValues.title)}
          />
          <LineBarEChart
            title={annuatisedEnergyCosts.title}
            data={annuatisedEnergyCosts}
            description={description(annuatisedEnergyCosts.title)}
          />
          <LineBarEChart
            title={annuatisedMultipleImpacts.title}
            data={annuatisedMultipleImpacts}
            description={description(annuatisedMultipleImpacts.title)}
          />
        </Accordion>
      </div>
    );
  }

  static costBenefitAnalysisFacility(properties, costBenefitAnalysisData) {
    const newEnergySavings = this.convertDataForLineChart(
      costBenefitAnalysisData.costBenefitAnalysisFacility.newEnergySavings,
      costBenefitAnalysisData.supportingYears
    );
    newEnergySavings.title = 'New energy savings';
    const newInvestments = this.convertDataForLineChart(
      costBenefitAnalysisData.costBenefitAnalysisFacility.newInvestments,
      costBenefitAnalysisData.supportingYears
    );
    newInvestments.title = 'New investments';
    const description = properties.description;
    return (
      <div className={styles.chart}>
        <Accordion
          title={'Cost-benefit-analysis facility'}
          initiallyUnfolded={false}
          unfolded={properties.chartsUnfolded}
        >
          <LineBarEChart
            title={newEnergySavings.title}
            data={newEnergySavings}
            description={description(newEnergySavings.title)}
          />
          <LineBarEChart
            title={newInvestments.title}
            data={newInvestments}
            description={description(newInvestments.title)}
          />
        </Accordion>
      </div>
    );
  }

  static convertDataForLineChart(data, supportingYears) {
    const displayData = [];
    for (const measure of data) {
      const measureData = structuredClone(measure.data);
      if(supportingYears) {
        for(const year of Object.keys(measureData)) {
          if(!supportingYears.includes(year)) {
            delete measureData[year];
          }
        }
      }
      const zippedData = ObjectTools.zipKeysAndValues(measureData);
      displayData.push({
        name: 'Measure ' + measure.id_measure,
        data: zippedData,
        type: 'line'
      });
    }
    return displayData;
  }

  static convertDataForBarMekkoChart(data, displayYear, sortData = true) {
    const displayData = [];
    let startX = 0;
    if (sortData) {
      data.sort((entry1, entry2) => {
        // eslint-disable-next-line no-unused-expressions
        let result;
        entry1.data[displayYear].barHeight > entry2.data[displayYear].barHeight
          ? result = -1
          : result = 1;
        return result;
      });
    }
    for (const measureData of data) {
      const idMeasure = measureData.id_measure;
      const selectedYearData = measureData.data[displayYear];
      if (selectedYearData) {
        const endX = startX + Math.abs(selectedYearData.barWidth);
        const barHeight = selectedYearData.barHeight;
        const title = 'Measure ' + idMeasure;
        displayData.push([startX, endX, barHeight, title]);
        startX = endX;
      } else {
        continue;
      }
    }
    return displayData;
  }
}
/* eslint-enable max-lines */
