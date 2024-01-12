// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MonetizationCharts from './monetization/monetization-charts';
import DescriptionLoader from './description-loader';
import QuantificationCharts from './quantification/quantification-charts';
import tabStyles from './../input/tab-styles.module.scss';
import { ChevronExpand } from 'react-bootstrap-icons';
import buttonStyles from './../input/table/annual-table.module.scss';
import AggregationCharts from './aggregation/aggregation-charts';
import CostBenefitAnalysisCharts from './cost-benefit-analysis/cost-benefit-analysis-charts';
import CostBenefitAnalysisInput from '../input/cost-benefit-analysis/cost-benefit-analysis-input';
import CostBenefitAnalysis from '../../calculation/cost-benefit-analysis/cost-benefit-analysis';
// import NetPresentValue from '../../calculation/cost-benefit-analysis/net-present-value';
// import CostBenefitRatio from '../../calculation/cost-benefit-analysis/cost-benefit-ratio';

export default function ChartSummary(
  properties,
  indicatorData,
  inputIsInitialized,
  inputIsStale,
  savingsData
) {
  const settings = properties.settings;
  const [chartsUnfolded, setChartsUnfolded] = React.useState(false);
  const [descriptions, setDescriptions] = React.useState([]);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [userOptions, setUserOptions] = React.useState();
  const [costBenefitAnalysisResults, setCostBenefitAnalysisResults] =
    React.useState();
  // console.log('CBA results', costBenefitAnalysisResults);

  React.useEffect(() => {
    _ChartSummary.calculateCostBenefitAnalysis(
      savingsData,
      indicatorData,
      userOptions,
      setCostBenefitAnalysisResults
    );
  }, [savingsData, userOptions]);

  DescriptionLoader.useIfEnabled(settings, setDescriptions);
  const description = _ChartSummary.description(descriptions);
  const analysisModeTabs = _ChartSummary.analysisModeTabs(
    properties,
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    description,
    chartsUnfolded,
    setChartsUnfolded,
    userOptions,
    setUserOptions,
    costBenefitAnalysisResults
  );
  return analysisModeTabs;
}

export class _ChartSummary {
  static calculateCostBenefitAnalysis(
    savingsData,
    indicatorData,
    userOptions,
    setCostBenefitAnalysis
  ) {
    const costBenefitAnalysisResults =
      CostBenefitAnalysis.calculateCostBenefitAnalysis(
        savingsData,
        indicatorData,
        userOptions
      );
    // console.log('Cost benefit analysis results:', costBenefitAnalysisResults);
    setCostBenefitAnalysis(costBenefitAnalysisResults);
  }

  static description(descriptions) {
    return function (key) {
      return DescriptionLoader.getDescription(key, descriptions);
    };
  }

  static analysisModeTabs(
    properties,
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    description,
    chartsUnfolded,
    setChartsUnfolded,
    userOptions,
    setUserOptions,
    costBenefitAnalysisResults
  ) {
    const toggleCollapseButton = this.toggleCollapseButton(
      chartsUnfolded,
      setChartsUnfolded
    );

    const indicatorCharts = this.quantificationCharts(
      properties,
      indicatorData,
      inputIsInitialized,
      inputIsStale,
      description,
      chartsUnfolded
    );

    const monetizationCharts = this.monetizationCharts(
      indicatorData,
      inputIsInitialized,
      inputIsStale,
      description,
      chartsUnfolded
    );

    const aggregationCharts = this.aggregationCharts(
      indicatorData,
      inputIsInitialized,
      inputIsStale,
      description,
      chartsUnfolded
    );

    const costBenefitAnalysis = this.costBenefitAnalysis(
      costBenefitAnalysisResults,
      inputIsStale,
      userOptions,
      setUserOptions,
      description,
      chartsUnfolded
    );

    return (
      <div>
        {toggleCollapseButton}
        <Tabs>
          <TabList className={tabStyles['tab-list']}>
            <Tab className={tabStyles.tab}>Quantification</Tab>
            <Tab className={tabStyles.tab}>Monetisation</Tab>
            <Tab className={tabStyles.tab}>Aggregation</Tab>
            <Tab className={tabStyles.tab}>Cost Benefit Analysis</Tab>
          </TabList>

          <TabPanel>{indicatorCharts}</TabPanel>

          <TabPanel>{monetizationCharts}</TabPanel>

          <TabPanel>{aggregationCharts}</TabPanel>

          <TabPanel>{costBenefitAnalysis}</TabPanel>
        </Tabs>
      </div>
    );
  }

  static toggleCollapseButton(chartsUnfolded, setChartsUnfolded) {
    return (
      <button
        className={buttonStyles['icon-button']}
        onClick={() => setChartsUnfolded(!chartsUnfolded)}
      >
        <ChevronExpand /> Expand / collapse all charts
      </button>
    );
  }

  static costBenefitAnalysis(
    costBenefitAnalysisData,
    inputIsStale,
    userOptions,
    setUserOptions,
    description,
    chartsUnfolded
  ) {
    return (
      <>
        <CostBenefitAnalysisInput
          userOptionsChanged={newUserOptions =>
            this._convertUserOptions(newUserOptions, setUserOptions)
          }
          outdated={inputIsStale}
        />
        <CostBenefitAnalysisCharts
          costBenefitAnalysisData={costBenefitAnalysisData}
          description={key => description(key)}
          outdated={inputIsStale}
          chartsUnfolded={chartsUnfolded}
          userOptions={userOptions}
        />
      </>
    );
  }

  static _convertUserOptions(userOptions, setUserOptions) {
    const newUserOptions = structuredClone(userOptions);
    newUserOptions.parameters.energyPriceSensivity =
      userOptions.parameters.energyPriceSensivity / 100;
    newUserOptions.parameters.investmentsSensivity =
      userOptions.parameters.investmentsSensivity / 100;
    newUserOptions.parameters.discountRate =
      userOptions.parameters.discountRate / 100;
    setUserOptions(newUserOptions);
  }

  static aggregationCharts(
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    description,
    chartsUnfolded
  ) {
    return (
      <AggregationCharts
        data={indicatorData}
        description={key => description(key)}
        initialized={inputIsInitialized}
        outdated={inputIsStale}
        chartsUnfolded={chartsUnfolded}
      />
    );
  }

  static monetizationCharts(
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    description,
    chartsUnfolded
  ) {
    return (
      <MonetizationCharts
        data={indicatorData}
        description={key => description(key)}
        initialized={inputIsInitialized}
        outdated={inputIsStale}
        chartsUnfolded={chartsUnfolded}
      />
    );
  }

  static quantificationCharts(
    properties,
    indicatorData,
    inputIsInitialized,
    inputIsStale,
    description,
    chartsUnfolded
  ) {
    return (
      <QuantificationCharts
        settings={properties.settings}
        data={indicatorData}
        description={description}
        defaultText={
          'Please specify final energy savings and click on "Apply".'
        }
        initialized={inputIsInitialized}
        outdated={inputIsStale}
        chartsUnfolded={chartsUnfolded}
      ></QuantificationCharts>
    );
  }
}
