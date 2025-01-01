// © 2024 - 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */
import React from 'react';
import Disableable from '../../../components/disableable/disableable';
import CheckboxInput from '../../../components/input/checkbox/checkbox-input';
import NumberInput from '../../../components/input/number/number-input';
import styles from './cost-benefit-analysis-input.module.scss';

export default function CostBenefitAnalysisInput(properties) {
  const initialUserOptions = _CostBenefitAnalysisInput.initialUserOptions();
  const [userOptions, setUserOptions] = React.useState(initialUserOptions);
  const userOptionsChanged = properties.userOptionsChanged;
  React.useEffect(() => userOptionsChanged(initialUserOptions), []);
  return (
    <div className={styles['input-container']}>
      <Disableable disabled={properties.outdated}>
        <div>
          <div>Paramters</div>
          <div className={styles.parameters}>
            <NumberInput
              label="Energy price sensivity:"
              endLabel="%"
              initialValue={initialUserOptions.parameters.energyPriceSensivity}
              minimumValue={0}
              maximumValue={300}
              change={(number) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'parameters',
                  'energyPriceSensivity',
                  number,
                  userOptionsChanged
                )
              }
            />
            <NumberInput
              label="Investments sensivity:"
              endLabel="%"
              initialValue={initialUserOptions.parameters.investmentsSensivity}
              minimumValue={0}
              maximumValue={300}
              change={(number) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'parameters',
                  'investmentsSensivity',
                  number,
                  userOptionsChanged
                )
              }
            />
            <NumberInput
              label="Discount rate:"
              endLabel="%"
              initialValue={initialUserOptions.parameters.discountRate}
              minimumValue={0}
              maximumValue={20}
              change={(number) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'parameters',
                  'discountRate',
                  number,
                  userOptionsChanged
                )
              }
            />
            <NumberInput
              label="Year:"
              initialValue={initialUserOptions.parameters.year}
              minimumValue={2000}
              maximumValue={2050}
              step={1}
              change={(number) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'parameters',
                  'year',
                  number,
                  userOptionsChanged
                )
              }
            />
          </div>
        </div>
        <div>
          <div>Indicators</div>
          <div className={styles.indicators}>
            <CheckboxInput
              endLabel="Reduction of energy costs"
              initialValue={initialUserOptions.indicators.reductionOfEnergyCost}
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'reductionOfEnergyCost',
                  value,
                  userOptionsChanged
                )
              }
            />
            <CheckboxInput
              endLabel="Premature deaths due to air pollution"
              initialValue={
                initialUserOptions.indicators
                  .reductionOfMortalityMorbidityMonetization
              }
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'reductionOfMortalityMorbidityMonetization',
                  value,
                  userOptionsChanged
                )
              }
            />
            <CheckboxInput
              endLabel="Avoided lost working days due to air pollution"
              initialValue={
                initialUserOptions.indicators
                  .reductionOfLostWorkDaysMonetization
              }
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'reductionOfLostWorkDaysMonetization',
                  value,
                  userOptionsChanged
                )
              }
            />
            <CheckboxInput
              endLabel="Reduction of greenhouse gas emissions"
              initialValue={initialUserOptions.indicators.reductionOfGreenHouseGasEmissionMonetization}
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'reductionOfGreenHouseGasEmissionMonetization',
                  value,
                  userOptionsChanged
                )
              }
            />
            <CheckboxInput
              endLabel="Impact on RES targets"
              initialValue={
                initialUserOptions.indicators.impactOnResTargetsMonetization
              }
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'impactOnResTargetsMonetization',
                  value,
                  userOptionsChanged
                )
              }
            />
            <CheckboxInput
              endLabel="Reduction of additional capacities"
              initialValue={initialUserOptions.indicators.reductionOfAdditionalCapacitiesInGridMonetization}
              change={(value) =>
                _CostBenefitAnalysisInput.updateUserOptions(
                  userOptions,
                  setUserOptions,
                  'indicators',
                  'reductionOfAdditionalCapacitiesInGridMonetization',
                  value,
                  userOptionsChanged
                )
              }
            />
          </div>
        </div>
      </Disableable>
    </div>
  );
}

export class _CostBenefitAnalysisInput {
  static initialUserOptions() {
    const userOptions = {
      parameters: {
        energyPriceSensivity: 100,
        investmentsSensivity: 100,
        discountRate: 3,
        year: 2030
      },
      indicators: {
        reductionOfEnergyCost: false,
        reductionOfMortalityMorbidityMonetization: false,
        reductionOfLostWorkDaysMonetization: false,
        reductionOfGreenHouseGasEmissionMonetization: false,
        impactOnResTargetsMonetization: false,
        reductionOfAdditionalCapacitiesInGridMonetization: false
      }
    };
    return userOptions;
  }

  static updateUserOptions(
    userOptions,
    setUserOptions,
    optionName,
    propertyName,
    value,
    change
  ) {
    const newUserOptions = {
      ...userOptions,
      [optionName]: {
        ...userOptions[optionName],
        [propertyName]: value
      }
    };
    setUserOptions(newUserOptions);
    change(newUserOptions);
  }
}
/* eslint-enable max-lines */
